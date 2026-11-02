(function(root){
  'use strict';
  const VERSION=1;
  function fresh(){return {version:VERSION,chapter:0,started:false,videoDone:{},positions:{},read:{},answers:{},reviewed:{},name:'',completedDate:null};}
  function normalize(raw){
    const s=fresh();
    if(!raw||raw.version!==VERSION)return s;
    s.chapter=Number.isInteger(raw.chapter)&&raw.chapter>=0&&raw.chapter<3?raw.chapter:0;
    s.started=raw.started===true;
    for(let i=1;i<=6;i++){
      const id='v'+i;
      if(raw.videoDone?.[id]===true)s.videoDone[id]=true;
      if(Number.isFinite(raw.positions?.[id])&&raw.positions[id]>=0)s.positions[id]=raw.positions[id];
    }
    for(let i=0;i<3;i++)if(raw.read?.[i]===true)s.read[i]=true;
    for(let i=1;i<=10;i++){
      const id='q'+i,a=raw.answers?.[id];
      if(Number.isInteger(a)&&a>=0&&a<=3){s.answers[id]=a;if(raw.reviewed?.[id]===true)s.reviewed[id]=true;}
    }
    s.name=typeof raw.name==='string'?raw.name.slice(0,80):'';
    s.completedDate=/^\d{4}-\d{2}-\d{2}$/.test(raw.completedDate||'')?raw.completedDate:null;
    return s;
  }
  function complete(s){return Array.from({length:6},(_,i)=>'v'+(i+1)).every(id=>s.videoDone[id]===true)&&[0,1,2].every(i=>s.read[i]===true)&&Array.from({length:10},(_,i)=>'q'+(i+1)).every(id=>Number.isInteger(s.answers[id])&&s.reviewed[id]===true);}
  function chapterDone(s,ch,i){return ch.videos.every(id=>s.videoDone[id])&&s.read[i]===true&&ch.groups.flat().every(id=>Number.isInteger(s.answers[id])&&s.reviewed[id]);}
  function progress(s){return Object.values(s.videoDone).filter(Boolean).length+Object.values(s.read).filter(Boolean).length+Object.keys(s.answers).filter(id=>s.reviewed[id]).length;}
  function localDate(d=new Date()){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function stamp(s,d=new Date()){if(complete(s)&&!s.completedDate)s.completedDate=localDate(d);return s;}
  function validName(n){return typeof n==='string'&&n.trim().length>0&&n.trim().length<=80;}
  function nameSize(n){const units=Array.from(n).reduce((sum,c)=>sum+(/[\x00-\x7F]/.test(c)?0.6:1),0);return units>40?26:units>24?34:units>14?44:56;}
  const api={fresh,normalize,complete,chapterDone,progress,localDate,stamp,validName,nameSize};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.CourseState=api;
})(typeof window!=='undefined'?window:globalThis);
