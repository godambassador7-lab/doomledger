import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// ===== SVG ICONS =====
const IconHome = () => React.createElement('svg', {viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round',className:'nav-icon'},
  React.createElement('path',{d:'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'}),
  React.createElement('polyline',{points:'9 22 9 12 15 12 15 22'}));
const IconSquad = () => React.createElement('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round',className:'nav-icon'},
  React.createElement('path',{d:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'}),
  React.createElement('circle',{cx:'9',cy:'7',r:'4'}),
  React.createElement('path',{d:'M23 21v-2a4 4 0 0 0-3-3.87'}),
  React.createElement('path',{d:'M16 3.13a4 4 0 0 1 0 7.75'}));
const IconActivity = () => React.createElement('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round',className:'nav-icon'},
  React.createElement('polyline',{points:'22 12 18 12 15 21 9 3 6 12 2 12'}));
const IconLeaderboard = () => React.createElement('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round',className:'nav-icon'},
  React.createElement('path',{d:'M6 9H4.5a2.5 2.5 0 0 1 0-5H6'}),
  React.createElement('path',{d:'M18 9h1.5a2.5 2.5 0 0 0 0-5H18'}),
  React.createElement('path',{d:'M4 22h16'}),
  React.createElement('path',{d:'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22'}),
  React.createElement('path',{d:'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22'}),
  React.createElement('path',{d:'M18 2H6v7a6 6 0 0 0 12 0V2Z'}));
const IconShield = () => React.createElement('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'},
  React.createElement('path',{d:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'}));
const IconClock = () => React.createElement('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'},
  React.createElement('circle',{cx:'12',cy:'12',r:'10'}),
  React.createElement('polyline',{points:'12 6 12 12 16 14'}));
const IconTarget = () => React.createElement('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'},
  React.createElement('circle',{cx:'12',cy:'12',r:'10'}),
  React.createElement('circle',{cx:'12',cy:'12',r:'6'}),
  React.createElement('circle',{cx:'12',cy:'12',r:'2'}));
const IconAlert = () => React.createElement('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'},
  React.createElement('path',{d:'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'}),
  React.createElement('line',{x1:'12',y1:'9',x2:'12',y2:'13'}),
  React.createElement('line',{x1:'12',y1:'17',x2:'12.01',y2:'17'}));
const IconZap = () => React.createElement('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'},
  React.createElement('polygon',{points:'13 2 3 14 12 14 11 22 21 10 12 10 13 2'}));
const IconPlus = () => React.createElement('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'},
  React.createElement('line',{x1:'12',y1:'5',x2:'12',y2:'19'}),
  React.createElement('line',{x1:'5',y1:'12',x2:'19',y2:'12'}));
const IconWallet = () => React.createElement('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'},
  React.createElement('path',{d:'M21 12V7H5a2 2 0 0 1 0-4h14v4'}),
  React.createElement('path',{d:'M3 5v14a2 2 0 0 0 2 2h16v-5'}),
  React.createElement('path',{d:'M18 12a2 2 0 0 0 0 4h4v-4Z'}));
const IconCrown = () => React.createElement('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'},
  React.createElement('path',{d:'M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14'}));
