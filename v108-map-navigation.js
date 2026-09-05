/* Yurdunu Bil 108 — map navigation hardening. Keeps map hidden until requested. */
(()=>{'use strict';if(window.__YB108_MAP_NAV__)return;window.__YB108_MAP_NAV__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function setMapActive(on){const nav=$('#yb98-mobile-nav');if(!nav)return;$$('[data-mobile-view]',nav).forEach(b=>b.classList.toggle('active',on&&b.dataset.mobileView==='map'));if(on){nav.classList.add('yb-map-open');}else nav.classList.remove('yb-map-open')}
function closeMap(){const m=$('.yb99-map-modal');if(m)m.remove();setMapActive(false);document.body.classList.remove('yb-map-open')}
function openMap(){setMapActive(true);document.body.classList.add('yb-map-open');if(window.YBMapGames?.open){window.YBMapGames.open();return}if(window.__YB_MAP_LOADING__)return;window.__YB_MAP_LOADING__=true;const s=document.createElement('script');s.src='v99-map-games.js?v=99.1.0';s.onload=()=>{window.__YB_MAP_LOADING__=false;window.YBMapGames?.open?.()};s.onerror=()=>{window.__YB_MAP_LOADING__=false;setMapActive(false);document.body.classList.remove('yb-map-open')};document.body.appendChild(s)}
function patchMapModal(){const m=$('.yb99-map-modal');if(!m)return;m.classList.add('yb108-map-modal');const close=m.querySelector('.yb99-map-close');if(close&&!close.dataset.yb108){close.dataset.yb108='1';close.addEventListener('click',()=>{setMapActive(false);document.body.classList.remove('yb-map-open')},{capture:true})}}
function style(){if($('#yb108-style'))return;const s=document.createElement('style');s.id='yb108-style';s.textContent=`
.yb99-map-modal.yb108-map-modal{z-index:10050;background:rgba(2,10,7,.86);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.yb99-map-modal.yb108-map-modal .yb99-map-panel{background:linear-gradient(145deg,#0b2b1d,#071a12);border-color:rgba(91,211,151,.24);color:#eef8f1}
.yb99-map-modal.yb108-map-modal .yb99-map-gamebar button{border-color:rgba(91,211,151,.16);background:rgba(91,211,151,.06);color:#dcefe5}
.yb99-map-modal.yb108-map-modal .yb99-map-gamebar button.active{background:rgba(91,211,151,.16);border-color:rgba(91,211,151,.38);color:#8ff0bd}
.yb99-map-modal.yb108-map-modal .yb99-map-stage{background:radial-gradient(circle at 48% 40%,rgba(72,190,126,.11),transparent 52%),rgba(2,12,8,.52);border-color:rgba(91,211,151,.1)}
.yb99-map-modal.yb108-map-modal .yb99-province{fill:rgba(63,150,104,.42);stroke:rgba(174,226,196,.5)}
.yb99-map-modal.yb108-map-modal .yb99-province:hover{fill:rgba(75,207,139,.68);stroke:#a9f2c8}
.yb99-map-modal.yb108-map-modal .yb99-map-score{color:#72e7ac}
.yb99-map-modal.yb108-map-modal .yb99-map-head p,.yb99-map-modal.yb108-map-modal .yb99-map-status small{color:#91ada0}
@media(max-width:760px){body.yb-map-open{overflow:hidden!important}#yb98-mobile-nav.yb-map-open{opacity:.72}.yb99-map-modal.yb108-map-modal{padding:8px}.yb99-map-modal.yb108-map-modal .yb99-map-panel{width:100%;max-height:calc(100dvh - 16px);border-radius:20px}.yb99-map-modal.yb108-map-modal .yb99-map-gamebar{display:grid;grid-template-columns:1fr 1fr;gap:7px}.yb99-map-modal.yb108-map-modal .yb99-map-gamebar button{min-height:42px}.yb99-map-modal.yb108-map-modal .yb99-map-stage{min-height:300px;margin:0 10px 12px}.yb99-map-modal.yb108-map-modal .yb99-svg{height:330px}}
`;document.head.appendChild(s)}
function bind(){style();document.addEventListener('click',e=>{const b=e.target.closest('[data-mobile-view="map"]');if(b){e.preventDefault();e.stopImmediatePropagation();openMap();return}if(e.target.closest('[data-mobile-view]')&&!e.target.closest('[data-mobile-view="map"]'))closeMap();});const obs=new MutationObserver(()=>patchMapModal());obs.observe(document.body,{childList:true,subtree:true});setTimeout(patchMapModal,100)}
bind();window.YBMapNavigation={open:openMap,close:closeMap};
})();