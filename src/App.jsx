import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const assetUrl = (name) => `${import.meta.env.BASE_URL}${name}`;

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
const getTransactionMission = (tx) => {
  if(tx.type==='positive') return {label:'Shield Gain',detail:'Savings transfer reinforced the vault.'};
  if(tx.type==='negative') return {label:'Threat Hit',detail:'Discretionary spend damaged mission pace.'};
  return {label:'Supply Run',detail:'Essential ledger event recorded.'};
};
const getBadges = (data) => {
  const saved=data.members.reduce((s,m)=>s+m.contribution,0);
  const pct=data.squad.goalAmount?Math.round(saved/data.squad.goalAmount*100):0;
  const positives=data.transactions.filter(t=>t.type==='positive').length;
  return [
    {name:'Debt Slayer',state:pct>=25?'earned':'locked',hint:'25% shield'},
    {name:'Vault Builder',state:pct>=50?'earned':'locked',hint:'50% shield'},
    {name:'No-Spend Streak',state:data.transactions.every(t=>t.type!=='negative')?'earned':'locked',hint:'No recent hits'},
    {name:'Transfer Ritual',state:positives>=3?'earned':'locked',hint:'3 savings moves'},
  ];
};
const RANKS = [
  {name:'Cadet',xp:0},
  {name:'Signal Scout',xp:250},
  {name:'Shield Corporal',xp:600},
  {name:'Ledger Sergeant',xp:1050},
  {name:'Vault Lieutenant',xp:1600},
  {name:'Debt Captain',xp:2300},
  {name:'Finance Major',xp:3200},
  {name:'Sector Commander',xp:4400},
  {name:'Continental Marshal',xp:5900},
  {name:'International General',xp:7800},
];
const getRankState = (data, campaign) => {
  const positiveCount=data.transactions.filter(t=>t.type==='positive').length;
  const earnedBadges=getBadges(data).filter(b=>b.state==='earned').length;
  const xp=Math.round((campaign?.pct||0)*55+(data.squad.mission?.xp||0)+positiveCount*90+earnedBadges*220);
  let current=RANKS[0];
  for(const rank of RANKS) {
    if(xp>=rank.xp) current=rank;
  }
  const currentIndex=RANKS.findIndex(rank=>rank.name===current.name);
  const next=RANKS[currentIndex+1] || null;
  const prevXp=current.xp;
  const nextXp=next?.xp || current.xp;
  const progress=next?clamp(Math.round((xp-prevXp)/(nextXp-prevXp)*100),0,100):100;
  return {xp,current,next,progress,index:currentIndex,ranks:RANKS};
};
const buildMissionSuggestion = ({name,target,saved,days,pledge,difficulty,rationale}) => {
  const safeTarget=Math.max(100,Math.round(target));
  const safeSaved=clamp(Math.round(saved),0,safeTarget-1);
  const safeDays=clamp(Math.round(days),7,365);
  const safePledge=Math.max(25,Math.round(pledge));
  const progress=Math.round(safeSaved/safeTarget*100);
  const pledgePct=Math.min(100,Math.round(safePledge/Math.max(1,(safeTarget-safeSaved)/Math.max(1,Math.ceil(safeDays/7)))*100));
  const mult={rookie:1,veteran:1.35,nightmare:1.75}[difficulty] || 1;
  return {
    name,
    target:safeTarget,
    saved:safeSaved,
    days:safeDays,
    pledge:safePledge,
    difficulty,
    xp:Math.round((progress*10+pledgePct*6+safeDays)*mult),
    threat:progress>=70?'Contained':progress>=35?'Rising':'Critical',
    rationale,
  };
};
const generateMissionSuggestions = (transactions) => {
  const txs=transactions.length?transactions:DEMO.transactions;
  const positive=txs.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount,0);
  const negative=txs.filter(t=>t.amount<0);
  const discretionary=negative
    .filter(t=>/FOOD|DRINK|SHOPPING|MERCHANDISE|ENTERTAINMENT|UBER|STARBUCKS|AMAZON/i.test(t.category+' '+t.merchant))
    .reduce((s,t)=>s+Math.abs(t.amount),0);
  const essentials=negative.reduce((s,t)=>s+Math.abs(t.amount),0);
  const seedSavings=Math.max(100,Math.round(positive*0.45));
  const weeklyCut=Math.max(75,Math.round(discretionary*0.35));
  return [
    buildMissionSuggestion({
      name:'Emergency Shield Fund',
      target:Math.max(2500,essentials*8),
      saved:seedSavings,
      days:90,
      pledge:Math.max(150,weeklyCut),
      difficulty:'veteran',
      rationale:'Builds a cash buffer from recent outflow patterns before the ledger takes bigger risks.',
    }),
    buildMissionSuggestion({
      name:'Discretionary Spend Lockdown',
      target:Math.max(1000,discretionary*6),
      saved:Math.max(50,Math.round(seedSavings*0.35)),
      days:45,
      pledge:Math.max(100,weeklyCut),
      difficulty:'nightmare',
      rationale:'Targets the categories most likely to damage mission pace and converts cuts into savings XP.',
    }),
    buildMissionSuggestion({
      name:'30-Day Vault Sprint',
      target:Math.max(750,Math.round((positive+essentials)*0.6)),
      saved:Math.max(25,Math.round(seedSavings*0.25)),
      days:30,
      pledge:Math.max(75,Math.round((positive+discretionary)*0.18)),
      difficulty:'rookie',
      rationale:'A fast first win that proves the account connection is generating useful ledger missions.',
    }),
  ];
};
const getCampaignState = (data) => {
  const saved=data.members.reduce((s,m)=>s+m.contribution,0);
  const goal=Math.max(1,data.squad.goalAmount);
  const pct=clamp(Math.round(saved/goal*100),0,100);
  const totalMs=Math.max(1,data.squad.deadline-data.squad.createdAt);
  const elapsed=clamp(Date.now()-data.squad.createdAt,0,totalMs);
  const expectedPct=clamp(Math.round(elapsed/totalMs*100),0,100);
  const paceDelta=pct-expectedPct;
  const daysLeft=Math.max(1,Math.ceil((data.squad.deadline-Date.now())/864e5));
  const phase=pct>=90
    ?{name:'Final Stand',tone:'red',objective:'Lock the vault and protect the last stretch.'}
    :pct>=65
      ?{name:'Siege Phase',tone:'orange',objective:'Hold weekly pace while cutting threat categories.'}
      :pct>=35
        ?{name:'Shield Phase',tone:'cyan',objective:'Build durable savings rhythm.'}
        :{name:'Recon Phase',tone:'green',objective:'Map spending and secure the first checkpoint.'};
  const pace=paceDelta>=5
    ?{label:'Timeline Stabilized',tone:'green',delta:paceDelta}
    :paceDelta>=-5
      ?{label:'Holding Formation',tone:'cyan',delta:paceDelta}
      :{label:'Invasion Accelerating',tone:'red',delta:paceDelta};
  const recent=data.transactions.slice(0,8);
  const positives=recent.filter(t=>t.type==='positive').length;
  const negatives=recent.filter(t=>t.type==='negative').length;
  const discretionary=recent.filter(t=>/FOOD|DRINK|SHOPPING|MERCHANDISE|ENTERTAINMENT|UBER|STARBUCKS|AMAZON/i.test(t.category+' '+t.merchant));
  const streaks=[
    {name:'Savings Streak',value:positives,detail:positives?'Recent shield gains detected':'No recent shield gains'},
    {name:'No-Spend Streak',value:Math.max(0,5-negatives),detail:negatives?'Threat hits interrupted the streak':'No recent threat hits'},
    {name:'Sync Streak',value:data.transactions.some(t=>t.sourceLabel)?2:1,detail:data.transactions.some(t=>t.sourceLabel)?'Signal Array data active':'Demo/manual ledger active'},
  ];
  const raids=[
    {name:'Shield Deposit Raid',target:fmtCur(Math.max(25,Math.round((data.squad.mission?.pledge||100)/3))),progress:positives?70:15,reward:'+120 XP',status:positives?'active':'queued'},
    {name:'Ration Challenge',target:'Food + shopping under '+fmtCur(Math.max(30,Math.round((data.squad.mission?.pledge||100)/2))),progress:discretionary.length?35:80,reward:'+90 XP',status:discretionary.length?'threat':'active'},
    {name:'Signal Sync Ritual',target:'Sync all Signal Arrays',progress:data.transactions.some(t=>t.sourceLabel)?100:40,reward:'+60 XP',status:data.transactions.some(t=>t.sourceLabel)?'complete':'queued'},
  ];
  const threatEvents=[];
  if(negatives>=2) threatEvents.push({name:'Impulse Breach',detail:'Multiple recent threat hits detected. Counter with a 48-hour spending freeze.',tone:'red'});
  if(discretionary.length) threatEvents.push({name:'Supply Leak Detected',detail:'Discretionary categories are pulling shield power from the mission.',tone:'orange'});
  if(paceDelta<-5) threatEvents.push({name:'Doom Clock Surge',detail:'Progress is behind schedule. Increase weekly pledge or extend timeline.',tone:'red'});
  if(!threatEvents.length) threatEvents.push({name:'Sector Stable',detail:'No major threat events. Push toward the next checkpoint.',tone:'green'});
  const operations=[
    buildMissionSuggestion({
      name:'7-Day Ration Challenge',
      target:Math.max(500,Math.round(discretionary.reduce((s,t)=>s+Math.abs(t.amount),0)*4)||500),
      saved:Math.min(saved,Math.max(100,Math.round(goal*0.08))),
      days:7,
      pledge:Math.max(50,Math.round((data.squad.mission?.pledge||100)*0.5)),
      difficulty:discretionary.length?'veteran':'rookie',
      rationale:discretionary.length?'Recent discretionary spend rose. Convert avoided spend into shield XP.':'A low-risk weekly sprint to keep momentum high.',
    }),
    buildMissionSuggestion({
      name:'Emergency Buffer Upgrade',
      target:Math.max(goal,Math.round(goal*1.15)),
      saved,
      days:Math.max(30,daysLeft),
      pledge:Math.max(data.squad.mission?.pledge||100,Math.round(goal/16)),
      difficulty:'veteran',
      rationale:'Raises the final shield target after stable progress or new account data.',
    }),
    buildMissionSuggestion({
      name:'Debt Threat Counterstrike',
      target:Math.max(750,Math.round(Math.abs(recent.filter(t=>t.amount<0).reduce((s,t)=>s+t.amount,0))*3)),
      saved:Math.max(25,Math.round(saved*0.15)),
      days:30,
      pledge:Math.max(75,Math.round((data.squad.mission?.pledge||100)*0.75)),
      difficulty:negatives?'nightmare':'rookie',
      rationale:'Targets recent outflows with a focused corrective mission.',
    }),
  ];
  const milestones=[
    {pct:10,name:'Signal Lock',reward:'Radar Online'},
    {pct:25,name:'Shield Online',reward:'Debt Slayer Badge'},
    {pct:50,name:'Debt Gate Breached',reward:'Veteran Frame'},
    {pct:75,name:'Vault Reinforced',reward:'Shield Surge FX'},
    {pct:90,name:'Final Stand Ready',reward:'Countdown Overdrive'},
    {pct:100,name:'Boss Clear',reward:'Mission Complete'},
  ];
  return {saved,pct,expectedPct,pace,phase,raids,threatEvents,operations,streaks,milestones,daysLeft};
};
const getCrossedMilestone = (beforePct, afterPct) => {
  const milestones=[10,25,50,75,90,100];
  return milestones.filter(pct=>beforePct<pct&&afterPct>=pct).pop() || null;
};

