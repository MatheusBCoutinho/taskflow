
import { test } from 'node:test';
import assert from 'node:assert/strict';

// Configuração do ambiente de teste
// Usamos um banco SQLite em memória para não alterar os dados reais.
process.env.NODE_ENV = 'test';
process.env.DB_FILE = ':memory:';

// Importação dinâmica após configurar o ambiente
const { app, db } = await import('../server.js');

test('CRUD de tarefas', async () => {
  // Inicia o servidor em uma porta disponível
  const server = app.listen(0);

  try {
    // Garante que o servidor esteja pronto para receber requisições
    if (!server.listening) {
      await new Promise((resolve, reject) => {
        server.once('listening', resolve);
        server.once('error', reject);
      });
    }

    const port = server.address().port;
    const base = `http://127.0.0.1:${port}/api/tasks`;

    // =====================================
    // CREATE - Criar uma tarefa
    // =====================================
    const created = await fetch(base, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Teste automatizado'
      })
    });

    assert.equal(created.status, 201);

    const task = await created.json();
    assert.ok(task.id);

    // =====================================
    // READ - Consultar tarefas
    // =====================================
    const response = await fetch(base);

    assert.equal(response.status, 200);

    const tasks = await response.json();

    assert.ok(
      tasks.some(item => item.id === task.id)
    );

    // =====================================
    // UPDATE - Atualizar o status
    // =====================================
    const updated = await fetch(`${base}/${task.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        status: 'done'
      })
    });

    assert.equal(updated.status, 200);

    const updatedTask = await updated.json();

    assert.equal(updatedTask.status, 'done');

    // =====================================
    // DELETE - Excluir a tarefa
    // =====================================
    const deleted = await fetch(`${base}/${task.id}`, {
      method: 'DELETE'
    });

    assert.equal(deleted.status, 204);

    // Confirma que a tarefa foi excluída
    const deletedCheck = await fetch(`${base}/${task.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        status: 'todo'
      })
    });

    assert.equal(deletedCheck.status, 404);

  } finally {
    // Encerra as conexões HTTP
    await new Promise((resolve, reject) => {
      server.close(error => {
        if (error) reject(error);
        else resolve();
      });

      server.closeIdleConnections();
    });

    // Fecha o banco SQLite
    db.close();
  }
});