const IconLogOut = () => React.createElement('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'},
  React.createElement('path',{d:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'}),
  React.createElement('polyline',{points:'16 17 21 12 16 7'}),
  React.createElement('line',{x1:'21',y1:'12',x2:'9',y2:'12'}));

// ===== DEMO DATA =====
const DEMO = {
  squad: { id:'sq_001', name:'Aegis Protocol', goalAmount:10000, status:'ACTIVE',
    deadline: new Date(Date.now()+45*24*60*60*1000),
    createdAt: new Date(Date.now()-15*24*60*60*1000) },
  members: [
    { id:'u_001', name:'You', role:'COMMANDER', avatar:'Y', avatarColor:'#00f0ff', status:'ACTIVE',
      contribution:2100, income:4500, efficiency:0.72, shieldHealth:78, isOnline:true, isYou:true },
    { id:'u_002', name:'Alex', role:'ENGINEER', avatar:'A', avatarColor:'#05ffa1', status:'ACTIVE',
      contribution:1850, income:3800, efficiency:0.68, shieldHealth:65, isOnline:true, isYou:false },
    { id:'u_003', name:'Maya', role:'ENGINEER', avatar:'M', avatarColor:'#b026ff', status:'ACTIVE',
      contribution:2400, income:5200, efficiency:0.85, shieldHealth:92, isOnline:false, isYou:false },
    { id:'u_004', name:'Charlie', role:'ENGINEER', avatar:'C', avatarColor:'#ff9e00', status:'DESERTED',
      contribution:500, income:3000, efficiency:0.35, shieldHealth:0, isOnline:false, isYou:false,
      desertedAt: new Date(Date.now()-2*24*60*60*1000) },
  ],
  transactions: [
    { id:'tx_001', userId:'u_001', merchant:'Transfer to Savings', category:'SAVINGS', amount:500, type:'positive', impact:'+5% Shield', timestamp:new Date(Date.now()-2*60*60*1000) },
    { id:'tx_002', userId:'u_002', merchant:'Starbucks', category:'FOOD_AND_DRINK', amount:-42, type:'negative', impact:'-3% Research', timestamp:new Date(Date.now()-5*60*60*1000) },
    { id:'tx_003', userId:'u_003', merchant:'Transfer to Savings', category:'SAVINGS', amount:800, type:'positive', impact:'+8% Shield', timestamp:new Date(Date.now()-8*60*60*1000) },
    { id:'tx_004', userId:'u_001', merchant:'Whole Foods', category:'GROCERY', amount:-89, type:'neutral', impact:'Essential', timestamp:new Date(Date.now()-12*60*60*1000) },
    { id:'tx_005', userId:'u_004', merchant:'Amazon', category:'SHOPPING', amount:-156, type:'negative', impact:'-8% Shield', timestamp:new Date(Date.now()-24*60*60*1000) },
    { id:'tx_006', userId:'u_001', merchant:'Transfer to Savings', category:'SAVINGS', amount:300, type:'positive', impact:'+3% Shield', timestamp:new Date(Date.now()-36*60*60*1000) },
    { id:'tx_007', userId:'u_002', merchant:'Uber Eats', category:'FOOD_AND_DRINK', amount:-35, type:'negative', impact:'-2% Research', timestamp:new Date(Date.now()-48*60*60*1000) },
  ],
  alerts: [
    { id:'a_001', type:'warning', message:'Charlie has deserted. $1,153 liability redistributed. New pace: $45.24/day.', timestamp:new Date(Date.now()-2*24*60*60*1000) },
    { id:'a_002', type:'success', message:'Maya hit a savings milestone! Squad shields reinforced.', timestamp:new Date(Date.now()-8*60*60*1000) },
  ],
  vote: { active:true, triggeredBy:'u_004', expiresAt:new Date(Date.now()+20*60*60*1000), votes:{'u_001':'CONTINUE'} },
};

// ===== HELPERS =====
const fmtCur = (a) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(a);
const clamp = (n,min,max) => Math.min(max,Math.max(min,n));
const isStaticPagesHost = () => window.location.hostname.endsWith('github.io');
async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Request failed.');
  return payload;
}
function loadPlaidLink() {
  if (window.Plaid) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"]');
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Plaid Link script failed to load.'));
    document.body.appendChild(script);
  });
}
const fmtTime = (d) => {
  const diff = d - Date.now();
  if(diff<=0) return {d:0,h:0,m:0,s:0,total:0};
  return {d:Math.floor(diff/864e5),h:Math.floor(diff%864e5/36e5),m:Math.floor(diff%36e5/6e4),s:Math.floor(diff%6e4/1e3),total:diff};
};
const getStatus = (p) => p>=70?'safe':p>=40?'warning':'danger';
const getEffClass = (e) => e>=0.7?'high':e>=0.5?'mid':'low';

// ===== COMPONENTS =====

function Toast({toasts,onDismiss}){
  return React.createElement('div',{className:'toast-container'},
    toasts.map(t=>React.createElement('div',{key:t.id,className:'toast'},
      React.createElement('span',{className:'toast-icon'},t.icon),
      React.createElement('span',{className:'toast-text'},t.msg),
      React.createElement('button',{className:'toast-close',onClick:()=>onDismiss(t.id)},'Ã—'))));
}

function DoomClock({deadline,goal,current}){
  const [t,setT]=useState(fmtTime(deadline));
  const pct=Math.min(100,Math.round(current/goal*100));
  const st=getStatus(pct);
  useEffect(()=>{const i=setInterval(()=>setT(fmtTime(deadline)),1000);return()=>clearInterval(i);},[deadline]);
  return React.createElement('div',{className:'card'},
    React.createElement('div',{className:'card-title'},React.createElement(IconClock),' Invasion Countdown'),
    React.createElement('div',{className:'doom-clock'},
      React.createElement('div',{className:'doom-clock-label'},'Time Until Invasion'),
      React.createElement('div',{className:`doom-clock-time ${st}`},
        String(t.d).padStart(2,'0')+':'+String(t.h).padStart(2,'0')+':'+String(t.m).padStart(2,'0')+':'+String(t.s).padStart(2,'0')),
      React.createElement('div',{className:'doom-clock-sub'},t.total<=0?'INVASION IMMINENT':t.d+' days remaining')));
}