// ===== COMPONENTS =====

function Toast({toasts,onDismiss}){
  return React.createElement('div',{className:'toast-container'},
    toasts.map(t=>React.createElement('div',{key:t.id,className:'toast'},
      React.createElement('span',{className:'toast-icon'},t.icon),
      React.createElement('span',{className:'toast-text'},t.msg),
      React.createElement('button',{className:'toast-close',onClick:()=>onDismiss(t.id)},'x'))));
}

function SplashScreen(){
  return React.createElement('div',{className:'splash-screen','aria-label':'DoomLedger loading'},
    React.createElement('img',{className:'splash-image',src:assetUrl('splash-screen.png'),alt:'DoomLedger loading'}),
    React.createElement('div',{className:'splash-loader','aria-hidden':'true'},
      React.createElement('div',{className:'splash-loader-fill'})));
}

function VisualEffectOverlay({effect,onDismiss}){
  if(!effect) return null;
  const title=effect.title || (effect.kind==='damage'?'THREAT IMPACT':'SHIELD REINFORCED');
  return React.createElement('div',{className:`effect-overlay ${effect.kind}`,onAnimationEnd:onDismiss},
    React.createElement('div',{className:'effect-burst'}),
    React.createElement('div',{className:'effect-card'},
      React.createElement('img',{className:'effect-station',src:assetUrl('app-icon-512.png'),alt:''}),
      React.createElement('div',{className:'effect-kicker'},effect.kicker || 'DoomLedger Event'),
      React.createElement('div',{className:'effect-title'},title),
      effect.detail&&React.createElement('div',{className:'effect-detail'},effect.detail),
      effect.reward&&React.createElement('div',{className:'effect-reward'},effect.reward)));
}

