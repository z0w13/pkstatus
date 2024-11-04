import{Q as a,b as s,a as f}from"./QItem-DFQyp7xd.js";import{R as D,S as N,U as K,W as I,ap as j,Z as e,Y as t,a2 as l,a8 as k,$ as n,at as A,ah as $,T as M,ar as H,r as S,d as q,a1 as O,a3 as Y,d2 as z,dd as L,de as W,aq as G,aJ as X,as as Z,X as T,aM as ee,a5 as F,df as te,a9 as w,a7 as C,a4 as R}from"./index-B5cKJEsb.js";import{Q as J}from"./QSelect-D38puw0H.js";import{Q as ae}from"./QList-CeI3M5mw.js";import{Q as le}from"./QPage-CQHXzn9r.js";import{I as se}from"./InitialFallbackAvatar-DdQhVARR.js";import{P as oe}from"./PageTitle-DsxZJMWH.js";import"./QMenu-BD1NPTJN.js";import"./format-CPyQx2aO.js";import"./rtl-DFPa-2ov.js";import"./index-DhNyYKrN.js";const ne=D({__name:"IdSection",setup(x){const g=N(),{id:v}=K(g);return(h,d)=>(I(),j(A,null,[e(a,{header:""},{default:t(()=>[l("ID Settings")]),_:1}),e(f,{tag:"label"},{default:t(()=>[e(s,null,{default:t(()=>[e(a,null,{default:t(()=>[l("Capitalize IDs")]),_:1}),e(a,{caption:""},{default:t(()=>[l(" Whether to display IDs as capital letters, to ease readability ")]),_:1})]),_:1}),e(s,{avatar:""},{default:t(()=>[e(k,{modelValue:n(v).caps,"onUpdate:modelValue":d[0]||(d[0]=p=>n(v).caps=p)},null,8,["modelValue"])]),_:1})]),_:1}),e(f,{tag:"label"},{default:t(()=>[e(s,null,{default:t(()=>[e(a,null,{default:t(()=>[l("Split IDs")]),_:1}),e(a,{caption:""},{default:t(()=>[l(" Whether to display 6-character IDs split with a hyphen, to ease readability ")]),_:1})]),_:1}),e(s,{avatar:""},{default:t(()=>[e(k,{modelValue:n(v).sep,"onUpdate:modelValue":d[1]||(d[1]=p=>n(v).sep=p)},null,8,["modelValue"])]),_:1})]),_:1})],64))}}),ue=$(ne,[["__file","/home/zowie/dev/pkstatus/src/pages/Settings/IdSection.vue"]]),re=D({__name:"BackupSection",emits:["restore"],setup(x,{emit:g}){const v=M(),h=N(),d=H(),p=S(),b=g;function V(){const u={settings:JSON.parse(localStorage.getItem("settings")||"{}"),systems:JSON.parse(localStorage.getItem("systems")||"{}")};return u.settings.settings.token=null,new File([JSON.stringify(u,null,2)],`PKStatus-${z().format("YYYYMMDD_HHmmss")}.json`,{type:"application/json"})}const _=S(V()),U=q(()=>URL.createObjectURL(_.value));async function y(){var c;if(!((c=p.value)!=null&&c.files))return;const u=p.value.files[0];if(u)try{const m=JSON.parse(await u.text()),i=L(m.settings),P=W(m.systems);v.dialog({title:"Warning!",message:"This will overwrite all your PKStatus settings and tracked systems, are you sure?",persistent:!0,ok:{push:!0,icon:"warning",label:"Yes, Overwrite!",color:"negative"},cancel:{push:!0,color:"primary"}}).onOk(()=>{i.settings.token||(i.settings.token=h.token),localStorage.setItem("settings",JSON.stringify(i)),localStorage.setItem("systems",JSON.stringify(P)),h.$hydrate(),d.$hydrate(),v.notify({icon:"check",type:"positive",message:"Backup restored!"}),b("restore")})}catch(m){if(m instanceof SyntaxError)v.notify({icon:"error",type:"negative",message:"Error parsing backup file",caption:m.message});else throw m}}return(u,c)=>(I(),j(A,null,[e(a,{header:""},{default:t(()=>[l("Backup & Restore")]),_:1}),e(f,null,{default:t(()=>[e(s,null,{default:t(()=>[e(O,{color:"positive",label:"backup",href:U.value,download:_.value.name},null,8,["href","download"])]),_:1}),e(s,null,{default:t(()=>[e(O,{color:"negative",label:"restore",onClick:c[0]||(c[0]=m=>{var i;return(i=p.value)==null?void 0:i.click()})}),Y("input",{ref_key:"fileInput",ref:p,accept:".json",type:"file",style:{display:"none"},onChange:y},null,544)]),_:1})]),_:1})],64))}}),ie=$(re,[["__file","/home/zowie/dev/pkstatus/src/pages/Settings/BackupSection.vue"]]),de={class:"col col-sm-6 col-md-4"},pe=D({__name:"SettingsPage",setup(x){const g=M(),{systemCache:v}=G(),h=N(),{detectPronouns:d,fronterUpdateInterval:p,showCardDetails:b,systemUpdateInterval:V,checkUpdates:_,lookup:U,token:y}=K(h),u=S(y.value),c=S(!1),m=S(!1),i=S(null);function P(){c.value=!0,i.value=null,m.value=!1,E()}const E=X(async()=>{if(!u.value)return c.value=!1,y.value="",g.notify({type:"positive",message:"Token Cleared"});try{c.value=!0,i.value=await v.fetchToken(u.value),g.notify({type:"positive",message:`Token Updated: ${i.value.getName(d.value)}`}),y.value=u.value}catch(Q){Q instanceof Z&&Q.status=="401"&&(m.value=!0,u.value=null)}c.value=!1},500),B=[{label:"10 Seconds",value:10},{label:"1 Minute",value:60},{label:"5 Minutes",value:300},{label:"1 Hour",value:3600},{label:"6 Hour",value:3600*6},{label:"1 Day",value:86400}];return(Q,o)=>(I(),T(le,{class:"row justify-evenly"},{default:t(()=>[Y("div",de,[e(oe,{icon:"settings",text:"Settings"}),e(ae,{class:"bg-lighten q-pb-sm"},{default:t(()=>[e(a,{header:""},{default:t(()=>[l("General Settings")]),_:1}),e(f,{tag:"label"},{default:t(()=>[e(s,null,{default:t(()=>[e(a,null,{default:t(()=>[l("PluralKit Token")]),_:1}),e(a,{caption:""},{default:t(()=>[l(" (optional) PluralKit token, only needed for the switching UI ")]),_:1}),e(ee,{modelValue:u.value,"onUpdate:modelValue":[o[0]||(o[0]=r=>u.value=r),P],modelModifiers:{trim:!0},type:"password",label:"Token","bottom-slots":"",clearable:"",loading:c.value,error:m.value,"error-message":"Invalid Token"},{prepend:t(()=>[i.value?(I(),T(se,{key:0,url:i.value.avatarUrl,name:i.value.getName(n(d))},null,8,["url","name"])):F("v-if",!0)]),_:1},8,["modelValue","loading","error"])]),_:1})]),_:1}),n(te)(n(g))?(I(),T(f,{key:0,tag:"label"},{default:t(()=>[e(s,null,{default:t(()=>[e(a,null,{default:t(()=>[l("Check for Updates")]),_:1}),e(a,{caption:""},{default:t(()=>[l(" Periodically check GitHub to see if there's a new version of PKStatus available ")]),_:1})]),_:1}),e(s,{avatar:""},{default:t(()=>[e(k,{modelValue:n(_),"onUpdate:modelValue":o[1]||(o[1]=r=>w(_)?_.value=r:null)},null,8,["modelValue"])]),_:1})]),_:1})):F("v-if",!0),e(C,{spaced:""}),e(a,{header:""},{default:t(()=>[l("Display Settings")]),_:1}),e(f,{tag:"label"},{default:t(()=>[e(s,null,{default:t(()=>[e(a,null,{default:t(()=>[l("Detect Pronouns")]),_:1}),e(a,{caption:""},{default:t(()=>[l("Detect pronouns in system and member names and remove them, also shows them in the pronoun field if no pronouns are set ")]),_:1})]),_:1}),e(s,{avatar:""},{default:t(()=>[e(k,{modelValue:n(d),"onUpdate:modelValue":o[2]||(o[2]=r=>w(d)?d.value=r:null)},null,8,["modelValue"])]),_:1})]),_:1}),e(f,{tag:"label"},{default:t(()=>[e(s,null,{default:t(()=>[e(a,null,{default:t(()=>[l("Show Card Details")]),_:1}),e(a,{caption:""},{default:t(()=>[l(" Show the table with system/member details on the popup info cards, or only name and description if disabled ")]),_:1})]),_:1}),e(s,{avatar:""},{default:t(()=>[e(k,{modelValue:n(b),"onUpdate:modelValue":o[3]||(o[3]=r=>w(b)?b.value=r:null)},null,8,["modelValue"])]),_:1})]),_:1}),e(f,{tag:"label"},{default:t(()=>[e(s,null,{default:t(()=>[e(a,null,{default:t(()=>[l("Show Color Accents")]),_:1}),e(a,{caption:""},{default:t(()=>[l(" Show color accents on member and system cards, and also in various member lists ")]),_:1})]),_:1}),e(s,{avatar:""},{default:t(()=>[e(k,{modelValue:n(U).colorAccent,"onUpdate:modelValue":o[4]||(o[4]=r=>n(U).colorAccent=r)},null,8,["modelValue"])]),_:1})]),_:1}),e(C,{spaced:""}),e(a,{header:""},{default:t(()=>[l("Update Settings")]),_:1}),e(f,null,{default:t(()=>[e(s,null,{default:t(()=>[e(J,{modelValue:n(V),"onUpdate:modelValue":o[5]||(o[5]=r=>w(V)?V.value=r:null),label:"System Update Interval",options:B,"emit-value":"","map-options":""},{prepend:t(()=>[e(R,{name:"schedule"})]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(f,null,{default:t(()=>[e(s,null,{default:t(()=>[e(J,{modelValue:n(p),"onUpdate:modelValue":o[6]||(o[6]=r=>w(p)?p.value=r:null),label:"Fronter Update Interval",options:B,"emit-value":"","map-options":""},{prepend:t(()=>[e(R,{name:"schedule"})]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(f,null,{default:t(()=>[e(a,{caption:""},{default:t(()=>[l(" These are minimums, PKStatus increases the interval dynamically if it would exceed the PluralKit API limits with your settings ")]),_:1})]),_:1}),e(C,{spaced:""}),e(ue),e(ie,{onRestore:o[7]||(o[7]=r=>{u.value=n(y),P()})})]),_:1})])]),_:1}))}}),Ve=$(pe,[["__file","/home/zowie/dev/pkstatus/src/pages/SettingsPage.vue"]]);export{Ve as default};