function ShieldRing({pct,label}){
  const r=68,c=2*Math.PI*r,o=c-(pct/100)*c,st=getStatus(pct);
  return React.createElement('div',{className:'shield-wrap'},
    React.createElement('div',{className:'shield-ring'},
      React.createElement('svg',{width:'150',height:'150',viewBox:'0 0 150 150'},
        React.createElement('circle',{className:'shield-bg',cx:'75',cy:'75',r:r}),
        React.createElement('circle',{className:`shield-fill ${st}`,cx:'75',cy:'75',r:r,strokeDasharray:c,strokeDashoffset:o})),
      React.createElement('div',{className:'shield-center'},
        React.createElement('div',{className:'shield-pct',style:{color:st==='safe'?'#05ffa1':st==='warning'?'#ff9e00':'#ff2a6d'}},pct+'%'),
        React.createElement('div',{className:'shield-lbl'},label))));
}

function SquadShield({members,goal}){
  const active=members.filter(m=>m.status==='ACTIVE');
  const saved=members.reduce((s,m)=>s+m.contribution,0);
  const pct=Math.min(100,Math.round(saved/goal*100));
  const avg=Math.round(active.reduce((s,m)=>s+m.shieldHealth,0)/(active.length||1));
  return React.createElement('div',{className:'card'},
    React.createElement('div',{className:'card-title'},React.createElement(IconShield),' Squad Defense Status'),
    React.createElement(ShieldRing,{pct:pct,label:'Squad Shield'}),
    React.createElement('div',{className:'stats-grid',style:{marginTop:10}},
      React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},fmtCur(saved)),React.createElement('div',{className:'stat-lbl'},'Saved')),
      React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},fmtCur(goal)),React.createElement('div',{className:'stat-lbl'},'Target')),
      React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},avg+'%'),React.createElement('div',{className:'stat-lbl'},'Avg Shield')),
      React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},active.length+'/4'),React.createElement('div',{className:'stat-lbl'},'Active'))));
}

function AlertBanner({alert}){
  const icons={danger:'âš ï¸',warning:'ðŸ””',success:'âœ…'};
  return React.createElement('div',{className:`alert alert-${alert.type}`},
    React.createElement('span',{className:'alert-icon'},icons[alert.type]||'â„¹ï¸'),
    React.createElement('span',{className:'alert-text'},alert.message));
}

function MemberCard({m}){
  const des=m.status==='DESERTED';
  const ec=getEffClass(m.efficiency);
  const bc=m.shieldHealth>=70?'#05ffa1':m.shieldHealth>=40?'#ff9e00':'#ff2a6d';
  return React.createElement('div',{className:'member'},
    React.createElement('div',{className:`member-avatar ${des?'deserter':m.isOnline?'online':'offline'}`,
      style:{background:des?'#2a1a1a':m.avatarColor+'20',color:des?'#ff2a6d':m.avatarColor}},m.avatar),
    React.createElement('div',{className:'member-info'},
      React.createElement('div',{className:'member-name'},m.name,
        m.isYou&&React.createElement('span',{className:'badge badge-cyan'},'You'),
        des&&React.createElement('span',{className:'deserter-badge'},'Deserter')),
      React.createElement('div',{className:'member-role'},
        m.role+(des?' â€¢ Left '+Math.floor((Date.now()-m.desertedAt)/864e5)+'d ago':'')),
      React.createElement('div',{className:'member-bar'},
        React.createElement('div',{className:'member-bar-fill',style:{width:m.shieldHealth+'%',background:bc}}))),
    React.createElement('div',{className:'member-eff'},
      React.createElement('div',{className:`eff-val ${ec}`},(m.efficiency*100).toFixed(0)+'%'),
      React.createElement('div',{className:'eff-lbl'},'Efficiency')));
}