function HudMetric({label,value,pct,tone='green'}){
  return React.createElement('div',{className:`hud-metric ${tone}`},
    React.createElement('div',{className:'hud-metric-top'},
      React.createElement('span',null,label),
      React.createElement('strong',null,value)),
    React.createElement('div',{className:'hud-bar'},
      React.createElement('div',{className:'hud-bar-fill',style:{width:clamp(pct,0,100)+'%'}})));
}

function HeaderHud({data,hasGoal}){
  if(!hasGoal) return React.createElement('div',{className:'header-status'},React.createElement('div',{className:'status-dot'}),'SYSTEM ONLINE');
  const saved=data.members.reduce((s,m)=>s+m.contribution,0);
  const shield=data.squad.goalAmount?Math.round(saved/data.squad.goalAmount*100):0;
  const threat=100-shield;
  const campaign=getCampaignState(data);
  const rank=getRankState(data,campaign);
  return React.createElement('div',{className:'header-hud'},
    React.createElement(HudMetric,{label:'Net Worth Shield',value:shield+'%',pct:shield,tone:'green'}),
    React.createElement(HudMetric,{label:'Debt Threat',value:threat+'%',pct:threat,tone:threat>60?'red':'orange'}),
    React.createElement(HudMetric,{label:'Command Rank',value:rank.current.name,pct:rank.progress,tone:'cyan'}));
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

function SquadShield({members,goal,pulse}){
  const active=members.filter(m=>m.status==='ACTIVE');
  const saved=members.reduce((s,m)=>s+m.contribution,0);
  const pct=Math.min(100,Math.round(saved/goal*100));
  const avg=Math.round(active.reduce((s,m)=>s+m.shieldHealth,0)/(active.length||1));
  return React.createElement('div',{className:`card ${pulse?'shield-card-pulse':''}`},
    React.createElement('div',{className:'card-title'},React.createElement(IconShield),' Squad Defense Status'),
    React.createElement(ShieldRing,{pct:pct,label:'Squad Shield'}),
    React.createElement('div',{className:'stats-grid',style:{marginTop:10}},
      React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},fmtCur(saved)),React.createElement('div',{className:'stat-lbl'},'Saved')),
      React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},fmtCur(goal)),React.createElement('div',{className:'stat-lbl'},'Target')),
      React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},avg+'%'),React.createElement('div',{className:'stat-lbl'},'Avg Shield')),
      React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},active.length+'/4'),React.createElement('div',{className:'stat-lbl'},'Active'))));
}

function AlertBanner({alert}){
  const icons={danger:'!',warning:'!',success:'OK'};
  return React.createElement('div',{className:`alert alert-${alert.type}`},
    React.createElement('span',{className:'alert-icon'},icons[alert.type]||'INFO'),
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
        m.role+(des?' / Left '+Math.floor((Date.now()-m.desertedAt)/864e5)+'d ago':'')),
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
  const icons={positive:'+$',negative:'-$',neutral:'OK'};
  const mission=getTransactionMission(tx);
  return React.createElement('div',{className:`tx-item ${tx.type}`},
    React.createElement('div',{className:`tx-icon ${tx.type}`},icons[tx.type]),
      React.createElement('div',{className:'tx-details'},
        React.createElement('div',{className:'tx-merchant'},tx.merchant),
      React.createElement('div',{className:'tx-cat'},tx.category+(tx.sourceLabel?' / '+tx.sourceLabel:'')),
      React.createElement('div',{className:'tx-mission'},mission.detail)),
    React.createElement('div',null,
      React.createElement('div',{className:`tx-amt ${tx.type}`},(tx.amount>0?'+':'')+fmtCur(tx.amount)),
      React.createElement('div',{className:`tx-impact ${tx.type}`},mission.label+' / '+tx.impact)));
}

function LBItem({rank,member,isWinner}){
  return React.createElement('div',{className:'lb-item'},
    React.createElement('div',{className:`lb-rank ${rank===1?'gold':rank===2?'silver':rank===3?'bronze':'other'}`},rank===1?'#1':rank),
    React.createElement('div',{className:'lb-info'},
      React.createElement('div',{className:'lb-name'},member.name,
        member.isYou&&React.createElement('span',{className:'badge badge-cyan'},'You'),
        member.status==='DESERTED'&&React.createElement('span',{className:'deserter-badge'},'Deserter')),
      React.createElement('div',{className:'lb-sub'},fmtCur(member.contribution)+' saved / '+(member.efficiency*100).toFixed(0)+'% efficiency'),
      isWinner&&React.createElement('div',{className:'de-badge'},React.createElement(IconCrown),' Defensive Engineer')),
    React.createElement('div',{className:'lb-score'},
      React.createElement('div',{className:'lb-score-val'},(member.efficiency*100).toFixed(0)),
      React.createElement('div',{className:'lb-score-lbl'},'Eff. Score')));
}

