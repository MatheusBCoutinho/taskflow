import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const stages = [{id:'todo', name:'A fazer'}, {id:'doing', name:'Em andamento'}, {id:'done', name:'Concluído'}];
function App() {
  const [tasks,setTasks] = useState([]), [title,setTitle] = useState(''), [error,setError] = useState(''), [loading,setLoading]=useState(true);
  async function load(){ try { const r=await fetch(`${API}/tasks`); if(!r.ok)throw Error('Falha ao buscar tarefas'); setTasks(await r.json()); setError(''); }catch(e){setError(e.message)}finally{setLoading(false)} }
  useEffect(()=>{load()},[]);
  async function send(url,method,body){try{const r=await fetch(url,{method,headers:{'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});if(!r.ok)throw Error((await r.json()).error||'Erro ao salvar');await load();setError('');return true}catch(e){setError(e.message);return false}}
  async function add(e){e.preventDefault();if(await send(`${API}/tasks`,'POST',{title}))setTitle('')}
  return <main className="shell"><header><span className="eyebrow">FULL STACK PROJECT</span><h1>Task<span>Flow</span></h1><p>Organize as tarefas sem complicação.</p></header>
    <section className="composer"><form onSubmit={add}><input value={title} onChange={e=>setTitle(e.target.value)} maxLength={120} placeholder="O que precisa ser feito?" required/><button type="submit">+ Adicionar</button></form></section>
    {error && <p role="alert" className="error">{error}. Confira se a API está em execução.</p>}
    <div className="stats"><strong>{tasks.length} tarefas</strong><strong>{tasks.filter(t=>t.status==='done').length} concluídas</strong></div>
    {loading?<p>Carregando...</p>:<section className="board">{stages.map(stage=><div className="column" key={stage.id}><h2>{stage.name} <small>{tasks.filter(t=>t.status===stage.id).length}</small></h2>{tasks.filter(t=>t.status===stage.id).map(t=><article className="task" key={t.id}><b>{t.title}</b><div className="actions"><select aria-label={`Status de ${t.title}`} value={t.status} onChange={e=>send(`${API}/tasks/${t.id}`,'PATCH',{status:e.target.value})}>{stages.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</select><button className="danger" onClick={()=>send(`${API}/tasks/${t.id}`,'DELETE')}>Excluir</button></div></article>)}</div>)}</section>}
    <footer>React · Express · SQLite | Projeto demonstrativo, sem autenticação</footer></main>
}
createRoot(document.getElementById('root')).render(<App/>);