function VoteCard({vote,members,onVote,uid}){
  const [tl,setTl]=useState(0);
  const h=Math.floor(tl/36e5),mn=Math.floor(tl%36e5/6e4);
  const voted=vote.votes[uid];
  const deserter=members.find(m=>m.id===vote.triggeredBy);
  const remaining=10000-members.reduce((s,m)=>s+m.contribution,0);
  useEffect(()=>{
    const update=()=>setTl(Math.max(0,vote.expiresAt-Date.now()));
    update();
    const i=setInterval(update,6e4);
    return()=>clearInterval(i);
  },[vote.expiresAt]);
  return React.createElement('div',{className:'vote-card'},
    React.createElement('div',{className:'vote-header'},
      React.createElement(IconAlert),
      React.createElement('span',{style:{fontWeight:600,fontSize:13}},'Squad Vote Active'),
      React.createElement('span',{className:'vote-timer'},String(h).padStart(2,'0')+':'+String(mn).padStart(2,'0')+' remaining')),
    React.createElement('div',{className:'vote-text'},
      React.createElement('strong',null,deserter?.name),' has deserted. Their ',fmtCur(deserter?.contribution),' contribution remains, but ',
      fmtCur(remaining),' liability will be redistributed.'),
    voted
      ?React.createElement('div',{className:'vote-cast'},
        React.createElement('span',{className:'badge badge-green'},'Vote Cast: '+voted),
        React.createElement('p',null,'Waiting for other squad members...'))
      :React.createElement('div',{className:'btn-group'},
        React.createElement('button',{className:'btn btn-success',onClick:()=>onVote('CONTINUE')},React.createElement(IconShield),' Hold the Line'),
        React.createElement('button',{className:'btn btn-danger',onClick:()=>onVote('DISSOLVE')},React.createElement(IconLogOut),' Abandon Post')));
}

function TxItem({tx}){
  const icons={positive:'ðŸ’°',negative:'ðŸ’¸',neutral:'ðŸ“‹'};
  return React.createElement('div',{className:`tx-item ${tx.type}`},
    React.createElement('div',{className:`tx-icon ${tx.type}`},icons[tx.type]),
    React.createElement('div',{className:'tx-details'},
      React.createElement('div',{className:'tx-merchant'},tx.merchant),
      React.createElement('div',{className:'tx-cat'},tx.category)),
    React.createElement('div',null,
      React.createElement('div',{className:`tx-amt ${tx.type}`},(tx.amount>0?'+':'')+fmtCur(tx.amount)),
      React.createElement('div',{className:`tx-impact ${tx.type}`},tx.impact)));
}

function LBItem({rank,member,isWinner}){
  return React.createElement('div',{className:'lb-item'},
    React.createElement('div',{className:`lb-rank ${rank===1?'gold':rank===2?'silver':rank===3?'bronze':'other'}`},rank===1?'ðŸ‘‘':rank),
    React.createElement('div',{className:'lb-info'},
      React.createElement('div',{className:'lb-name'},member.name,
        member.isYou&&React.createElement('span',{className:'badge badge-cyan'},'You'),
        member.status==='DESERTED'&&React.createElement('span',{className:'deserter-badge'},'Deserter')),
      React.createElement('div',{className:'lb-sub'},fmtCur(member.contribution)+' saved â€¢ '+(member.efficiency*100).toFixed(0)+'% efficiency'),
      isWinner&&React.createElement('div',{className:'de-badge'},React.createElement(IconCrown),' Defensive Engineer')),
    React.createElement('div',{className:'lb-score'},
      React.createElement('div',{className:'lb-score-val'},(member.efficiency*100).toFixed(0)),
      React.createElement('div',{className:'lb-score-lbl'},'Eff. Score')));
}

// ===== SCREENS =====

