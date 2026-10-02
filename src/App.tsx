import React, { useState } from 'react';
import { Menu, X, User, LogOut, ShoppingCart, Gamepad2, Trophy, Users, Headphones, Sparkles, Copy, Check, Zap } from 'lucide-react';

type Tab = 'home'|'server'|'vip'|'store'|'events'|'community'|'support'|'profile'|'admin';
type Player = { nickname:string; orders:number; spent:number };
type Product = { id:string; name:string; description:string; price:number; category:string };

const products: Product[] = [
  {id:'vip1',name:'VIP NetCraft',description:'Benefícios exclusivos para jogar no servidor.',price:9.9,category:'VIP'},
  {id:'vip2',name:'VIP Elite',description:'Mais vantagens, comandos e benefícios exclusivos.',price:19.9,category:'VIP'},
  {id:'vip3',name:'VIP Supremo',description:'O pacote completo para quem quer mais no servidor.',price:39.9,category:'VIP'},
  {id:'kit1',name:'Kit Inicial',description:'Itens para começar sua aventura.',price:4.9,category:'KITS'},
  {id:'kit2',name:'Kit Guerreiro',description:'Equipamentos para enfrentar os desafios.',price:12.9,category:'KITS'}
];
const events = [
  ['Evento de Abertura','Atividades especiais do NETCRAFTBR.','Em breve'],
  ['Desafio dos Jogadores','Desafios e recompensas para a comunidade.','Em breve'],
  ['Guerra de Clãs','Dispute território com outros clãs.','Em breve']
];
const money=(n:number)=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

