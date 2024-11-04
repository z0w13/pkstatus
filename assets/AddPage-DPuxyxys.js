import{c as E,g as I,r as b,A as R,b1 as $,b2 as M,t as D,h as T,e as j,da as L,ao as A,v as z,db as K,dc as N,R as O,T as U,aR as G,ar as J,aq as W,aJ as X,b5 as Q,w as Y,W as k,X as q,Y as v,Z as u,ac as V,aM as Z,$ as H,a5 as ee,a1 as F,ah as te}from"./index-B5cKJEsb.js";import{Q as B}from"./QPageSticky-C0FhqazD.js";import{Q as ae}from"./QPage-CQHXzn9r.js";import{m as oe}from"./index-DhNyYKrN.js";import{L as se}from"./LabeledTile-bczxvMPj.js";import{P as ne}from"./PageTitle-DsxZJMWH.js";const re=E({name:"QForm",props:{autofocus:Boolean,noErrorFocus:Boolean,noResetFocus:Boolean,greedy:Boolean,onSubmit:Function},emits:["reset","validationSuccess","validationError"],setup(l,{slots:S,emit:p}){const x=I(),i=b(null);let o=0;const a=[];function c(e){const d=typeof e=="boolean"?e:l.noErrorFocus!==!0,h=++o,_=(t,n)=>{p(`validation${t===!0?"Success":"Error"}`,n)},C=t=>{const n=t.validate();return typeof n.then=="function"?n.then(r=>({valid:r,comp:t}),r=>({valid:!1,comp:t,err:r})):Promise.resolve({valid:n,comp:t})};return(l.greedy===!0?Promise.all(a.map(C)).then(t=>t.filter(n=>n.valid!==!0)):a.reduce((t,n)=>t.then(()=>C(n).then(r=>{if(r.valid===!1)return Promise.reject(r)})),Promise.resolve()).catch(t=>[t])).then(t=>{if(t===void 0||t.length===0)return h===o&&_(!0),!0;if(h===o){const{comp:n,err:r}=t[0];if(r!==void 0&&console.error(r),_(!1,n),d===!0){const P=t.find(({comp:w})=>typeof w.focus=="function"&&L(w.$)===!1);P!==void 0&&P.comp.focus()}}return!1})}function f(){o++,a.forEach(e=>{typeof e.resetValidation=="function"&&e.resetValidation()})}function y(e){e!==void 0&&A(e);const d=o+1;c().then(h=>{d===o&&h===!0&&(l.onSubmit!==void 0?p("submit",e):e!==void 0&&e.target!==void 0&&typeof e.target.submit=="function"&&e.target.submit())})}function g(e){e!==void 0&&A(e),p("reset"),z(()=>{f(),l.autofocus===!0&&l.noResetFocus!==!0&&s()})}function s(){K(()=>{if(i.value===null)return;const e=i.value.querySelector("[autofocus][tabindex], [data-autofocus][tabindex]")||i.value.querySelector("[autofocus] [tabindex], [data-autofocus] [tabindex]")||i.value.querySelector("[autofocus], [data-autofocus]")||Array.prototype.find.call(i.value.querySelectorAll("[tabindex]"),d=>d.tabIndex!==-1);e!=null&&e.focus({preventScroll:!0})})}R(N,{bindComponent(e){a.push(e)},unbindComponent(e){const d=a.indexOf(e);d!==-1&&a.splice(d,1)}});let m=!1;return $(()=>{m=!0}),M(()=>{m===!0&&l.autofocus===!0&&s()}),D(()=>{l.autofocus===!0&&s()}),Object.assign(x.proxy,{validate:c,resetValidation:f,submit:y,reset:g,focus:s,getValidationComponents:()=>a}),()=>T("form",{class:"q-form",ref:i,onSubmit:y,onReset:g},j(S.default))}}),ue=O({__name:"AddPage",setup(l){const S=U(),p=G(),x=J(),{pluralKit:i}=W(),o=b(""),a=b(null),c=b(""),f=b(!1),y=X(async function(s){try{a.value=await i.getSystem(s)}catch(m){if(Q(m)){c.value=`Couldn't find system ${s}`;return}}finally{f.value=!1}},500);Y(o,()=>{if(a.value=null,c.value="",o.value==""){y.cancel(),f.value=!1;return}f.value=!0,y(o.value)});async function g(){try{await x.add(o.value)}catch(s){if(Q(s)){c.value=`Couldn't find system ${o.value}`;return}throw s}S.notify("System Added"),p.push({path:"/manage"})}return(s,m)=>(k(),q(ae,{class:"row justify-evenly"},{default:v(()=>[u(re,{class:"col col-sm-6 col-md-4",filled:"",onSubmit:g},{default:v(()=>[u(ne,{icon:"group_add",text:"Add System"}),u(V,{class:"q-pt-none"},{default:v(()=>[u(Z,{modelValue:o.value,"onUpdate:modelValue":m[0]||(m[0]=e=>o.value=e),modelModifiers:{trim:!0},filled:"",autofocus:"",label:"System or Discord ID *",loading:f.value,"bottom-slots":"",error:!!c.value,"error-message":c.value},null,8,["modelValue","loading","error","error-message"])]),_:1}),a.value?(k(),q(V,{key:0,class:"q-py-none"},{default:v(()=>[u(se,{label:a.value.name||"",caption:a.value.pronouns,img:a.value.avatarUrl,"fallback-icon":H(oe),size:"100%"},null,8,["label","caption","img","fallback-icon"])]),_:1})):ee("v-if",!0),u(B,{position:"bottom-left",offset:[18,18]},{default:v(()=>[u(F,{fab:"",class:"self-end",icon:"arrow_back",color:"primary",to:"/manage"})]),_:1}),u(B,{position:"bottom-right",offset:[18,18]},{default:v(()=>[u(F,{fab:"",class:"self-end",icon:"save",color:"primary",type:"submit",disable:!a.value},null,8,["disable"])]),_:1})]),_:1})]),_:1}))}}),pe=te(ue,[["__file","/home/zowie/dev/pkstatus/src/pages/Manage/AddPage.vue"]]);export{pe as default};