function MissionSetup({onCreate}){
  const [form,setForm]=useState({
    name:'Emergency Fund',
    target:'10000',
    saved:'1200',
    days:'90',
    pledge:'300',
    difficulty:'veteran'
  });
  const [error,setError]=useState('');
  const difficulty={
    rookie:{label:'Rookie',mult:1,reward:'1x XP'},
    veteran:{label:'Veteran',mult:1.35,reward:'1.35x XP'},
    nightmare:{label:'Nightmare',mult:1.75,reward:'1.75x XP'}
  };
  const target=Math.max(0,Number(form.target)||0);
  const saved=clamp(Number(form.saved)||0,0,target||999999);
  const days=clamp(Number(form.days)||0,1,365);
  const pledge=Math.max(0,Number(form.pledge)||0);
  const remaining=Math.max(0,target-saved);
  const daily=remaining/days;
  const weeks=Math.max(1,Math.ceil(days/7));
  const weeklyTarget=remaining/weeks;
  const pledgePct=weeklyTarget?Math.min(100,Math.round(pledge/weeklyTarget*100)):100;
  const progress=target?Math.round(saved/target*100):0;
  const xp=Math.round((progress*10+pledgePct*6+days)*difficulty[form.difficulty].mult);
  const threat=progress>=70?'Contained':progress>=35?'Rising':'Critical';
  const update=(key,value)=>setForm(p=>({...p,[key]:value}));
  const submit=()=>{
    if(!form.name.trim()) return setError('Name the mission before deploying.');
    if(target<100) return setError('Set a target of at least $100.');
    if(saved>=target) return setError('Saved amount must be below the target so the mission has room to progress.');
    setError('');
    onCreate({
      name:form.name.trim(),
      target,
      saved,
      days,
      pledge,
      difficulty:form.difficulty,
      xp,
      threat
    });
  };
  return React.createElement('div',{className:'screen active setup-shell'},
    React.createElement('div',{className:'setup-hero'},
      React.createElement('div',{className:'setup-kicker'},'Mission Control'),
      React.createElement('div',{className:'setup-title'},'Build Your Financial Defense Plan'),
      React.createElement('p',{className:'setup-copy'},'Create the ledger goal first. DoomLedger turns the target into a mission with shield progress, daily pace, XP rewards, and milestone ranks.')),
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconTarget),' Goal Loadout'),
      React.createElement('div',{className:'setup-grid'},
        React.createElement('label',{className:'setup-field full'},
          React.createElement('span',{className:'setup-label'},'Mission Name'),
          React.createElement('input',{className:'setup-input',value:form.name,onChange:e=>update('name',e.target.value),placeholder:'Emergency Fund'})),
        React.createElement('label',{className:'setup-field'},
          React.createElement('span',{className:'setup-label'},'Target Amount'),
          React.createElement('input',{className:'setup-input',type:'number',min:'100',value:form.target,onChange:e=>update('target',e.target.value)})),
        React.createElement('label',{className:'setup-field'},
          React.createElement('span',{className:'setup-label'},'Already Saved'),
          React.createElement('input',{className:'setup-input',type:'number',min:'0',value:form.saved,onChange:e=>update('saved',e.target.value)})),
        React.createElement('label',{className:'setup-field'},
          React.createElement('span',{className:'setup-label'},'Days to Complete'),
          React.createElement('input',{className:'setup-input',type:'number',min:'1',max:'365',value:form.days,onChange:e=>update('days',e.target.value)})),
        React.createElement('label',{className:'setup-field'},
          React.createElement('span',{className:'setup-label'},'Weekly Pledge'),
          React.createElement('input',{className:'setup-input',type:'number',min:'0',value:form.pledge,onChange:e=>update('pledge',e.target.value)}))),
      React.createElement('div',{className:'setup-label'},'Difficulty Contract'),
      React.createElement('div',{className:'difficulty-grid'},
        Object.entries(difficulty).map(([id,d])=>React.createElement('button',{key:id,type:'button',className:`difficulty-card ${form.difficulty===id?'active':''}`,onClick:()=>update('difficulty',id)},
          React.createElement('div',{className:'difficulty-name'},d.label),
          React.createElement('div',{className:'difficulty-bonus'},d.reward)))),
      React.createElement('div',{className:'mission-preview'},
        React.createElement('div',{className:'preview-cell'},React.createElement('div',{className:'preview-value'},fmtCur(daily)),React.createElement('div',{className:'preview-label'},'Daily Pace')),
        React.createElement('div',{className:'preview-cell'},React.createElement('div',{className:'preview-value'},progress+'%'),React.createElement('div',{className:'preview-label'},'Shield')),
        React.createElement('div',{className:'preview-cell'},React.createElement('div',{className:'preview-value'},threat),React.createElement('div',{className:'preview-label'},'Threat')),
        React.createElement('div',{className:'preview-cell'},React.createElement('div',{className:'preview-value'},xp),React.createElement('div',{className:'preview-label'},'Launch XP'))),
      error&&React.createElement('div',{className:'form-error'},error),
      React.createElement('button',{className:'btn btn-primary',onClick:submit},React.createElement(IconShield),' Deploy Ledger Mission')),
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconCrown),' Unlock Path'),
      React.createElement('div',{className:'milestone-list'},
        [25,50,75,100].map(p=>React.createElement('div',{className:'milestone',key:p},
          React.createElement('div',{className:'milestone-rank'},p+'%'),
          React.createElement('div',{className:'milestone-text'},p===100?'Boss Clear':'Rank Up'))))));
}

