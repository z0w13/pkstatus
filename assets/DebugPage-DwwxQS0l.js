import{ds as g,dt as m,R as f,T as _,U as h,dz as b,d as y,d1 as v,ae as T,W as x,X as w,Y as c,a3 as o,Z as l,a1 as P,a6 as d,$ as C,ah as k}from"./index-BqqRy0Uq.js";import{Q as q}from"./QPage-CwiGpx-a.js";import{P as I}from"./PageTitle-CMkI-VXL.js";function L(a){const e=document.createElement("textarea");e.value=a,e.contentEditable="true",e.style.position="fixed";const t=()=>{};g(t),document.body.appendChild(e),e.focus(),e.select();const s=document.execCommand("copy");return e.remove(),m(t),s}function $(a){return navigator.clipboard!==void 0?navigator.clipboard.writeText(a):new Promise((e,t)=>{const s=L(a);s?e(!0):t(s)})}const A={class:"col"},D={class:"row justify-center"},j={class:"col q-mx-lg"},N=o("h3",{class:"q-my-md"},"Troubleshooting Info",-1),O={class:"bg-lighten q-pa-md"},Q={class:"row justify-center"},R={class:"col q-mx-lg"},Y=o("h3",{class:"q-my-md"},"Application Logs",-1),B={class:"bg-lighten q-pa-md"},S=f({__name:"DebugPage",setup(a){const e=_(),{lines:t}=h(b()),s=y(()=>t.value.toReversed().map(n=>`${v(n.time).format("YYYY-MM-DD HH:mm:ss")} | ${u(n.message)}`).join(`
`)),i=`
App: ${T()}
Quasar: v${e.version}
Platform: ${JSON.stringify(e.platform.is,null,2)}
`.trim();function u(n){const r=/[\w+/]{64}/g;return n.replaceAll(r,"****PLURALKIT_API_TOKEN****")}async function p(){e.dialog({title:"Warning!",color:"warning",message:"The troubleshooting information may contain sensitive information, we did our best to strip things out, but please double check before pasting this anywhere, <strong>especially for API tokens</strong>",html:!0,cancel:!0,persistent:!0}).onOk(async()=>{await $(`==== INFO ====

`+i+`

==== LOGS ====

`+s.value),e.notify({message:"Log Copied"})})}return(n,r)=>(x(),w(q,{class:"row justify-evenly"},{default:c(()=>[o("div",A,[l(I,{icon:"bug_report",text:"Troubleshooting Page"},{after:c(()=>[l(P,{"aria-label":"Copy Info To Clipboard",flat:"",icon:"content_copy",onClick:p})]),_:1}),o("div",D,[o("div",j,[N,o("pre",O,d(C(i)),1)])]),o("div",Q,[o("div",R,[Y,o("pre",B,d(s.value),1)])])])]),_:1}))}}),M=k(S,[["__file","/home/zowie/dev/pkstatus/src/pages/DebugPage.vue"]]);export{M as default};
