import{Q as b}from"./QBtnToggle-DwIJ51xg.js";import{Q as y,a as f}from"./QItem-DFQyp7xd.js";import{R as g,S as k,U as v,W as s,ap as a,Z as i,Y as n,a3 as p,a2 as w,a6 as V,a5 as l,$ as t,X as d,aU as h,at as L,ah as M}from"./index-B5cKJEsb.js";import{Q as _}from"./QList-CeI3M5mw.js";import{M as Q,a as S}from"./MemberList-B7iWJxKM.js";import"./QBtnGroup-BZaGG879.js";import"./QTable-CaejNunE.js";import"./QMarkupTable-BdHJVmiq.js";import"./QSelect-D38puw0H.js";import"./QMenu-BD1NPTJN.js";import"./format-CPyQx2aO.js";import"./rtl-DFPa-2ov.js";import"./InitialFallbackAvatar-DdQhVARR.js";import"./index-DhNyYKrN.js";import"./RelativeTimeDisplay-CTCOZZ8Y.js";const B={class:"row q-mt-lg bg-lighten"},C={key:0,class:"row"},q={class:"col self-center"},N={key:0},T={class:"col-auto"},P={key:1},U=g({__name:"MemberView",props:{system:{type:Object,required:!0},members:{type:Object,required:!0},dialog:{type:null,required:!0}},setup(j){const c=k(),{detectPronouns:u,lookup:o}=v(c);return(e,r)=>(s(),a("div",B,[i(_,{class:"col"},{default:n(()=>[i(y,{header:""},{default:n(()=>[e.members.allowed?(s(),a("div",C,[p("div",q,[w(" Members "),e.members.loading?l("v-if",!0):(s(),a("span",N,"("+V(e.members.list.length)+")",1))]),p("div",T,[i(b,{modelValue:t(o).memberLayout,"onUpdate:modelValue":r[0]||(r[0]=m=>t(o).memberLayout=m),dense:"",flat:"",options:[{value:"list",icon:"list"},{value:"table",icon:"table_chart"}]},null,8,["modelValue"])])])):(s(),a("div",P,"Member List Private"))]),_:1}),e.members.loading?(s(),d(f,{key:0},{default:n(()=>[i(h,{indeterminate:""})]),_:1})):e.members.allowed?(s(),a(L,{key:1},[t(o).memberLayout=="list"?(s(),d(Q,{key:0,members:e.members.list,system:e.system,"detect-pronouns":t(u),"color-accent":t(o).colorAccent,onMemberClick:r[1]||(r[1]=m=>e.dialog.show({system:e.system,member:m}))},null,8,["members","system","detect-pronouns","color-accent"])):l("v-if",!0),t(o).memberLayout=="table"?(s(),d(S,{key:1,members:e.members.list,system:e.system,"detect-pronouns":t(u),"color-accent":t(o).colorAccent,onMemberClick:r[2]||(r[2]=m=>e.dialog.show({system:e.system,member:m}))},null,8,["members","system","detect-pronouns","color-accent"])):l("v-if",!0)],64)):l("v-if",!0)]),_:1})]))}}),J=M(U,[["__file","/home/zowie/dev/pkstatus/src/pages/Lookup/System/View/MemberView.vue"]]);export{J as default};