function HomeScreen({data,onEditGoal,onLinkBank,plaidStatus}){
  const saved=data.members.reduce((s,m)=>s+m.contribution,0);
  const days=Math.floor((data.squad.deadline-Date.now())/864e5);
  const pace=Math.max(0,(data.squad.goalAmount-saved)/Math.max(1,days));
  const you=data.members.find(m=>m.isYou);
  const mission=data.squad.mission;
  return React.createElement('div',{className:'screen active'},
    React.createElement(DoomClock,{deadline:data.squad.deadline,goal:data.squad.goalAmount,current:saved}),
    React.createElement(SquadShield,{members:data.members,goal:data.squad.goalAmount}),
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconTarget),' Mission Parameters'),
      React.createElement('div',{className:'stats-grid'},
        React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},fmtCur(pace)),React.createElement('div',{className:'stat-lbl'},'Daily Pace')),
        React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},days),React.createElement('div',{className:'stat-lbl'},'Days Left')),
        React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},fmtCur(you?.contribution||0)),React.createElement('div',{className:'stat-lbl'},'Your Save')),
        React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},((you?.efficiency||0)*100).toFixed(0)+'%'),React.createElement('div',{className:'stat-lbl'},'Your Eff.'))),
      mission&&React.createElement('div',{className:'mission-preview'},
        React.createElement('div',{className:'preview-cell'},React.createElement('div',{className:'preview-value'},mission.difficulty.toUpperCase()),React.createElement('div',{className:'preview-label'},'Mode')),
        React.createElement('div',{className:'preview-cell'},React.createElement('div',{className:'preview-value'},mission.threat),React.createElement('div',{className:'preview-label'},'Threat')),
        React.createElement('div',{className:'preview-cell'},React.createElement('div',{className:'preview-value'},mission.xp),React.createElement('div',{className:'preview-label'},'XP')),
        React.createElement('div',{className:'preview-cell'},React.createElement('div',{className:'preview-value'},fmtCur(mission.pledge)),React.createElement('div',{className:'preview-label'},'Weekly')))),
    data.alerts.map(a=>React.createElement(AlertBanner,{key:a.id,alert:a})),
    (!plaidStatus.configured||plaidStatus.staticHost)&&React.createElement('div',{className:'alert alert-warning'},
      React.createElement('span',{className:'alert-icon'},'API'),
      React.createElement('span',{className:'alert-text'},React.createElement('strong',null,'Plaid setup needed. '),plaidStatus.staticHost?'GitHub Pages is static, so run the app locally with npm run dev to use the Plaid backend.':'Copy .env.example to .env and add your Sandbox keys before linking a bank.')),
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconZap),' Quick Actions'),
      React.createElement('div',{className:'quick-actions'},
        React.createElement('button',{className:'btn btn-primary'},React.createElement(IconPlus),' Log Savings Transfer'),
        React.createElement('button',{className:'btn btn-secondary',onClick:onLinkBank,disabled:plaidStatus.loading},React.createElement(IconWallet),plaidStatus.loading?'Connecting...':plaidStatus.connected?'Sync Bank Transactions':'Link Bank Account'),
        React.createElement('button',{className:'btn btn-secondary',onClick:onEditGoal},React.createElement(IconTarget),' Recalibrate Goal'))));
}

function SquadScreen({data,onVote}){
  return React.createElement('div',{className:'screen active'},
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconSquad),' '+data.squad.name),
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}},
        React.createElement('div',null,React.createElement('div',{style:{fontSize:11,color:'var(--text-muted)'}},'Squad Goal'),
          React.createElement('div',{style:{fontFamily:'Orbitron',fontSize:18,fontWeight:700,color:'var(--accent-cyan)'}},fmtCur(data.squad.goalAmount))),
        React.createElement('div',{style:{textAlign:'right'}},React.createElement('div',{style:{fontSize:11,color:'var(--text-muted)'}},'Deadline'),
          React.createElement('div',{style:{fontSize:13,fontWeight:600}},data.squad.deadline.toLocaleDateString()))),
      React.createElement('div',{className:'divider'}),
      React.createElement('div',{style:{display:'flex',gap:8,flexWrap:'wrap'}},
        React.createElement('span',{className:'badge badge-cyan'},'Max 4 Members'),
        React.createElement('span',{className:'badge badge-green'},data.members.filter(m=>m.status==='ACTIVE').length+' Active'),
        data.members.some(m=>m.status==='DESERTED')&&React.createElement('span',{className:'badge badge-red'},'Deserter Present'))),
    data.vote?.active&&React.createElement(VoteCard,{vote:data.vote,members:data.members,onVote:onVote,uid:'u_001'}),
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconSquad),' Squad Roster'),
      React.createElement('div',{className:'squad-list'},data.members.map(m=>React.createElement(MemberCard,{key:m.id,m:m})))),
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconAlert),' Squad Rules'),
      React.createElement('div',{className:'rules'},
        React.createElement('p',null,'â€¢ ',React.createElement('strong',null,'Desertion Protocol:'),' Past contributions stay. Future liability redistributes.'),
        React.createElement('p',null,'â€¢ ',React.createElement('strong',null,'Vote to Continue:'),' Unanimous vote required to dissolve. Default: continue.'),
        React.createElement('p',null,'â€¢ ',React.createElement('strong',null,'Efficiency Score:'),' (Savings / Income) Ã— Consistency. Higher is better.'),
        React.createElement('p',null,'â€¢ ',React.createElement('strong',null,'Defensive Engineer:'),' Awarded to highest efficiency on Invasion Day.'))));
}

