import{g as m,i as $,f as c,d as r,l as b,e as k,h as v,c as S}from"./index-B5cKJEsb.js";const P={position:{type:String,default:"bottom-right",validator:e=>["top-right","top-left","bottom-right","bottom-left","top","right","bottom","left"].includes(e)},offset:{type:Array,validator:e=>e.length===2},expand:Boolean};function Q(){const{props:e,proxy:{$q:i}}=m(),o=$(b,c);if(o===c)return console.error("QPageSticky needs to be child of QLayout"),c;const d=r(()=>{const t=e.position;return{top:t.indexOf("top")!==-1,right:t.indexOf("right")!==-1,bottom:t.indexOf("bottom")!==-1,left:t.indexOf("left")!==-1,vertical:t==="top"||t==="bottom",horizontal:t==="left"||t==="right"}}),l=r(()=>o.header.offset),f=r(()=>o.right.offset),u=r(()=>o.footer.offset),p=r(()=>o.left.offset),x=r(()=>{let t=0,n=0;const a=d.value,g=i.lang.rtl===!0?-1:1;a.top===!0&&l.value!==0?n=`${l.value}px`:a.bottom===!0&&u.value!==0&&(n=`${-u.value}px`),a.left===!0&&p.value!==0?t=`${g*p.value}px`:a.right===!0&&f.value!==0&&(t=`${-g*f.value}px`);const s={transform:`translate(${t}, ${n})`};return e.offset&&(s.margin=`${e.offset[1]}px ${e.offset[0]}px`),a.vertical===!0?(p.value!==0&&(s[i.lang.rtl===!0?"right":"left"]=`${p.value}px`),f.value!==0&&(s[i.lang.rtl===!0?"left":"right"]=`${f.value}px`)):a.horizontal===!0&&(l.value!==0&&(s.top=`${l.value}px`),u.value!==0&&(s.bottom=`${u.value}px`)),s}),h=r(()=>`q-page-sticky row flex-center fixed-${e.position} q-page-sticky--${e.expand===!0?"expand":"shrink"}`);function y(t){const n=k(t.default);return v("div",{class:h.value,style:x.value},e.expand===!0?n:[v("div",n)])}return{$layout:o,getStickyContent:y}}const O=S({name:"QPageSticky",props:P,setup(e,{slots:i}){const{getStickyContent:o}=Q();return()=>o(i)}});export{O as Q};