export default function App(){
  const [tab,setTab]=useState<Tab>('home');
  const [player,setPlayer]=useState<Player|null>(()=>{try{return JSON.parse(localStorage.getItem('ncbr_player')||'null')}catch{return null}});
  const [login,setLogin]=useState(!player);
  const [nick,setNick]=useState('');
  const [error,setError]=useState('');
  const [mobile,setMobile]=useState(false);
  const [buy,setBuy]=useState<Product|null>(null);
  const [livepix,setLivepix]=useState(()=>localStorage.getItem('ncbr_livepix')||'');
  const [admin,setAdmin]=useState(()=>localStorage.getItem('ncbr_admin')==='1');
  const [password,setPassword]=useState('');
  const [copied,setCopied]=useState(false);
  const nav:[Tab,string][]=[['home','Início'],['server','Servidor'],['vip','VIP'],['store','Loja'],['events','Eventos'],['community','Comunidade'],['support','Suporte']];

  const go=(t:Tab)=>{setTab(t);setMobile(false);window.scrollTo(0,0)};
  const enter=()=>{const n=nick.trim();if(n.length<3||n.length>32){setError('O nickname deve conter entre 3 e 32 caracteres.');return}const p={nickname:n,orders:player?.nickname.toLowerCase()===n.toLowerCase()?player?.orders||0:0,spent:player?.nickname.toLowerCase()===n.toLowerCase()?player?.spent||0:0};localStorage.setItem('ncbr_player',JSON.stringify(p));setPlayer(p);setLogin(false);setError('')};
  const logout=()=>{localStorage.removeItem('ncbr_player');setPlayer(null);setLogin(true);go('home')};
  const copy=()=>{navigator.clipboard?.writeText('BotuCraft.bed.net.br:21056');setCopied(true);setTimeout(()=>setCopied(false),1500)};

  return <div className="min-h-screen bg-[#05080c] text-zinc-100">
    <div className="fixed inset-0 -z-10 bg-[#05080c]"><div className="absolute inset-0 bg-cover bg-center opacity-[.12]" style={{backgroundImage:"url('/hero_sunset.jpg')"}}/><div className="absolute inset-0 bg-gradient-to-b from-[#05080c]/70 via-[#05080c]/95 to-[#05080c]"/></div>
    <header className="sticky top-0 z-40 border-b border-white/[.07] bg-[#05080c]/90 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
      <button onClick={()=>go('home')} className="flex items-center gap-2 font-black"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400 text-black"><Zap size={18}/></span>NETCRAFT<span className="text-emerald-400">BR</span></button>
      <nav className="hidden gap-1 lg:flex">{nav.map(([id,label])=><button key={id} onClick={()=>go(id)} className={`rounded-lg px-3 py-2 text-xs font-bold ${tab===id?'bg-white/10 text-white':'text-zinc-400 hover:text-white'}`}>{label}</button>)}</nav>
      <div className="flex items-center gap-2">{player?<button onClick={()=>go('profile')} className="hidden rounded-xl border border-white/10 px-3 py-2 text-xs font-bold sm:flex"><User size={14} className="mr-2 text-emerald-400"/>{player.nickname}</button>:<button onClick={()=>setLogin(true)} className="hidden rounded-xl bg-white px-4 py-2 text-xs font-black text-black sm:block">Entrar</button>}<button onClick={()=>setMobile(!mobile)} className="rounded-xl border border-white/10 p-2 lg:hidden">{mobile?<X size={18}/>:<Menu size={18}/>}</button></div>
    </div>{mobile&&<div className="grid grid-cols-2 gap-2 border-t border-white/10 bg-[#080c12] p-3 lg:hidden">{nav.map(([id,label])=><button key={id} onClick={()=>go(id)} className="rounded-xl bg-white/[.04] p-3 text-left text-xs font-bold">{label}</button>)}{player?<button onClick={()=>go('profile')} className="col-span-2 rounded-xl bg-emerald-400 p-3 text-xs font-black text-black">{player.nickname}</button>:<button onClick={()=>setLogin(true)} className="col-span-2 rounded-xl bg-white p-3 text-xs font-black text-black">Entrar</button>}</div>}</header>

    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      {tab==='home'&&<><section className="rounded-3xl border border-white/10 bg-black/30 px-6 py-16 sm:px-12"><span className="rounded-full bg-emerald-400/10 px-3 py-2 text-[10px] font-black tracking-widest text-emerald-300">● SERVIDOR ONLINE</span><h1 className="mt-6 text-5xl font-black tracking-tight sm:text-7xl">SUA AVENTURA.<br/><span className="text-emerald-400">SEU SERVIDOR.</span></h1><p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400">Entre no NETCRAFTBR e jogue do seu jeito. Economia, clãs, empregos, eventos e muito mais.</p><div className="mt-8 flex gap-3"><button onClick={()=>go('server')} className="rounded-xl bg-emerald-400 px-5 py-3 text-xs font-black text-black">Jogar agora</button><button onClick={()=>go('store')} className="rounded-xl border border-white/10 px-5 py-3 text-xs font-bold">Conhecer a loja</button></div></section><div className="mt-4 grid gap-3 sm:grid-cols-3"><button onClick={copy} className="rounded-2xl border border-white/10 bg-white/[.025] p-5 text-left"><small className="text-zinc-500">IP DO SERVIDOR</small><div className="mt-2 flex justify-between font-mono text-sm">BotuCraft.bed.net.br {copied?<Check size={15}/>:<Copy size={15}/>}</div></button><Info title="PORTA" value="21056"/><Info title="VERSÃO" value="Bedrock 1.21+"/></div><section className="mt-16"><Title a="DESTAQUES" b="Tenha mais no servidor"/><div className="grid gap-4 md:grid-cols-3">{products.slice(0,3).map(p=><Product key={p.id} p={p} onBuy={()=>setBuy(p)}/>)}</div></section></>}

      {tab==='server'&&<Page title="O servidor" a="NETCRAFTBR"><div className="grid gap-4 md:grid-cols-3">{[['Economia',ShoppingCart],['Clãs',Users],['Empregos',Trophy],['Procurados',Gamepad2],['Eventos',Sparkles],['Comunidade',Users]].map(([n,I])=><Box key={String(n)}><I size={22} className="text-emerald-400"/><h3 className="mt-5 font-bold">{String(n)}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">Sistema integrado ao NETCRAFTBR para deixar sua experiência mais completa.</p></Box>)}</div></Page>}
      {(tab==='vip'||tab==='store')&&<Page title={tab==='vip'?'Planos VIP':'Loja do servidor'} a={tab==='vip'?'VIP':'LOJA'}><div className="grid gap-4 md:grid-cols-3">{products.filter(p=>tab==='store'||p.category==='VIP').map(p=><Product key={p.id} p={p} onBuy={()=>setBuy(p)}/>)}</div></Page>}
      {tab==='events'&&<Page title="Eventos" a="EVENTOS"><div className="space-y-3">{events.map(([n,d,date])=><Box key={n}><span className="text-[10px] font-bold text-emerald-400">{date}</span><h3 className="mt-3 text-xl font-black">{n}</h3><p className="mt-2 text-sm text-zinc-400">{d}</p></Box>)}</div></Page>}
      {tab==='community'&&<Page title="Comunidade" a="COMUNIDADE"><div className="grid gap-4 sm:grid-cols-2"><Box><Users className="text-emerald-400"/><h3 className="mt-4 font-bold">Jogadores</h3><p className="mt-2 text-sm text-zinc-400">Entre com seu nickname e faça parte da comunidade.</p></Box><Box><Sparkles className="text-emerald-400"/><h3 className="mt-4 font-bold">Novidades</h3><p className="mt-2 text-sm text-zinc-400">Acompanhe os eventos e novidades do servidor.</p></Box></div></Page>}
      {tab==='support'&&<Page title="Suporte" a="SUPORTE"><div className="grid gap-4 md:grid-cols-2"><Box><Headphones className="text-emerald-400"/><h3 className="mt-4 font-bold">Precisa de ajuda?</h3><p className="mt-2 text-sm text-zinc-400">Entre em contato com a equipe do NETCRAFTBR.</p></Box><Box><ShoppingCart className="text-emerald-400"/><h3 className="mt-4 font-bold">Problema com compra?</h3><p className="mt-2 text-sm text-zinc-400">Tenha seu nickname e comprovante em mãos.</p></Box></div></Page>}
      {tab==='profile'&&player&&<Page title={player.nickname} a="CONTA"><div className="grid gap-4 sm:grid-cols-3"><Info title="NICKNAME" value={player.nickname}/><Info title="COMPRAS" value={String(player.orders)}/><Info title="TOTAL GASTO" value={money(player.spent)}/></div><button onClick={logout} className="mt-5 flex gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-xs font-bold text-rose-300"><LogOut size={15}/>Sair</button></Page>}
      {tab==='admin'&&<Page title="Painel administrativo" a="ADMIN"><Box><h3 className="font-bold">Pagamentos</h3><p className="mt-2 text-sm text-zinc-400">Configure o link do LivePix usado pelos botões de compra.</p><input value={livepix} onChange={e=>setLivepix(e.target.value)} placeholder="https://livepix.gg/..." className="mt-5 w-full rounded-xl border border-white/10 bg-white/[.03] p-3 text-sm outline-none focus:border-emerald-400"/><div className="mt-3 flex gap-2"><button onClick={()=>{localStorage.setItem('ncbr_livepix',livepix.trim())}} className="rounded-xl bg-emerald-400 px-4 py-2 text-xs font-black text-black">Salvar</button>{livepix&&<button onClick={()=>window.open(livepix,'_blank')} className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold">Testar</button>}</div></Box><button onClick={()=>{localStorage.removeItem('ncbr_admin');setAdmin(false)}} className="mt-4 text-xs text-zinc-500">Sair do administrador</button></Page>}
    </main>

    <footer className="border-t border-white/[.07] px-4 py-8 text-center text-xs text-zinc-600">NETCRAFTBR © {new Date().getFullYear()}</footer>

    {login&&<div className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1016] p-7 shadow-2xl"><div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-400 text-black"><User size={20}/></div><h2 className="mt-5 text-2xl font-black">Digite seu nickname do Minecraft</h2><p className="mt-2 text-sm text-zinc-400">Se for sua primeira vez, sua conta será criada automaticamente.</p><input autoFocus value={nick} onChange={e=>{setNick(e.target.value);setError('')}} onKeyDown={e=>e.key==='Enter'&&enter()} placeholder="Seu nickname" className="mt-5 w-full rounded-xl border border-white/10 bg-white/[.03] p-3.5 text-sm outline-none focus:border-emerald-400"/>{error&&<p className="mt-2 text-xs text-rose-400">{error}</p>}<button onClick={enter} className="mt-4 w-full rounded-xl bg-emerald-400 py-3.5 text-xs font-black text-black">Entrar</button></div></div>}

    {buy&&<div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1016] p-7"><button onClick={()=>setBuy(null)} className="float-right text-zinc-500"><X/></button><ShoppingCart className="text-emerald-400"/><h2 className="mt-5 text-xl font-black">Confirmar compra</h2><p className="mt-2 text-sm text-zinc-400">{buy.name}</p><strong className="mt-5 block text-2xl">{money(buy.price)}</strong><button onClick={()=>{if(!player){setBuy(null);setLogin(true);return}if(!livepix){setBuy(null);go('admin');return}const n={...player,orders:player.orders+1,spent:player.spent+buy.price};localStorage.setItem('ncbr_player',JSON.stringify(n));setPlayer(n);window.open(livepix,'_blank')}} className="mt-6 w-full rounded-xl bg-emerald-400 py-3 text-xs font-black text-black">{livepix?'Continuar para o LivePix':'Configurar pagamento'}</button></div></div>}

    {!admin&&<button aria-label="Admin" onClick={()=>{const p=prompt('Senha do administrador');if(p==='netcraftbr'){localStorage.setItem('ncbr_admin','1');setAdmin(true);go('admin')}}} className="fixed bottom-2 right-2 h-5 w-5 opacity-0 hover:opacity-30"/>}
  </div>
}
function Info({title,value}:{title:string,value:string}){return <div className="rounded-2xl border border-white/10 bg-white/[.025] p-5"><small className="text-zinc-500">{title}</small><p className="mt-2 font-mono text-sm">{value}</p></div>}
function Title({a,b}:{a:string,b:string}){return <div className="mb-8"><p className="text-xs font-bold tracking-[.2em] text-emerald-400">{a}</p><h2 className="mt-2 text-3xl font-black">{b}</h2></div>}
function Page({a,title,children}:{a:string,title:string,children:React.ReactNode}){return <section><Title a={a} b={title}/>{children}</section>}
function Box({children}:{children:React.ReactNode}){return <div className="rounded-2xl border border-white/10 bg-white/[.025] p-6">{children}</div>}
function Product({p,onBuy}:{p:Product,onBuy:()=>void}){return <Box><span className="text-[10px] font-bold tracking-widest text-emerald-400">{p.category}</span><h3 className="mt-3 text-xl font-black">{p.name}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">{p.description}</p><div className="mt-6 flex items-center justify-between"><strong className="text-2xl">{money(p.price)}</strong><button onClick={onBuy} className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-black">Comprar</button></div></Box>}