function ActivityScreen({data}){
  return React.createElement('div',{className:'screen active'},
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconActivity),' Transaction Feed'),
      data.transactions.length===0
        ?React.createElement('div',{className:'empty'},React.createElement('div',{className:'empty-icon'},'ðŸ“¡'),React.createElement('div',{className:'empty-text'},'No transactions detected.\nLink your bank to begin monitoring.'))
        :data.transactions.map(tx=>React.createElement(TxItem,{key:tx.id,tx:tx}))),
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconAlert),' Squad Alerts'),
      data.alerts.map(a=>React.createElement(AlertBanner,{key:a.id,alert:a})),
      data.alerts.length===0&&React.createElement('div',{className:'empty'},React.createElement('div',{className:'empty-icon'},'âœ…'),React.createElement('div',{className:'empty-text'},'All sectors secure.\nNo active alerts.'))));
}

function LeaderboardScreen({data}){
  const sorted=[...data.members].sort((a,b)=>b.efficiency-a.efficiency);
  const winner=sorted[0];
  return React.createElement('div',{className:'screen active'},
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconLeaderboard),' Efficiency Rankings'),
      React.createElement('div',{style:{textAlign:'center',padding:'14px 0'}},
        React.createElement('div',{style:{fontSize:11,color:'var(--text-muted)',letterSpacing:2,textTransform:'uppercase'}},'Current Defensive Engineer'),
        React.createElement('div',{style:{fontFamily:'Orbitron',fontSize:22,fontWeight:900,color:'var(--accent-cyan)',marginTop:8}},winner.name),
        React.createElement('div',{style:{fontSize:14,color:'var(--text-secondary)',marginTop:4}},(winner.efficiency*100).toFixed(0)+'% Efficiency'))),
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconLeaderboard),' Live Standings'),
      sorted.map((m,i)=>React.createElement(LBItem,{key:m.id,rank:i+1,member:m,isWinner:i===0&&m.status!=='DESERTED'}))));
}

// ===== APP =====

