import{Q as g}from"./QBtnToggle-DwIJ51xg.js";import{R as b,aR as y,aS as k,S as w,U as S,r as n,t as V,w as x,V as I,W as M,X as P,Y as Q,a3 as e,Z as s,aT as q,$ as t,aM as B,a1 as L,_ as R,ah as T}from"./index-B5cKJEsb.js";import{Q as C}from"./QPage-CQHXzn9r.js";import{P as $}from"./PageTitle-DsxZJMWH.js";import"./QBtnGroup-BZaGG879.js";const U={class:"bg-lighten q-pa-md"},W={class:"row q-ma-sm"},z={class:"col"},N={class:"row q-ma-sm"},j={class:"col"},D={class:"col-auto q-ml-md self-center"},E={class:"row q-mt-lg"},G={class:"col"},X=b({__name:"IndexPage",setup(Y){const _=y(),a=k(),v=w(),{lookup:c}=S(v),l=n("system"),o=n(""),i=n();V(()=>{x(()=>a.name,m=>m=="lookup"&&i.value.focus(),{immediate:!0})});async function f(){_.push({path:`/lookup/${l.value}/${o.value}`}),o.value=""}return(m,r)=>{const h=I("router-view");return M(),P(C,{class:"row justify-evenly"},{default:Q(()=>{var d,p;return[e("div",{class:R({col:!0,"col-sm-6 col-xs-12":t(c).memberLayout=="list"||!((d=t(a).name)!=null&&d.toString().startsWith("lookup-system")),"col-md-8 col-lg-6":t(c).memberLayout=="table"&&((p=t(a).name)==null?void 0:p.toString().startsWith("lookup-system"))})},[s($,{icon:"search",text:"Lookup System/Member"}),e("div",U,[e("form",{onSubmit:q(f,["prevent"])},[e("div",W,[e("div",z,[s(g,{modelValue:l.value,"onUpdate:modelValue":r[0]||(r[0]=u=>l.value=u),color:"black",options:[{label:"System",value:"system"},{label:"Member",value:"member"},{label:"Group",value:"group"}]},null,8,["modelValue"])])]),e("div",N,[e("div",j,[s(B,{ref_key:"searchInput",ref:i,modelValue:o.value,"onUpdate:modelValue":r[1]||(r[1]=u=>o.value=u),modelModifiers:{trim:!0},filled:"",autofocus:t(a).name=="lookup",label:`Enter ${l.value} ID`},null,8,["modelValue","autofocus","label"])]),e("div",D,[s(L,{round:"",disabled:o.value.length<5,color:"primary",icon:"search",type:"submit"},null,8,["disabled"])])])],32)]),e("div",E,[e("div",G,[s(h)])])],2)]}),_:1})}}}),K=T(X,[["__file","/home/zowie/dev/pkstatus/src/pages/Lookup/IndexPage.vue"]]);export{K as default};