function QuestCard({data,onEditGoal}){
  const saved=data.members.reduce((s,m)=>s+m.contribution,0);
  const pct=data.squad.goalAmount?clamp(Math.round(saved/data.squad.goalAmount*100),0,100):0;
  const remaining=Math.max(0,data.squad.goalAmount-saved);
  const days=Math.max(1,Math.floor((data.squad.deadline-Date.now())/864e5));
  const milestones=[25,50,75,100];
  const rank=pct>=100?'Boss Clear':pct>=75?'Legend':pct>=50?'Veteran':pct>=25?'Scout':'Initiate';
  return React.createElement('div',{className:'quest-card card'},
    React.createElement('div',{className:'quest-header'},
      React.createElement('div',null,
        React.createElement('div',{className:'card-title'},React.createElement(IconTarget),' Active Mission'),
        React.createElement('div',{className:'quest-name'},data.squad.name)),
      React.createElement('button',{className:'mini-btn',onClick:onEditGoal},'Recalibrate')),
    React.createElement('div',{className:'quest-progress'},
      React.createElement('div',{className:'quest-progress-fill',style:{width:pct+'%'}}),
      React.createElement('span',null,pct+'%')),
    React.createElement('div',{className:'quest-meta'},
      React.createElement('span',null,'Rank: '+rank),
      React.createElement('span',null,'Remaining: '+fmtCur(remaining)),
      React.createElement('span',null,'Deadline: '+days+'d')),
    React.createElement('div',{className:'quest-milestones'},
      milestones.map(m=>React.createElement('div',{key:m,className:`quest-node ${pct>=m?'earned':''}`},m+'%'))));
}

function StationUpgrade({campaign}){
  const tier=campaign.pct>=100?'complete':campaign.pct>=90?'final':campaign.pct>=75?'grid':campaign.pct>=50?'core':campaign.pct>=25?'shield':campaign.pct>=10?'signal':'offline';
  const label={
    offline:'Station Cold Start',
    signal:'Signal Lock Active',
    shield:'Shield Ring Online',
    core:'Armor Core Brightened',
    grid:'Defensive Grid Active',
    final:'Final Stand Armed',
    complete:'Station Fully Reinforced',
  }[tier];
  return React.createElement('div',{className:`card station-card ${tier}`},
    React.createElement('div',{className:'card-title'},React.createElement(IconShield),' Station Upgrade Visual'),
    React.createElement('div',{className:'station-stage'},
      React.createElement('div',{className:'station-aura'}),
      React.createElement('img',{className:'station-image',src:assetUrl('app-icon-512.png'),alt:'Station upgrade state'}),
      React.createElement('div',{className:'station-shield'}),
      React.createElement('div',{className:'station-grid'})),
    React.createElement('div',{className:'station-label'},label),
    React.createElement('div',{className:'station-sub'},campaign.pct+'% structural reinforcement'));
}

function MissionDebrief({campaign,data}){
  if(campaign.pct<100) return null;
  const earned=getBadges(data).filter(b=>b.state==='earned').length;
  return React.createElement('div',{className:'card debrief-card'},
    React.createElement('div',{className:'card-title'},React.createElement(IconCrown),' Mission Debrief'),
    React.createElement('div',{className:'debrief-title'},'MISSION CLEARED'),
    React.createElement('div',{className:'debrief-grid'},
      React.createElement('div',null,React.createElement('strong',null,fmtCur(campaign.saved)),React.createElement('span',null,'Total Saved')),
      React.createElement('div',null,React.createElement('strong',null,campaign.daysLeft),React.createElement('span',null,'Days Remaining')),
      React.createElement('div',null,React.createElement('strong',null,earned),React.createElement('span',null,'Badges Earned')),
      React.createElement('div',null,React.createElement('strong',null,'S-Rank'),React.createElement('span',null,'Final Rank'))));
}

function BadgeRack({data}){
  return React.createElement('div',{className:'card'},
    React.createElement('div',{className:'card-title'},React.createElement(IconCrown),' Badge Rack'),
    React.createElement('div',{className:'badge-rack'},
      getBadges(data).map(b=>React.createElement('div',{key:b.name,className:`achievement ${b.state}`},
        React.createElement('div',{className:'achievement-mark'},b.state==='earned'?'ON':'--'),
        React.createElement('div',null,
          React.createElement('div',{className:'achievement-name'},b.name),
          React.createElement('div',{className:'achievement-hint'},b.hint))))));
}

function RankPanel({rankState}){
  return React.createElement('div',{className:'card rank-panel'},
    React.createElement('div',{className:'card-title'},React.createElement(IconCrown),' Command Rank Ladder'),
    React.createElement('div',{className:'rank-hero'},
      React.createElement('div',{className:'rank-insignia'},rankState.index+1),
      React.createElement('div',{className:'rank-copy'},
        React.createElement('div',{className:'rank-kicker'},'Current Rank'),
        React.createElement('div',{className:'rank-name'},rankState.current.name),
        React.createElement('div',{className:'rank-next'},rankState.next?'Next: '+rankState.next.name+' at '+rankState.next.xp+' XP':'Maximum rank achieved')),
      React.createElement('div',{className:'rank-xp'},rankState.xp+' XP')),
    React.createElement('div',{className:'rank-progress'},
      React.createElement('div',{style:{width:rankState.progress+'%'}}),
      React.createElement('span',null,rankState.progress+'% to next rank')),
    React.createElement('div',{className:'rank-ladder'},
      rankState.ranks.map((rank,i)=>React.createElement('div',{key:rank.name,className:`rank-step ${i<rankState.index?'earned':i===rankState.index?'current':''}`},
        React.createElement('span',{className:'rank-step-index'},String(i+1).padStart(2,'0')),
        React.createElement('span',{className:'rank-step-name'},rank.name),
        React.createElement('span',{className:'rank-step-xp'},rank.xp+' XP')))));
}

function CampaignPhasePanel({campaign}){
  return React.createElement('div',{className:'card campaign-panel'},
    React.createElement('div',{className:'card-title'},React.createElement(IconClock),' Countdown Phase'),
    React.createElement('div',{className:`phase-banner ${campaign.phase.tone}`},
      React.createElement('div',null,
        React.createElement('div',{className:'phase-name'},campaign.phase.name),
        React.createElement('div',{className:'phase-objective'},campaign.phase.objective)),
      React.createElement('div',{className:`pace-chip ${campaign.pace.tone}`},campaign.pace.label)),
    React.createElement('div',{className:'phase-grid'},
      React.createElement('div',{className:'phase-stat'},React.createElement('strong',null,campaign.pct+'%'),React.createElement('span',null,'Actual')),
      React.createElement('div',{className:'phase-stat'},React.createElement('strong',null,campaign.expectedPct+'%'),React.createElement('span',null,'Expected')),
      React.createElement('div',{className:'phase-stat'},React.createElement('strong',null,(campaign.pace.delta>0?'+':'')+campaign.pace.delta+'%'),React.createElement('span',null,'Pace Delta'))));
}

