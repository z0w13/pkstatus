import{Q as st}from"./QPage-CQHXzn9r.js";import{Q as ot,a as ne}from"./QTabs-CVdLadnF.js";import{h as y,c as xe,g as Ve,n as rt,r as F,d as o,ai as ut,aj as se,o as it,k as dt,ak as ct,al as mt,y as vt,am as ft,an as pt,w as bt,ao as gt,R as Z,S as j,W as M,X as U,Y as a,Z as t,a2 as v,$ as u,a7 as E,a8 as L,ah as K,ap as $e,a3 as D,a1 as ye,a4 as _t,T as St,aq as Le,ar as Te,as as oe,U as ke,t as ht,L as yt,V as kt,a5 as Y,at as wt}from"./index-B5cKJEsb.js";import{Q as Ct}from"./QToolbar-DFKVFXad.js";import{Q as xt}from"./QFooter-CKyJ_gWF.js";import{a as _,b as d,Q as S}from"./QItem-DFQyp7xd.js";import{Q as we}from"./QBtnToggle-DwIJ51xg.js";import{T as Vt}from"./TouchPan-CYhrjwjg.js";import{b as A}from"./format-CPyQx2aO.js";import{Q as re}from"./QList-CeI3M5mw.js";import{Q as ue}from"./QBtnDropdown-CQxCzmzF.js";import"./QResizeObserver-UMyGe1MO.js";import"./rtl-DFPa-2ov.js";import"./QBtnGroup-BZaGG879.js";import"./QMenu-BD1NPTJN.js";const $t=y("div",{class:"q-space"}),Lt=xe({name:"QSpace",setup(){return()=>$t}}),Ce="q-slider__marker-labels",Tt=r=>({value:r}),Mt=({marker:r})=>y("div",{key:r.value,style:r.style,class:r.classes},r.label),Me=[34,37,40,33,39,38],It={...dt,...ct,min:{type:Number,default:0},max:{type:Number,default:100},innerMin:Number,innerMax:Number,step:{type:Number,default:1,validator:r=>r>=0},snap:Boolean,vertical:Boolean,reverse:Boolean,color:String,markerLabelsClass:String,label:Boolean,labelColor:String,labelTextColor:String,labelAlways:Boolean,switchLabelSide:Boolean,markers:[Boolean,Number],markerLabels:[Boolean,Array,Object,Function],switchMarkerLabelsSide:Boolean,trackImg:String,trackColor:String,innerTrackImg:String,innerTrackColor:String,selectionColor:String,selectionImg:String,thumbSize:{type:String,default:"20px"},trackSize:{type:String,default:"4px"},disable:Boolean,readonly:Boolean,dense:Boolean,tabindex:[String,Number],thumbColor:String,thumbPath:{type:String,default:"M 4, 10 a 6,6 0 1,0 12,0 a 6,6 0 1,0 -12,0"}},qt=["pan","update:modelValue","change"];function Ut({updateValue:r,updatePosition:s,getDragging:C,formAttrs:n}){const{props:e,emit:k,slots:$,proxy:{$q:b}}=Ve(),I=rt(e,b),Q=ft(n),w=F(!1),T=F(!1),x=F(!1),q=F(!1),V=o(()=>e.vertical===!0?"--v":"--h"),N=o(()=>"-"+(e.switchLabelSide===!0?"switched":"standard")),p=o(()=>e.vertical===!0?e.reverse===!0:e.reverse!==(b.lang.rtl===!0)),c=o(()=>isNaN(e.innerMin)===!0||e.innerMin<e.min?e.min:e.innerMin),z=o(()=>isNaN(e.innerMax)===!0||e.innerMax>e.max?e.max:e.innerMax),g=o(()=>e.disable!==!0&&e.readonly!==!0&&c.value<z.value),P=o(()=>{if(e.step===0)return i=>i;const l=(String(e.step).trim().split(".")[1]||"").length;return i=>parseFloat(i.toFixed(l))}),R=o(()=>e.step===0?1:e.step),Ie=o(()=>g.value===!0?e.tabindex||0:-1),O=o(()=>e.max-e.min),de=o(()=>z.value-c.value),W=o(()=>J(c.value)),G=o(()=>J(z.value)),X=o(()=>e.vertical===!0?p.value===!0?"bottom":"top":p.value===!0?"right":"left"),ce=o(()=>e.vertical===!0?"height":"width"),qe=o(()=>e.vertical===!0?"width":"height"),me=o(()=>e.vertical===!0?"vertical":"horizontal"),Ue=o(()=>{const l={role:"slider","aria-valuemin":c.value,"aria-valuemax":z.value,"aria-orientation":me.value,"data-step":e.step};return e.disable===!0?l["aria-disabled"]="true":e.readonly===!0&&(l["aria-readonly"]="true"),l}),ze=o(()=>`q-slider q-slider${V.value} q-slider--${w.value===!0?"":"in"}active inline no-wrap `+(e.vertical===!0?"row":"column")+(e.disable===!0?" disabled":" q-slider--enabled"+(g.value===!0?" q-slider--editable":""))+(x.value==="both"?" q-slider--focus":"")+(e.label||e.labelAlways===!0?" q-slider--label":"")+(e.labelAlways===!0?" q-slider--label-always":"")+(I.value===!0?" q-slider--dark":"")+(e.dense===!0?" q-slider--dense q-slider--dense"+V.value:""));function H(l){const i="q-slider__"+l;return`${i} ${i}${V.value} ${i}${V.value}${N.value}`}function ve(l){const i="q-slider__"+l;return`${i} ${i}${V.value}`}const Pe=o(()=>{const l=e.selectionColor||e.color;return"q-slider__selection absolute"+(l!==void 0?` text-${l}`:"")}),Be=o(()=>ve("markers")+" absolute overflow-hidden"),Qe=o(()=>ve("track-container")),Re=o(()=>H("pin")),Fe=o(()=>H("label")),Ne=o(()=>H("text-container")),De=o(()=>H("marker-labels-container")+(e.markerLabelsClass!==void 0?` ${e.markerLabelsClass}`:"")),Ae=o(()=>"q-slider__track relative-position no-outline"+(e.trackColor!==void 0?` bg-${e.trackColor}`:"")),Ee=o(()=>{const l={[qe.value]:e.trackSize};return e.trackImg!==void 0&&(l.backgroundImage=`url(${e.trackImg}) !important`),l}),je=o(()=>"q-slider__inner absolute"+(e.innerTrackColor!==void 0?` bg-${e.innerTrackColor}`:"")),fe=o(()=>{const l=G.value-W.value,i={[X.value]:`${100*W.value}%`,[ce.value]:l===0?"2px":`${100*l}%`};return e.innerTrackImg!==void 0&&(i.backgroundImage=`url(${e.innerTrackImg}) !important`),i});function Ke(l){const{min:i,max:m,step:f}=e;let h=i+l*(m-i);if(f>0){const B=(h-c.value)%f;h+=(Math.abs(B)>=f/2?(B<0?-1:1)*f:0)-B}return h=P.value(h),A(h,c.value,z.value)}function J(l){return O.value===0?0:(l-e.min)/O.value}function Oe(l,i){const m=mt(l),f=e.vertical===!0?A((m.top-i.top)/i.height,0,1):A((m.left-i.left)/i.width,0,1);return A(p.value===!0?1-f:f,W.value,G.value)}const pe=o(()=>ut(e.markers)===!0?e.markers:R.value),be=o(()=>{const l=[],i=pe.value,m=e.max;let f=e.min;do l.push(f),f+=i;while(f<m);return l.push(m),l}),ge=o(()=>{const l=` ${Ce}${V.value}-`;return Ce+`${l}${e.switchMarkerLabelsSide===!0?"switched":"standard"}${l}${p.value===!0?"rtl":"ltr"}`}),ee=o(()=>e.markerLabels===!1?null:Xe(e.markerLabels).map((l,i)=>({index:i,value:l.value,label:l.label||l.value,classes:ge.value+(l.classes!==void 0?" "+l.classes:""),style:{...Se(l.value),...l.style||{}}}))),_e=o(()=>({markerList:ee.value,markerMap:He.value,classes:ge.value,getStyle:Se})),We=o(()=>{const l=de.value===0?"2px":100*pe.value/de.value;return{...fe.value,backgroundSize:e.vertical===!0?`2px ${l}%`:`${l}% 2px`}});function Xe(l){if(l===!1)return null;if(l===!0)return be.value.map(Tt);if(typeof l=="function")return be.value.map(m=>{const f=l(m);return se(f)===!0?{...f,value:m}:{value:m,label:f}});const i=({value:m})=>m>=e.min&&m<=e.max;return Array.isArray(l)===!0?l.map(m=>se(m)===!0?m:{value:m}).filter(i):Object.keys(l).map(m=>{const f=l[m],h=Number(m);return se(f)===!0?{...f,value:h}:{value:h,label:f}}).filter(i)}function Se(l){return{[X.value]:`${100*(l-e.min)/O.value}%`}}const He=o(()=>{if(e.markerLabels===!1)return null;const l={};return ee.value.forEach(i=>{l[i.value]=i}),l});function Ye(){if($["marker-label-group"]!==void 0)return $["marker-label-group"](_e.value);const l=$["marker-label"]||Mt;return ee.value.map(i=>l({marker:i,..._e.value}))}const Ze=o(()=>[[Vt,Ge,void 0,{[me.value]:!0,prevent:!0,stop:!0,mouse:!0,mouseAllDir:!0}]]);function Ge(l){l.isFinal===!0?(q.value!==void 0&&(s(l.evt),l.touch===!0&&r(!0),q.value=void 0,k("pan","end")),w.value=!1,x.value=!1):l.isFirst===!0?(q.value=C(l.evt),s(l.evt),r(),w.value=!0,k("pan","start")):(s(l.evt),r())}function he(){x.value=!1}function Je(l){s(l,C(l)),r(),T.value=!0,w.value=!0,document.addEventListener("mouseup",te,!0)}function te(){T.value=!1,w.value=!1,r(!0),he(),document.removeEventListener("mouseup",te,!0)}function et(l){s(l,C(l)),r(!0)}function tt(l){Me.includes(l.keyCode)&&r(!0)}function lt(l){if(e.vertical===!0)return null;const i=b.lang.rtl!==e.reverse?1-l:l;return{transform:`translateX(calc(${2*i-1} * ${e.thumbSize} / 2 + ${50-100*i}%))`}}function at(l){const i=o(()=>T.value===!1&&(x.value===l.focusValue||x.value==="both")?" q-slider--focus":""),m=o(()=>`q-slider__thumb q-slider__thumb${V.value} q-slider__thumb${V.value}-${p.value===!0?"rtl":"ltr"} absolute non-selectable`+i.value+(l.thumbColor.value!==void 0?` text-${l.thumbColor.value}`:"")),f=o(()=>({width:e.thumbSize,height:e.thumbSize,[X.value]:`${100*l.ratio.value}%`,zIndex:x.value===l.focusValue?2:void 0})),h=o(()=>l.labelColor.value!==void 0?` text-${l.labelColor.value}`:""),B=o(()=>lt(l.ratio.value)),le=o(()=>"q-slider__text"+(l.labelTextColor.value!==void 0?` text-${l.labelTextColor.value}`:""));return()=>{const ae=[y("svg",{class:"q-slider__thumb-shape absolute-full",viewBox:"0 0 20 20","aria-hidden":"true"},[y("path",{d:e.thumbPath})]),y("div",{class:"q-slider__focus-ring fit"})];return(e.label===!0||e.labelAlways===!0)&&(ae.push(y("div",{class:Re.value+" absolute fit no-pointer-events"+h.value},[y("div",{class:Fe.value,style:{minWidth:e.thumbSize}},[y("div",{class:Ne.value,style:B.value},[y("span",{class:le.value},l.label.value)])])])),e.name!==void 0&&e.disable!==!0&&Q(ae,"push")),y("div",{class:m.value,style:f.value,...l.getNodeData()},ae)}}function nt(l,i,m,f){const h=[];e.innerTrackColor!=="transparent"&&h.push(y("div",{key:"inner",class:je.value,style:fe.value})),e.selectionColor!=="transparent"&&h.push(y("div",{key:"selection",class:Pe.value,style:l.value})),e.markers!==!1&&h.push(y("div",{key:"marker",class:Be.value,style:We.value})),f(h);const B=[vt("div",{key:"trackC",class:Qe.value,tabindex:i.value,...m.value},[y("div",{class:Ae.value,style:Ee.value},h)],"slide",g.value,()=>Ze.value)];if(e.markerLabels!==!1){const le=e.switchMarkerLabelsSide===!0?"unshift":"push";B[le](y("div",{key:"markerL",class:De.value},Ye()))}return B}return it(()=>{document.removeEventListener("mouseup",te,!0)}),{state:{active:w,focus:x,preventFocus:T,dragging:q,editable:g,classes:ze,tabindex:Ie,attributes:Ue,roundValueFn:P,keyStep:R,trackLen:O,innerMin:c,innerMinRatio:W,innerMax:z,innerMaxRatio:G,positionProp:X,sizeProp:ce,isReversed:p},methods:{onActivate:Je,onMobileClick:et,onBlur:he,onKeyup:tt,getContent:nt,getThumbRenderFn:at,convertRatioToModel:Ke,convertModelToRatio:J,getDraggingRatio:Oe}}}const zt=()=>({}),ie=xe({name:"QSlider",props:{...It,modelValue:{required:!0,default:null,validator:r=>typeof r=="number"||r===null},labelValue:[String,Number]},emits:qt,setup(r,{emit:s}){const{proxy:{$q:C}}=Ve(),{state:n,methods:e}=Ut({updateValue:V,updatePosition:p,getDragging:N,formAttrs:pt(r)}),k=F(null),$=F(0),b=F(0);function I(){b.value=r.modelValue===null?n.innerMin.value:A(r.modelValue,n.innerMin.value,n.innerMax.value)}bt(()=>`${r.modelValue}|${n.innerMin.value}|${n.innerMax.value}`,I),I();const Q=o(()=>e.convertModelToRatio(b.value)),w=o(()=>n.active.value===!0?$.value:Q.value),T=o(()=>{const g={[n.positionProp.value]:`${100*n.innerMinRatio.value}%`,[n.sizeProp.value]:`${100*(w.value-n.innerMinRatio.value)}%`};return r.selectionImg!==void 0&&(g.backgroundImage=`url(${r.selectionImg}) !important`),g}),x=e.getThumbRenderFn({focusValue:!0,getNodeData:zt,ratio:w,label:o(()=>r.labelValue!==void 0?r.labelValue:b.value),thumbColor:o(()=>r.thumbColor||r.color),labelColor:o(()=>r.labelColor),labelTextColor:o(()=>r.labelTextColor)}),q=o(()=>n.editable.value!==!0?{}:C.platform.is.mobile===!0?{onClick:e.onMobileClick}:{onMousedown:e.onActivate,onFocus:c,onBlur:e.onBlur,onKeydown:z,onKeyup:e.onKeyup});function V(g){b.value!==r.modelValue&&s("update:modelValue",b.value),g===!0&&s("change",b.value)}function N(){return k.value.getBoundingClientRect()}function p(g,P=n.dragging.value){const R=e.getDraggingRatio(g,P);b.value=e.convertRatioToModel(R),$.value=r.snap!==!0||r.step===0?R:e.convertModelToRatio(b.value)}function c(){n.focus.value=!0}function z(g){if(!Me.includes(g.keyCode))return;gt(g);const P=([34,33].includes(g.keyCode)?10:1)*n.keyStep.value,R=([34,37,40].includes(g.keyCode)?-1:1)*(n.isReversed.value===!0?-1:1)*(r.vertical===!0?-1:1)*P;b.value=A(n.roundValueFn.value(b.value+R),n.innerMin.value,n.innerMax.value),V()}return()=>{const g=e.getContent(T,n.tabindex,q,P=>{P.push(x())});return y("div",{ref:k,class:n.classes.value+(r.modelValue===null?" q-slider--no-value":""),...n.attributes.value,"aria-valuenow":r.modelValue},g)}}}),Pt=Z({__name:"TableSettings",setup(r){const s=j().status.table;return(C,n)=>(M(),U(ue,{icon:"settings",flat:""},{default:a(()=>[t(re,{bordered:"",class:"rounded-borders"},{default:a(()=>[t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,{overline:"",class:"q-mb-xs"},{default:a(()=>[v("Vertical Position")]),_:1}),t(we,{modelValue:u(s).verticalPosition,"onUpdate:modelValue":n[0]||(n[0]=e=>u(s).verticalPosition=e),color:"grey-9",options:[{label:"Top",value:"start"},{label:"Middle",value:"center"},{label:"Bottom",value:"end"}]},null,8,["modelValue"])]),_:1})]),_:1}),t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,{overline:"",class:"q-mb-xs"},{default:a(()=>[v("Horizontal Position")]),_:1}),t(we,{modelValue:u(s).horizontalPosition,"onUpdate:modelValue":n[1]||(n[1]=e=>u(s).horizontalPosition=e),color:"grey-9",options:[{label:"Left",value:"start"},{label:"Center",value:"center"},{label:"Right",value:"end"}]},null,8,["modelValue"])]),_:1})]),_:1}),t(E,{class:"q-mt-sm"}),t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Show Icons")]),_:1})]),_:1}),t(d,{side:""},{default:a(()=>[t(L,{modelValue:u(s).showIcons,"onUpdate:modelValue":n[2]||(n[2]=e=>u(s).showIcons=e)},null,8,["modelValue"])]),_:1})]),_:1}),t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Square Icons")]),_:1})]),_:1}),t(d,{side:""},{default:a(()=>[t(L,{modelValue:u(s).squareIcons,"onUpdate:modelValue":n[3]||(n[3]=e=>u(s).squareIcons=e)},null,8,["modelValue"])]),_:1})]),_:1}),t(E),t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Force Mobile UI")]),_:1})]),_:1}),t(d,{side:""},{default:a(()=>[t(L,{modelValue:u(s).forceMobileUi,"onUpdate:modelValue":n[4]||(n[4]=e=>u(s).forceMobileUi=e)},null,8,["modelValue"])]),_:1})]),_:1}),t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Show Update Time")]),_:1})]),_:1}),t(d,{side:""},{default:a(()=>[t(L,{modelValue:u(s).showUpdateTime,"onUpdate:modelValue":n[5]||(n[5]=e=>u(s).showUpdateTime=e)},null,8,["modelValue"])]),_:1})]),_:1}),t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Show Last Switch")]),_:1})]),_:1}),t(d,{side:""},{default:a(()=>[t(L,{modelValue:u(s).showLastSwitch,"onUpdate:modelValue":n[6]||(n[6]=e=>u(s).showLastSwitch=e)},null,8,["modelValue"])]),_:1})]),_:1}),t(E),t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Icon Size")]),_:1})]),_:1}),t(d,null,{default:a(()=>[t(ie,{modelValue:u(s).iconSize,"onUpdate:modelValue":n[7]||(n[7]=e=>u(s).iconSize=e),min:24,max:128,label:"","label-value":u(s).iconSize+"px"},null,8,["modelValue","label-value"])]),_:1})]),_:1})]),_:1})]),_:1}))}}),Bt=K(Pt,[["__file","/home/zowie/dev/pkstatus/src/components/StatusPage/Settings/TableSettings.vue"]]),Qt=Z({__name:"ListSettings",setup(r){const s=j().status.list;return(C,n)=>(M(),U(ue,{icon:"settings",flat:""},{default:a(()=>[t(re,{bordered:"",class:"rounded-borders"},{default:a(()=>[t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Show Update Time")]),_:1})]),_:1}),t(d,{side:""},{default:a(()=>[t(L,{modelValue:u(s).showUpdateTime,"onUpdate:modelValue":n[0]||(n[0]=e=>u(s).showUpdateTime=e)},null,8,["modelValue"])]),_:1})]),_:1}),t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Show Last Switch")]),_:1})]),_:1}),t(d,{side:""},{default:a(()=>[t(L,{modelValue:u(s).showLastSwitch,"onUpdate:modelValue":n[1]||(n[1]=e=>u(s).showLastSwitch=e)},null,8,["modelValue"])]),_:1})]),_:1}),t(E),t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Square Icons")]),_:1})]),_:1}),t(d,{side:""},{default:a(()=>[t(L,{modelValue:u(s).squareIcons,"onUpdate:modelValue":n[2]||(n[2]=e=>u(s).squareIcons=e)},null,8,["modelValue"])]),_:1})]),_:1}),t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Icon Size")]),_:1})]),_:1}),t(d,null,{default:a(()=>[t(ie,{modelValue:u(s).iconSize,"onUpdate:modelValue":n[3]||(n[3]=e=>u(s).iconSize=e),min:24,max:128,label:"","label-value":u(s).iconSize+"px"},null,8,["modelValue","label-value"])]),_:1})]),_:1})]),_:1})]),_:1}))}}),Rt=K(Qt,[["__file","/home/zowie/dev/pkstatus/src/components/StatusPage/Settings/ListSettings.vue"]]),Ft=Z({__name:"TileSettings",setup(r){const s=j().status.tile;return(C,n)=>(M(),U(ue,{icon:"settings",flat:""},{default:a(()=>[t(re,{bordered:"",class:"rounded-borders"},{default:a(()=>[t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Show Update Time")]),_:1})]),_:1}),t(d,{side:""},{default:a(()=>[t(L,{modelValue:u(s).showUpdateTime,"onUpdate:modelValue":n[0]||(n[0]=e=>u(s).showUpdateTime=e)},null,8,["modelValue"])]),_:1})]),_:1}),t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Show Last Switch")]),_:1})]),_:1}),t(d,{side:""},{default:a(()=>[t(L,{modelValue:u(s).showLastSwitch,"onUpdate:modelValue":n[1]||(n[1]=e=>u(s).showLastSwitch=e)},null,8,["modelValue"])]),_:1})]),_:1}),t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Show System Description")]),_:1})]),_:1}),t(d,{side:""},{default:a(()=>[t(L,{modelValue:u(s).showSystemDescription,"onUpdate:modelValue":n[2]||(n[2]=e=>u(s).showSystemDescription=e)},null,8,["modelValue"])]),_:1})]),_:1}),t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Show Fronter Description")]),_:1})]),_:1}),t(d,{side:""},{default:a(()=>[t(L,{modelValue:u(s).showFronterDescription,"onUpdate:modelValue":n[3]||(n[3]=e=>u(s).showFronterDescription=e)},null,8,["modelValue"])]),_:1})]),_:1}),t(E),t(_,null,{default:a(()=>[t(d,null,{default:a(()=>[t(S,null,{default:a(()=>[v("Panel Width")]),_:1})]),_:1}),t(d,null,{default:a(()=>[t(ie,{modelValue:u(s).tileSize,"onUpdate:modelValue":n[4]||(n[4]=e=>u(s).tileSize=e),min:100,max:500,label:"","label-value":u(s).tileSize+"px"},null,8,["modelValue","label-value"])]),_:1})]),_:1})]),_:1})]),_:1}))}}),Nt=K(Ft,[["__file","/home/zowie/dev/pkstatus/src/components/StatusPage/Settings/TileSettings.vue"]]),Dt={},At={class:"row justify-center",style:{"min-height":"inherit"}},Et={class:"col-md-4 col-sm-6 col self-center",style:{"line-height":"2em","font-size":"1.5em"}},jt=D("h3",{class:"text-center"},"Welcome to PKStatus",-1);function Kt(r,s){return M(),$e("div",At,[D("div",Et,[jt,v(" To get started you can: "),D("ul",null,[D("li",null,[v(" Track who of your friends is fronting by "),t(ye,{dense:"",color:"primary",icon:"add",to:"/manage/add"},{default:a(()=>[v("Adding A System")]),_:1})]),D("li",null,[v(" set up your token in the "),t(ye,{dense:"",color:"primary",icon:"settings",to:"/settings"},{default:a(()=>[v("Settings Page")]),_:1}),v(" if you wanna use the switcher ")]),D("li",null,[v(" Or access the menu using the "),t(_t,{name:"menu"}),v(" icon in the top left ")])])])])}const Ot=K(Dt,[["render",Kt],["__file","/home/zowie/dev/pkstatus/src/pages/status/InstructionsPage.vue"]]);function Wt(){let r=null,s="fronters";const C=St(),{fronterCache:n,systemCache:e}=Le(),k=Te(),$=j();function b(){r||(q(),r=setInterval(q,1e3))}function I(){r&&(clearInterval(r),r=null)}const Q=k.ids.length,w=Q/$.systemUpdateInterval+Q/$.fronterUpdateInterval,T=1.5,x=w>T?w/T:1;async function q(){var V,N;for(const p of k.ids)try{if(!e.has(p))return await e.fetch(p);if(!n.has(p))return await n.fetch(p)}catch(c){if(!(c instanceof oe))throw c;return C.notify({type:"negative",message:`Error updating fronters for '${((V=e.getCached(p))==null?void 0:V.name)||p}'`,caption:`${c.status}: ${c.message} (${c.code})`})}if(s=="fronters"){s="system";for(const p of k.getExpired($.systemUpdateInterval*x))try{return await k.update(p.id)}catch(c){if(!(c instanceof oe))throw c;return C.notify({type:"negative",message:`Error updating '${p.name}'`,caption:`${c.status}: ${c.message} (${c.code})`})}}else{s="fronters";for(const p of k.getExpiredFronters($.fronterUpdateInterval*x))try{return await n.fetch(p.system)}catch(c){if(!(c instanceof oe))throw c;return C.notify({type:"negative",message:`Error updating fronters for '${((N=e.getCached(p.system))==null?void 0:N.name)||p.system}'`,caption:`${c.status}: ${c.message} (${c.code})`})}}}return{start:b,stop:I}}const Xt=Z({__name:"StatusPage",setup(r){const{fronterCache:s,systemCache:C}=Le(),n=Te(),{status:e}=ke(j()),{ids:k}=ke(n),$=s.objects,b=C.objects,I=Wt();return ht(I.start),yt(I.stop),(Q,w)=>{const T=kt("router-view");return M(),$e(wt,null,[t(st,null,{default:a(()=>[u(k).length?(M(),U(T,{key:0,ids:u(k),systems:u(b),fronters:u($)},null,8,["ids","systems","fronters"])):(M(),U(Ot,{key:1}))]),_:1}),u(k).length?(M(),U(xt,{key:0},{default:a(()=>[t(Ct,null,{default:a(()=>[t(ot,{modelValue:u(e).lastLayout,"onUpdate:modelValue":w[0]||(w[0]=x=>u(e).lastLayout=x),align:"left",class:"bg-primary"},{default:a(()=>[t(ne,{to:"/status/table",name:"table",color:"primary",icon:"table_chart"}),t(ne,{to:"/status/list",name:"list",color:"primary",icon:"view_list"}),t(ne,{to:"/status/tile",name:"tile",color:"primary",icon:"grid_view"})]),_:1},8,["modelValue"]),t(Lt),u(e).lastLayout=="table"?(M(),U(Bt,{key:0})):Y("v-if",!0),u(e).lastLayout=="list"?(M(),U(Rt,{key:1})):Y("v-if",!0),u(e).lastLayout=="tile"?(M(),U(Nt,{key:2})):Y("v-if",!0)]),_:1})]),_:1})):Y("v-if",!0)],64)}}}),dl=K(Xt,[["__file","/home/zowie/dev/pkstatus/src/pages/StatusPage.vue"]]);export{dl as default};
