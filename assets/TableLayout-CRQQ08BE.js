import{b as C,Q as v,a as I}from"./QItem-DFQyp7xd.js";import{h as f,c as V,aF as j,aG as O,R as D,W as e,ap as a,Z as u,Y as c,X as d,aE as G,a5 as l,a2 as L,a6 as M,ah as P,T as H,S as W,U as X,aq as Y,d as b,r as Z,a3 as m,_ as Q,$ as t,at as p,aB as q,aD as T}from"./index-B5cKJEsb.js";import{Q as J}from"./QMarkupTable-BdHJVmiq.js";import{D as K}from"./DescriptionDialog-ClBvxs1u.js";import{R as z}from"./RelativeTimeDisplay-CTCOZZ8Y.js";import{I as x}from"./InitialFallbackAvatar-DdQhVARR.js";import"./MemberCard-D-huDLNl.js";import"./index-DhNyYKrN.js";const ee=[f("circle",{cx:"15",cy:"15",r:"15"},[f("animate",{attributeName:"r",from:"15",to:"15",begin:"0s",dur:"0.8s",values:"15;9;15",calcMode:"linear",repeatCount:"indefinite"}),f("animate",{attributeName:"fill-opacity",from:"1",to:"1",begin:"0s",dur:"0.8s",values:"1;.5;1",calcMode:"linear",repeatCount:"indefinite"})]),f("circle",{cx:"60",cy:"15",r:"9","fill-opacity":".3"},[f("animate",{attributeName:"r",from:"9",to:"9",begin:"0s",dur:"0.8s",values:"9;15;9",calcMode:"linear",repeatCount:"indefinite"}),f("animate",{attributeName:"fill-opacity",from:".5",to:".5",begin:"0s",dur:"0.8s",values:".5;1;.5",calcMode:"linear",repeatCount:"indefinite"})]),f("circle",{cx:"105",cy:"15",r:"15"},[f("animate",{attributeName:"r",from:"15",to:"15",begin:"0s",dur:"0.8s",values:"15;9;15",calcMode:"linear",repeatCount:"indefinite"}),f("animate",{attributeName:"fill-opacity",from:"1",to:"1",begin:"0s",dur:"0.8s",values:"1;.5;1",calcMode:"linear",repeatCount:"indefinite"})])],B=V({name:"QSpinnerDots",props:j,setup(k){const{cSize:n,classes:g}=O(k);return()=>f("svg",{class:g.value,fill:"currentColor",width:n.value,height:n.value,viewBox:"0 0 120 30",xmlns:"http://www.w3.org/2000/svg"},ee)}}),te=D({__name:"TableEntity",props:{showIcon:{type:Boolean,required:!1,default:!0},label:{type:String,required:!0},caption:{type:[String,null],required:!1,default:null},icon:{type:[String,null],required:!1,default:null},color:{type:String,required:!1,default:"primary"},img:{type:[String,null],required:!1,default:null},size:{type:String,required:!0},square:{type:Boolean,required:!1,default:!1}},setup(k){return(n,g)=>(e(),a("div",null,[u(I,{dense:"",class:"q-pa-none"},{default:c(()=>[n.showIcon?(e(),d(C,{key:0,avatar:"",class:"col-auto q-pr-sm"},{default:c(()=>[n.icon?(e(),d(G,{key:1,color:n.color,icon:n.icon,size:n.size,square:n.square},null,8,["color","icon","size","square"])):(e(),d(x,{key:0,name:n.label,url:n.img,size:n.size,square:n.square,color:n.color},null,8,["name","url","size","square","color"]))]),_:1})):l("v-if",!0),u(C,{class:"col-auto"},{default:c(()=>[u(v,null,{default:c(()=>[L(M(n.label),1)]),_:1}),n.caption?(e(),d(v,{key:0,caption:""},{default:c(()=>[L(M(n.caption),1)]),_:1})):l("v-if",!0)]),_:1})]),_:1})]))}}),_=P(te,[["__file","/home/zowie/dev/pkstatus/src/pages/status/Table/TableEntity.vue"]]),se=["colspan"],ae={key:0,align:"left"},oe={key:0,align:"left"},le={key:1,align:"left"},ie={key:0,valign:"top"},ne={key:1,valign:"middle"},re={key:0,valign:"top",style:{"padding-bottom":"0"}},ue=["colspan"],ce=["colspan"],pe={valign:"middle"},de={key:4},fe={key:0,valign:"top"},me={key:0,valign:"top"},he={key:1,valign:"top"},ye=D({__name:"TableLayout",props:{ids:{type:Array,required:!0},fronters:{type:Object,required:!0},systems:{type:Object,required:!0}},setup(k){const n=H(),g=W(),{detectPronouns:y}=X(g),s=g.status.table,{fronterCache:A}=Y(),h=b(()=>n.screen.lt.sm||s.forceMobileUi),S=Z(),E=k,w=b(()=>Math.max(...A.getMultiCached(E.ids).map(o=>o.members.length))),F=b(()=>"line-height: "+(s.showIcons&&s.iconSize>34?`${s.iconSize}px`:"2.4em")),U=b(()=>s.showIcons?`padding-left: ${24+s.iconSize}px`:"");return(o,ve)=>(e(),a(p,null,[m("div",{class:Q(["row",`justify-${t(s).horizontalPosition}`]),style:{"min-height":"inherit"}},[m("div",{class:Q(["col","col-lg-auto",`self-${t(s).verticalPosition}`])},[u(J,{flat:t(n).dark.isActive},{default:c(()=>[m("thead",null,[m("tr",null,[m("th",{align:"left",style:q(U.value)},"System",4),m("th",{colspan:h.value?1:w.value+1,style:q(`width: ${h.value?"auto":"100%"}; ${U.value}`),align:"left"}," Fronters ",12,se),h.value?(e(),a(p,{key:0},[t(s).showLastSwitch||t(s).showUpdateTime?(e(),a("th",ae,[u(I,{dense:"",class:"q-pa-none"},{default:c(()=>[u(C,{class:"col-auto"},{default:c(()=>[t(s).showLastSwitch?(e(),d(v,{key:0},{default:c(()=>[L(" Last Switch ")]),_:1})):l("v-if",!0),t(s).showUpdateTime?(e(),d(v,{key:1,caption:t(s).showLastSwitch},{default:c(()=>[L(" Last Update ")]),_:1},8,["caption"])):l("v-if",!0)]),_:1})]),_:1})])):l("v-if",!0)],64)):(e(),a(p,{key:1},[t(s).showLastSwitch?(e(),a("th",oe,"Last Switch")):l("v-if",!0),t(s).showUpdateTime?(e(),a("th",le,"Last Updated")):l("v-if",!0)],64))])]),m("tbody",null,[(e(!0),a(p,null,T(o.ids,i=>{var N,$;return e(),a("tr",{key:i,style:q(F.value)},[o.systems[i]?(e(),a("td",ie,[u(_,{img:o.systems[i].avatarUrl,size:t(s).iconSize+"px",label:o.systems[i].getName(t(y)),caption:o.systems[i].getPronouns(t(y)),square:t(s).squareIcons,"show-icon":t(s).showIcons,onClick:r=>S.value.show({system:o.systems[i]})},null,8,["img","size","label","caption","square","show-icon","onClick"])])):(e(),a("td",ne,[u(B,{size:"24px"})])),o.fronters[i]?(e(),a(p,{key:2},[o.fronters[i].allowed?(e(),a(p,{key:0},[h.value?(e(),a("td",re,[(e(!0),a(p,null,T(o.fronters[i].members,r=>(e(),d(_,{key:r.id,img:r.avatarUrl,size:t(s).iconSize+"px",label:r.getName(t(y)),caption:r.getPronouns(t(y)),class:"q-mb-sm",square:t(s).squareIcons,"show-icon":t(s).showIcons,onClick:R=>S.value.show({member:r,system:o.systems[i]})},null,8,["img","size","label","caption","square","show-icon","onClick"]))),128))])):(e(),a(p,{key:1},[(e(!0),a(p,null,T(o.fronters[i].members,r=>(e(),a("td",{key:r.id,valign:"top",style:{width:"1%"}},[u(_,{img:r.avatarUrl,size:t(s).iconSize+"px",label:r.getName(t(y)),caption:r.getPronouns(t(y)),square:t(s).squareIcons,"show-icon":t(s).showIcons,onClick:R=>S.value.show({member:r,system:o.systems[i]})},null,8,["img","size","label","caption","square","show-icon","onClick"])]))),128)),w.value-(o.fronters[i].members.length||0)>0?(e(),a("td",{key:0,colspan:w.value-(o.fronters[i].members.length||0)},null,8,ue)):l("v-if",!0)],64))],64)):(e(),a(p,{key:1},[l(" No Access "),m("td",null,[u(_,{label:"No Access",size:t(s).iconSize+"px",icon:"close",color:"red",square:t(s).squareIcons},null,8,["size","square"])]),w.value>1&&!h.value?(e(),a("td",{key:0,colspan:w.value-1},null,8,ce)):l("v-if",!0)],64))],64)):(e(),a(p,{key:3},[l(" Loading "),m("td",pe,[u(B,{size:"24px"})])],2112)),l(" Spacer "),h.value?l("v-if",!0):(e(),a("td",de)),l(" Last Switch/Updated "),h.value?(e(),a(p,{key:5},[t(s).showLastSwitch||t(s).showUpdateTime?(e(),a("td",fe,[u(I,{dense:"",class:"q-pa-none",style:q(`min-height: ${t(s).iconSize}px`)},{default:c(()=>[u(C,{class:"col-auto"},{default:c(()=>[t(s).showLastSwitch?(e(),d(v,{key:0},{default:c(()=>{var r;return[o.fronters[i]?(e(),d(z,{key:0,time:(r=o.fronters[i])==null?void 0:r.lastSwitch},null,8,["time"])):l("v-if",!0)]}),_:2},1024)):l("v-if",!0),t(s).showUpdateTime?(e(),d(v,{key:1,caption:t(s).showLastSwitch},{default:c(()=>{var r;return[o.fronters[i]?(e(),d(z,{key:0,time:(r=o.fronters[i])==null?void 0:r.lastUpdated},null,8,["time"])):l("v-if",!0)]}),_:2},1032,["caption"])):l("v-if",!0)]),_:2},1024)]),_:2},1032,["style"])])):l("v-if",!0)],64)):(e(),a(p,{key:6},[t(s).showLastSwitch?(e(),a("td",me,[o.fronters[i]?(e(),d(z,{key:0,time:(N=o.fronters[i])==null?void 0:N.lastSwitch},null,8,["time"])):l("v-if",!0)])):l("v-if",!0),t(s).showUpdateTime?(e(),a("td",he,[o.fronters[i]?(e(),d(z,{key:0,time:($=o.fronters[i])==null?void 0:$.lastUpdated},null,8,["time"])):l("v-if",!0)])):l("v-if",!0)],64))],4)}),128))])]),_:1},8,["flat"])],2)],2),u(K,{ref_key:"dialog",ref:S},null,512)],64))}}),Ce=P(ye,[["__file","/home/zowie/dev/pkstatus/src/pages/status/TableLayout.vue"]]);export{Ce as default};