function MilestoneTimeline({campaign}){
  return React.createElement('div',{className:'card'},
    React.createElement('div',{className:'card-title'},React.createElement(IconTarget),' Checkpoint Bosses'),
    React.createElement('div',{className:'timeline-track'},
      campaign.milestones.map(m=>React.createElement('div',{key:m.pct,className:`timeline-node ${campaign.pct>=m.pct?'earned':campaign.pct+10>=m.pct?'next':''}`},
        React.createElement('div',{className:'timeline-dot'},campaign.pct>=m.pct?'ON':m.pct),
        React.createElement('div',{className:'timeline-name'},m.name),
        React.createElement('div',{className:'timeline-reward'},m.reward)))));
}

function WeeklyRaids({campaign}){
  return React.createElement('div',{className:'card'},
    React.createElement('div',{className:'card-title'},React.createElement(IconZap),' Weekly Raid Missions'),
    React.createElement('div',{className:'raid-list'},
      campaign.raids.map(raid=>React.createElement('div',{key:raid.name,className:`raid-card ${raid.status}`},
        React.createElement('div',{className:'raid-head'},
          React.createElement('div',{className:'raid-name'},raid.name),
          React.createElement('span',{className:'raid-reward'},raid.reward)),
        React.createElement('div',{className:'raid-target'},raid.target),
        React.createElement('div',{className:'raid-bar'},React.createElement('div',{style:{width:raid.progress+'%'}})),
        React.createElement('div',{className:'raid-status'},raid.status.toUpperCase())))));
}

function ThreatAndStreaks({campaign}){
  return React.createElement('div',{className:'campaign-split'},
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconAlert),' Threat Events'),
      campaign.threatEvents.map(event=>React.createElement('div',{key:event.name,className:`threat-event ${event.tone}`},
        React.createElement('div',{className:'threat-name'},event.name),
        React.createElement('div',{className:'threat-detail'},event.detail)))),
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconShield),' Streak Systems'),
      campaign.streaks.map(streak=>React.createElement('div',{key:streak.name,className:'streak-row'},
        React.createElement('div',{className:'streak-value'},streak.value),
        React.createElement('div',null,
          React.createElement('div',{className:'streak-name'},streak.name),
          React.createElement('div',{className:'streak-detail'},streak.detail))))));
}

function RecommendedOperations({campaign,onAccept}) {
  return React.createElement('div',{className:'card'},
    React.createElement('div',{className:'card-title'},React.createElement(IconTarget),' Recommended Operations'),
    React.createElement('div',{className:'operation-grid'},
      campaign.operations.map(op=>React.createElement('div',{key:op.name,className:'operation-card'},
        React.createElement('div',{className:'operation-name'},op.name),
        React.createElement('div',{className:'operation-meta'},fmtCur(op.target)+' / '+op.days+'d / '+fmtCur(op.pledge)+'/wk'),
        React.createElement('p',{className:'operation-reason'},op.rationale),
        React.createElement('button',{className:'mini-btn',onClick:()=>onAccept(op)},'Accept Operation')))));
}

// ===== SCREENS =====

function AccountConnectScreen({onConnect,onUseDemo,plaidStatus}){
  const itemCount=plaidStatus.itemCount||0;
  const maxItems=plaidStatus.maxItems||2;
  const full=itemCount>=maxItems;
  return React.createElement('div',{className:'screen active connect-shell'},
    React.createElement('div',{className:'setup-hero'},
      React.createElement('div',{className:'setup-kicker'},'Ledger Scan Required'),
      React.createElement('div',{className:'setup-title'},'Connect First. Choose Smarter.'),
      React.createElement('p',{className:'setup-copy'},'DoomLedger analyzes your account activity before mission selection, then suggests goals based on spending pressure, transfer habits, and realistic weekly pace.')),
    React.createElement('div',{className:'connect-grid'},
      React.createElement('div',{className:'card connect-card'},
        React.createElement('div',{className:'card-title'},React.createElement(IconWallet),' Account Link'),
        React.createElement('div',{className:'connect-visual'},
          React.createElement('div',{className:'connect-core'},'BANK'),
          React.createElement('div',{className:'connect-ring ring-one'}),
          React.createElement('div',{className:'connect-ring ring-two'})),
        React.createElement('div',{className:'connect-title'},itemCount>0?`Signal Array ${itemCount}/${maxItems} Connected`:'Connecting to Signal Array'),
        React.createElement('p',{className:'connect-copy'},plaidStatus.staticHost
          ?'The live GitHub Pages site cannot run the private Plaid backend. Use the demo scan here, or run npm run dev locally to connect Plaid.'
          :plaidStatus.configured
            ? full
              ?'Two Signal Arrays are already linked. Rescan them to refresh suggested missions.'
              :'Plaid Sandbox is ready. Link up to two accounts so DoomLedger can scan transactions and suggest missions.'
            :'Plaid keys are missing. Add them to .env, then restart npm run dev.'),
        React.createElement('button',{className:'btn btn-primary',onClick:()=>onConnect(!full),disabled:plaidStatus.loading||plaidStatus.staticHost||!plaidStatus.configured},
          React.createElement(IconWallet),plaidStatus.loading?'Connecting to Signal Array...':full?'Resync Signal Arrays':itemCount===1?'Connect Second Signal Array':'Connect Signal Array'),
        React.createElement('button',{className:'btn btn-secondary',onClick:onUseDemo},React.createElement(IconZap),' Use Demo Ledger Scan')),
      React.createElement('div',{className:'card'},
        React.createElement('div',{className:'card-title'},React.createElement(IconTarget),' What Gets Analyzed'),
        React.createElement('div',{className:'scan-list'},
          ['Recurring outflows become threat pressure','Savings transfers become shield strength','Discretionary spending becomes lockdown missions','Weekly capacity becomes suggested pledge'].map((item,i)=>
            React.createElement('div',{className:'scan-row',key:item},
              React.createElement('span',{className:'scan-index'},String(i+1).padStart(2,'0')),
              React.createElement('span',null,item)))))));
}