function App(){
  const [tab,setTab]=useState('home');
  const [data,setData]=useState(DEMO);
  const [toasts,setToasts]=useState([]);
  const [hasGoal,setHasGoal]=useState(false);
  const [plaidStatus,setPlaidStatus]=useState({configured:false,connected:false,loading:false,environment:'sandbox',products:[],staticHost:false});

  const addToast=useCallback((icon,msg)=>{
    const id=Date.now()+Math.random();
    setToasts(p=>[...p,{id,icon,msg}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3500);
  },[]);

  const dismissToast=useCallback(id=>setToasts(p=>p.filter(t=>t.id!==id)),[]);

  const handleVote=useCallback(voteType=>{
    setData(p=>({...p,vote:{...p.vote,votes:{...p.vote.votes,'u_001':voteType}}}));
    addToast(voteType==='CONTINUE'?'ðŸ›¡ï¸':'ðŸ³ï¸',voteType==='CONTINUE'?'Vote cast: Hold the Line':'Vote cast: Abandon Post');
  },[addToast]);

  const handleCreateGoal=useCallback(goal=>{
    const deadline=new Date(Date.now()+goal.days*24*60*60*1000);
    const shield=goal.target?clamp(Math.round(goal.saved/goal.target*100),0,100):0;
    const weeks=Math.max(1,Math.ceil(goal.days/7));
    const weeklyTarget=Math.max(1,goal.target/weeks);
    setData(p=>({
      ...p,
      squad:{
        ...p.squad,
        name:goal.name,
        goalAmount:goal.target,
        deadline,
        createdAt:new Date(),
        mission:{difficulty:goal.difficulty,pledge:goal.pledge,xp:goal.xp,threat:goal.threat}
      },
      members:p.members.map(m=>m.isYou
        ?{...m,contribution:goal.saved,efficiency:clamp(goal.pledge/weeklyTarget,0.1,1),shieldHealth:shield}
        :{...m,contribution:0,efficiency:0.5,shieldHealth:Math.max(20,Math.round(shield*0.75))}),
      transactions:goal.saved>0
        ?[{id:'tx_launch',userId:'u_001',merchant:'Mission Launch Deposit',category:'SAVINGS',amount:goal.saved,type:'positive',impact:'+'+shield+'% Shield',timestamp:new Date()}]
        :[],
      alerts:[{id:'a_launch',type:'success',message:'Mission '+goal.name+' deployed. Weekly pledge: '+fmtCur(goal.pledge)+'. Threat level: '+goal.threat+'.',timestamp:new Date()}],
      vote:null
    }));
    setTab('home');
    setHasGoal(true);
    addToast('LAUNCH','Mission deployed: '+goal.name);
  },[addToast]);

  const syncPlaidTransactions=useCallback(async()=>{
    const result=await apiRequest('/api/transactions');
    const incoming=[...result.added,...result.modified];
    if(!incoming.length) {
      addToast('SYNC','No new bank transactions found.');
      return;
    }

    setData(p=>{
      const byId=new Map(p.transactions.map(tx=>[tx.id,tx]));
      incoming.forEach(tx=>byId.set(tx.id,{...tx,timestamp:new Date(tx.timestamp)}));
      return {
        ...p,
        transactions:[...byId.values()].sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp)),
        alerts:[
          {id:'a_plaid_'+Date.now(),type:'success',message:'Synced '+incoming.length+' transaction'+(incoming.length===1?'':'s')+' from Plaid.',timestamp:new Date()},
          ...p.alerts,
        ],
      };
    });
    setTab('activity');
    addToast('SYNC','Bank transactions synced.');
  },[addToast]);

  const handleLinkBank=useCallback(async()=>{
    if(plaidStatus.staticHost) {
      addToast('LOCAL','Plaid requires the local backend. Run npm run dev on your machine.');
      return;
    }
    setPlaidStatus(p=>({...p,loading:true}));
    try {
      if(plaidStatus.connected) {
        try {
          await syncPlaidTransactions();
        } finally {
          setPlaidStatus(p=>({...p,loading:false}));
        }
        return;
      }

      await loadPlaidLink();
      const { link_token: linkToken }=await apiRequest('/api/create_link_token',{method:'POST'});
      const handler=window.Plaid.create({
        token:linkToken,
        onSuccess:async(publicToken)=>{
          try {
            await apiRequest('/api/exchange_public_token',{
              method:'POST',
              body:JSON.stringify({public_token:publicToken}),
            });
            setPlaidStatus(p=>({...p,connected:true}));
            addToast('LINK','Bank account linked.');
            await syncPlaidTransactions();
          } catch (error) {
            addToast('ERROR',error.message);
          } finally {
            setPlaidStatus(p=>({...p,loading:false}));
          }
        },
        onExit:()=>setPlaidStatus(p=>({...p,loading:false})),
      });
      handler.open();
    } catch (error) {
      addToast('ERROR',error.message);
      setPlaidStatus(p=>({...p,loading:false}));
    }
  },[addToast,plaidStatus.connected,syncPlaidTransactions]);

  useEffect(()=>{
    if(isStaticPagesHost()) {
      setPlaidStatus(p=>({...p,configured:false,staticHost:true}));
      return;
    }
    apiRequest('/api/plaid/status')
      .then(status=>setPlaidStatus(p=>({...p,...status})))
      .catch(()=>setPlaidStatus(p=>({...p,configured:false})));
  },[]);

  useEffect(()=>{
    const main=document.querySelector('.main');
    if(main) main.scrollTop=0;
  },[tab,hasGoal]);

  const tabs=[
    {id:'home',label:'Command',icon:IconHome},
    {id:'squad',label:'Squad',icon:IconSquad},
    {id:'activity',label:'Feed',icon:IconActivity},
    {id:'leaderboard',label:'Ranks',icon:IconLeaderboard},
  ];

  const renderScreen=()=>{
    if(!hasGoal) return React.createElement(MissionSetup,{onCreate:handleCreateGoal});
    switch(tab){
      case 'home':return React.createElement(HomeScreen,{data,onEditGoal:()=>setHasGoal(false),onLinkBank:handleLinkBank,plaidStatus});
      case 'squad':return React.createElement(SquadScreen,{data,onVote:handleVote});
      case 'activity':return React.createElement(ActivityScreen,{data});
      case 'leaderboard':return React.createElement(LeaderboardScreen,{data});
      default:return React.createElement(HomeScreen,{data,onEditGoal:()=>setHasGoal(false),onLinkBank:handleLinkBank,plaidStatus});
    }
  };

  return React.createElement('div',{className:'app'},
    React.createElement(Toast,{toasts,onDismiss:dismissToast}),
    React.createElement('div',{className:'header'},
      React.createElement('div',{className:'header-title'},'DOOMLEDGER'),
      React.createElement('div',{className:'header-status'},React.createElement('div',{className:'status-dot'}),'SYSTEM ONLINE')),
    React.createElement('div',{className:'main'},renderScreen()),
    hasGoal&&React.createElement('div',{className:'bottom-nav'},
      tabs.map(t=>React.createElement('button',{
        key:t.id,className:`nav-item ${tab===t.id?'active':''}`,onClick:()=>setTab(t.id)
      },React.createElement(t.icon),t.label))));
}
export default App;