function MissionSetup({onCreate,suggestions,onBack}){
  const first=suggestions[0];
  const [form,setForm]=useState({
    name:first?.name || 'Emergency Fund',
    target:String(first?.target || 10000),
    saved:String(first?.saved || 1200),
    days:String(first?.days || 90),
    pledge:String(first?.pledge || 300),
    difficulty:first?.difficulty || 'veteran'
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
  const applySuggestion=(mission)=>setForm({
    name:mission.name,
    target:String(mission.target),
    saved:String(mission.saved),
    days:String(mission.days),
    pledge:String(mission.pledge),
    difficulty:mission.difficulty,
  });
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
      React.createElement('div',{className:'setup-kicker'},'Mission Suggestions Online'),
      React.createElement('div',{className:'setup-title'},'Choose Your Financial Mission'),
      React.createElement('p',{className:'setup-copy'},'These missions were generated after the ledger scan. Pick one, tune the numbers, then deploy.')),
    React.createElement('div',{className:'suggestion-grid'},
      suggestions.map((mission,i)=>React.createElement('button',{key:mission.name,type:'button',className:'suggestion-card',onClick:()=>applySuggestion(mission)},
        React.createElement('div',{className:'suggestion-top'},
          React.createElement('span',{className:'scan-index'},String(i+1).padStart(2,'0')),
          React.createElement('span',{className:`suggestion-difficulty ${mission.difficulty}`},mission.difficulty)),
        React.createElement('div',{className:'suggestion-name'},mission.name),
        React.createElement('div',{className:'suggestion-stats'},
          React.createElement('span',null,fmtCur(mission.target)),
          React.createElement('span',null,mission.days+'d'),
          React.createElement('span',null,fmtCur(mission.pledge)+'/wk')),
        React.createElement('p',{className:'suggestion-reason'},mission.rationale)))),
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
      React.createElement('button',{className:'btn btn-primary',onClick:submit},React.createElement(IconShield),' Deploy Ledger Mission'),
      React.createElement('button',{className:'btn btn-secondary back-btn',onClick:onBack},React.createElement(IconWallet),' Rescan Account')),
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconCrown),' Unlock Path'),
      React.createElement('div',{className:'milestone-list'},
        [25,50,75,100].map(p=>React.createElement('div',{className:'milestone',key:p},
          React.createElement('div',{className:'milestone-rank'},p+'%'),
          React.createElement('div',{className:'milestone-text'},p===100?'Boss Clear':'Rank Up'))))));
}

function HomeScreen({data,onEditGoal,onLinkBank,onLogSavings,onAcceptOperation,plaidStatus,effectTone}){
  const saved=data.members.reduce((s,m)=>s+m.contribution,0);
  const days=Math.floor((data.squad.deadline-Date.now())/864e5);
  const pace=Math.max(0,(data.squad.goalAmount-saved)/Math.max(1,days));
  const you=data.members.find(m=>m.isYou);
  const mission=data.squad.mission;
  const threatClass=(mission?.threat||'Critical').toLowerCase();
  const campaign=getCampaignState(data);
  const rankState=getRankState(data,campaign);
  return React.createElement('div',{className:'screen active'},
    React.createElement('div',{className:'command-grid'},
      React.createElement(DoomClock,{deadline:data.squad.deadline,goal:data.squad.goalAmount,current:saved}),
      React.createElement(QuestCard,{data,onEditGoal})),
    React.createElement(StationUpgrade,{campaign}),
    React.createElement(RankPanel,{rankState}),
    React.createElement(MissionDebrief,{campaign,data}),
    React.createElement(CampaignPhasePanel,{campaign}),
    React.createElement(MilestoneTimeline,{campaign}),
    React.createElement(WeeklyRaids,{campaign}),
    React.createElement(SquadShield,{members:data.members,goal:data.squad.goalAmount,pulse:effectTone==='repair'||effectTone==='reward'||effectTone==='complete'}),
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconTarget),' Mission Parameters'),
      React.createElement('div',{className:'stats-grid'},
        React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},fmtCur(pace)),React.createElement('div',{className:'stat-lbl'},'Daily Pace')),
        React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},days),React.createElement('div',{className:'stat-lbl'},'Days Left')),
        React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},fmtCur(you?.contribution||0)),React.createElement('div',{className:'stat-lbl'},'Your Save')),
        React.createElement('div',{className:'stat-box'},React.createElement('div',{className:'stat-val'},((you?.efficiency||0)*100).toFixed(0)+'%'),React.createElement('div',{className:'stat-lbl'},'Your Eff.'))),
      mission&&React.createElement('div',{className:'mission-preview'},
        React.createElement('div',{className:'preview-cell'},React.createElement('div',{className:'preview-value'},mission.difficulty.toUpperCase()),React.createElement('div',{className:'preview-label'},'Mode')),
        React.createElement('div',{className:`preview-cell threat-${threatClass}`},React.createElement('div',{className:'preview-value'},mission.threat),React.createElement('div',{className:'preview-label'},'Threat')),
        React.createElement('div',{className:'preview-cell'},React.createElement('div',{className:'preview-value'},mission.xp),React.createElement('div',{className:'preview-label'},'XP')),
        React.createElement('div',{className:'preview-cell'},React.createElement('div',{className:'preview-value'},fmtCur(mission.pledge)),React.createElement('div',{className:'preview-label'},'Weekly')))),
    React.createElement(ThreatAndStreaks,{campaign}),
    React.createElement(RecommendedOperations,{campaign,onAccept:onAcceptOperation}),
    React.createElement(BadgeRack,{data}),
    data.alerts.map(a=>React.createElement(AlertBanner,{key:a.id,alert:a})),
    (!plaidStatus.configured||plaidStatus.staticHost)&&React.createElement('div',{className:'alert alert-warning'},
      React.createElement('span',{className:'alert-icon'},'API'),
      React.createElement('span',{className:'alert-text'},React.createElement('strong',null,'Plaid setup needed. '),plaidStatus.staticHost?'GitHub Pages is static, so run the app locally with npm run dev to use the Plaid backend.':'Copy .env.example to .env and add your Sandbox keys before linking Signal Arrays.')),
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconZap),' Quick Actions'),
      React.createElement('div',{className:'quick-actions'},
        React.createElement('button',{className:'btn btn-primary',onClick:onLogSavings},React.createElement(IconPlus),' Log Savings Transfer'),
        React.createElement('button',{className:'btn btn-secondary',onClick:()=>onLinkBank(false),disabled:plaidStatus.loading},React.createElement(IconWallet),plaidStatus.loading?'Connecting...':plaidStatus.connected?'Sync Signal Arrays':'Connect Signal Array'),
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
        React.createElement('p',null,'- ',React.createElement('strong',null,'Desertion Protocol:'),' Past contributions stay. Future liability redistributes.'),
        React.createElement('p',null,'- ',React.createElement('strong',null,'Vote to Continue:'),' Unanimous vote required to dissolve. Default: continue.'),
        React.createElement('p',null,'- ',React.createElement('strong',null,'Efficiency Score:'),' (Savings / Income) x Consistency. Higher is better.'),
        React.createElement('p',null,'- ',React.createElement('strong',null,'Defensive Engineer:'),' Awarded to highest efficiency on Invasion Day.'))));
}

function ActivityScreen({data,onLinkBank}){
  return React.createElement('div',{className:'screen active'},
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconActivity),' Transaction Feed'),
      data.transactions.length===0
        ?React.createElement('div',{className:'empty'},
          React.createElement('div',{className:'empty-icon'},'SIGNAL'),
          React.createElement('div',{className:'empty-title'},'Your ledger is silent'),
          React.createElement('div',{className:'empty-text'},'Connect Plaid to awaken the vault and turn spending into mission events.'),
          React.createElement('button',{className:'btn btn-secondary empty-action',onClick:onLinkBank},React.createElement(IconWallet),' Link Bank'))
        :data.transactions.map(tx=>React.createElement(TxItem,{key:tx.id,tx:tx}))),
    React.createElement('div',{className:'card'},
      React.createElement('div',{className:'card-title'},React.createElement(IconAlert),' Squad Alerts'),
      data.alerts.map(a=>React.createElement(AlertBanner,{key:a.id,alert:a})),
      data.alerts.length===0&&React.createElement('div',{className:'empty'},React.createElement('div',{className:'empty-icon'},'CLEAR'),React.createElement('div',{className:'empty-title'},'All sectors secure'),React.createElement('div',{className:'empty-text'},'No active alerts.'))));
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
  const [accountAnalyzed,setAccountAnalyzed]=useState(false);
  const [suggestedMissions,setSuggestedMissions]=useState([]);
  const [showSplash,setShowSplash]=useState(true);
  const [visualEffect,setVisualEffect]=useState(null);
  const [effectTone,setEffectTone]=useState('');
  const [plaidStatus,setPlaidStatus]=useState({configured:false,connected:false,itemCount:0,maxItems:2,canLinkMore:true,loading:false,environment:'sandbox',products:[],items:[],staticHost:isStaticPagesHost()});

  const addToast=useCallback((icon,msg)=>{
    const id=Date.now()+Math.random();
    setToasts(p=>[...p,{id,icon,msg}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3500);
  },[]);

  const dismissToast=useCallback(id=>setToasts(p=>p.filter(t=>t.id!==id)),[]);

  const triggerVisualEffect=useCallback(effect=>{
    setVisualEffect({...effect,id:Date.now()+Math.random()});
    setEffectTone(effect.kind||'repair');
    setTimeout(()=>setEffectTone(''),900);
  },[]);

  const markLedgerAnalyzed=useCallback((transactions, label='Ledger scan complete.')=>{
    const missions=generateMissionSuggestions(transactions);
    setSuggestedMissions(missions);
    setAccountAnalyzed(true);
    setHasGoal(false);
    setTab('home');
    addToast('SCAN',label);
  },[addToast]);

  const handleVote=useCallback(voteType=>{
    setData(p=>({...p,vote:{...p.vote,votes:{...p.vote.votes,'u_001':voteType}}}));
    addToast(voteType==='CONTINUE'?'SHIELD':'EXIT',voteType==='CONTINUE'?'Vote cast: Hold the Line':'Vote cast: Abandon Post');
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

  const handleAcceptOperation=useCallback(operation=>{
    handleCreateGoal(operation);
    triggerVisualEffect({kind:'reward',kicker:'Operation Accepted',title:'MISSION UPDATED',detail:operation.name+' is now the active campaign.',reward:'+100 XP / New Objective'});
    addToast('OPS','Recommended operation accepted: '+operation.name);
  },[addToast,handleCreateGoal,triggerVisualEffect]);

  const handleLogSavings=useCallback(()=>{
    const amount=100;
    setData(p=>{
      const current=p.members.find(m=>m.isYou)?.contribution||0;
      const beforePct=p.squad.goalAmount?clamp(Math.round(current/p.squad.goalAmount*100),0,100):0;
      const next=clamp(current+amount,0,p.squad.goalAmount);
      const shield=p.squad.goalAmount?clamp(Math.round(next/p.squad.goalAmount*100),0,100):0;
      const milestone=getCrossedMilestone(beforePct,shield);
      const beforeCampaign=getCampaignState(p);
      const beforeRank=getRankState(p,beforeCampaign);
      const previewData={...p,members:p.members.map(m=>m.isYou?{...m,contribution:next,shieldHealth:shield,efficiency:clamp(m.efficiency+0.02,0.1,1)}:m)};
      const afterRank=getRankState(previewData,getCampaignState(previewData));
      if(milestone===100) {
        triggerVisualEffect({kind:'complete',kicker:'Final Debrief',title:'MISSION CLEARED',detail:p.squad.name+' reached full reinforcement.',reward:'+500 XP / S-Rank'});
      } else if(afterRank.index>beforeRank.index) {
        triggerVisualEffect({kind:'reward',kicker:'Rank Promotion',title:afterRank.current.name.toUpperCase(),detail:'Command authority increased through mission progress.',reward:afterRank.xp+' XP'});
      } else if(milestone) {
        triggerVisualEffect({kind:'reward',kicker:'Checkpoint Boss Defeated',title:milestone+'% CLEARED',detail:'Station systems upgraded at checkpoint '+milestone+'%.',reward:'+150 XP / Reward Crate Opened'});
      } else {
        triggerVisualEffect({kind:'repair',kicker:'Progress Beam',title:'+100 SHIELD POWER',detail:'Savings transfer routed into the station core.',reward:'+25 XP'});
      }
      return {
        ...p,
        members:p.members.map(m=>m.isYou?{...m,contribution:next,shieldHealth:shield,efficiency:clamp(m.efficiency+0.02,0.1,1)}:m),
        transactions:[
          {id:'tx_manual_'+Date.now(),userId:'u_001',merchant:'Manual Savings Transfer',category:'SAVINGS',amount,type:'positive',impact:'+1% Shield',timestamp:new Date()},
          ...p.transactions,
        ],
        alerts:[
          {id:'a_save_'+Date.now(),type:'success',message:'Savings transfer logged. Shield integrity increased to '+shield+'%.',timestamp:new Date()},
          ...p.alerts,
        ],
      };
    });
    addToast('SAVE','+100 SHIELD POWER');
  },[addToast,triggerVisualEffect]);

  const syncPlaidTransactions=useCallback(async()=>{
    const result=await apiRequest('/api/transactions');
    const incoming=[...result.added,...result.modified];
    setPlaidStatus(p=>{
      const itemCount=result.itemCount??p.itemCount;
      return {...p,itemCount,connected:itemCount>0,canLinkMore:itemCount<(p.maxItems||2)};
    });
    if(!incoming.length) {
      addToast('SYNC','No new bank transactions found.');
      return [];
    }
    if(incoming.some(tx=>tx.type==='negative')) {
      triggerVisualEffect({kind:'damage',kicker:'Threat Event',title:'DAMAGE REPORT',detail:'A synced transaction hit mission stability.',reward:'Counter-mission recommended'});
    } else if(incoming.some(tx=>tx.type==='positive')) {
      triggerVisualEffect({kind:'repair',kicker:'Signal Array Sync',title:'SHIELD REINFORCED',detail:'Positive ledger movement repaired station armor.',reward:'+75 XP'});
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
    return incoming;
  },[addToast,triggerVisualEffect]);

  const handleUseDemoScan=useCallback(()=>{
    setData(DEMO);
    markLedgerAnalyzed(DEMO.transactions,'Demo ledger analyzed. Suggestions generated.');
  },[markLedgerAnalyzed]);

  const handleLinkBank=useCallback(async(forceLink=false)=>{
    if(plaidStatus.staticHost) {
      addToast('LOCAL','Plaid requires the local backend. Run npm run dev on your machine.');
      return;
    }
    setPlaidStatus(p=>({...p,loading:true}));
    try {
      if(plaidStatus.connected && !forceLink) {
        try {
          const synced=await syncPlaidTransactions();
          markLedgerAnalyzed(synced.length?synced:data.transactions,'Account analyzed. Suggestions refreshed.');
        } finally {
          setPlaidStatus(p=>({...p,loading:false}));
        }
        return;
      }
      if(forceLink && plaidStatus.connected && plaidStatus.canLinkMore===false) {
        const synced=await syncPlaidTransactions();
        markLedgerAnalyzed(synced.length?synced:data.transactions,'Two Signal Arrays already linked. Suggestions refreshed.');
        setPlaidStatus(p=>({...p,loading:false}));
        return;
      }

      await loadPlaidLink();
      const { link_token: linkToken }=await apiRequest('/api/create_link_token',{method:'POST'});
      const handler=window.Plaid.create({
        token:linkToken,
        onSuccess:async(publicToken)=>{
          try {
            const exchange=await apiRequest('/api/exchange_public_token',{
              method:'POST',
              body:JSON.stringify({public_token:publicToken}),
            });
            setPlaidStatus(p=>({
              ...p,
              connected:true,
              itemCount:exchange.item_count??Math.min((p.itemCount||0)+1,p.maxItems||2),
              maxItems:exchange.max_items??p.maxItems,
              canLinkMore:(exchange.item_count??((p.itemCount||0)+1)) < (exchange.max_items??p.maxItems??2),
            }));
            addToast('LINK','Signal Array linked.');
            const synced=await syncPlaidTransactions();
            markLedgerAnalyzed(synced.length?synced:data.transactions,'Account connected and analyzed.');
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
  },[addToast,data.transactions,markLedgerAnalyzed,plaidStatus.canLinkMore,plaidStatus.connected,plaidStatus.staticHost,syncPlaidTransactions]);

  useEffect(()=>{
    if(isStaticPagesHost()) {
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

  useEffect(()=>{
    const timeout=setTimeout(()=>setShowSplash(false),5400);
    return()=>clearTimeout(timeout);
  },[]);

  const tabs=[
    {id:'home',label:'Command',icon:IconHome},
    {id:'squad',label:'Squad',icon:IconSquad},
    {id:'activity',label:'Feed',icon:IconActivity},
    {id:'leaderboard',label:'Ranks',icon:IconLeaderboard},
  ];

  const renderScreen=()=>{
    if(!accountAnalyzed) return React.createElement(AccountConnectScreen,{onConnect:handleLinkBank,onUseDemo:handleUseDemoScan,plaidStatus});
    if(!hasGoal) return React.createElement(MissionSetup,{onCreate:handleCreateGoal,suggestions:suggestedMissions,onBack:()=>setAccountAnalyzed(false)});
    switch(tab){
      case 'home':return React.createElement(HomeScreen,{data,onEditGoal:()=>setHasGoal(false),onLinkBank:handleLinkBank,onLogSavings:handleLogSavings,onAcceptOperation:handleAcceptOperation,plaidStatus,effectTone});
      case 'squad':return React.createElement(SquadScreen,{data,onVote:handleVote});
      case 'activity':return React.createElement(ActivityScreen,{data,onLinkBank:handleLinkBank});
      case 'leaderboard':return React.createElement(LeaderboardScreen,{data});
      default:return React.createElement(HomeScreen,{data,onEditGoal:()=>setHasGoal(false),onLinkBank:handleLinkBank,onLogSavings:handleLogSavings,onAcceptOperation:handleAcceptOperation,plaidStatus,effectTone});
    }
  };

  return React.createElement('div',{className:`app ${effectTone?`impact-${effectTone}`:''}`},
    showSplash&&React.createElement(SplashScreen),
    React.createElement(VisualEffectOverlay,{effect:visualEffect,onDismiss:()=>setVisualEffect(null)}),
    React.createElement('div',{className:'ambient-grid','aria-hidden':'true'}),
    React.createElement('div',{className:'scanline','aria-hidden':'true'}),
    React.createElement(Toast,{toasts,onDismiss:dismissToast}),
    React.createElement('div',{className:'header'},
      React.createElement('img',{className:'header-logo',src:assetUrl('doomledger-logo.png'),alt:'DoomLedger'}),
      React.createElement(HeaderHud,{data,hasGoal})),
    React.createElement('div',{className:'main'},renderScreen()),
    hasGoal&&React.createElement('div',{className:'bottom-nav'},
      tabs.map(t=>React.createElement('button',{
        key:t.id,className:`nav-item ${tab===t.id?'active':''}`,onClick:()=>setTab(t.id)
      },React.createElement(t.icon),t.label))));
}
export default App;

