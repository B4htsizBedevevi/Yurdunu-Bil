/* Yurdunu Bil 106 — compact library card interaction layer */
(()=>{'use strict';
if(window.__YB106_LIBRARY_CARDS__)return;window.__YB106_LIBRARY_CARDS__=true;
const $=(s,r=document)=>r.querySelector(s);
function style(){if($('#yb106-style'))return;const s=document.createElement('style');s.id='yb106-style';s.textContent=`
#view-library .library-note-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
#view-library .note-card{position:relative;min-height:190px!important;padding:18px!important;border-radius:20px!important;display:flex!important;flex-direction:column!important;align-items:center!important;text-align:center!important;justify-content:flex-start!important;cursor:pointer!important;background:linear-gradient(145deg,rgba(10,57,39,.96),rgba(7,38,28,.98))!important;border:1px solid rgba(87,199,140,.18)!important;box-shadow:0 10px 28px rgba(0,0,0,.16)!important;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease!important}
#view-library .note-card:hover{transform:translateY(-3px)!important;border-color:rgba(106,220,158,.34)!important;box-shadow:0 16px 34px rgba(0,0,0,.22)!important}
#view-library .note-top{width:100%;justify-content:center!important;margin-bottom:9px!important}.note-level-badge{display:none!important}
#view-library .note-card .topic-icon{width:58px;height:58px;display:grid;place-items:center;border-radius:18px;background:rgba(78,190,127,.11);font-size:32px!important}
#view-library .note-card h2{margin:2px 0 5px!important;font-size:17px!important;line-height:1.18!important;color:#e9f4ed!important;min-height:40px;display:grid;place-items:center}
#view-library .note-card>p{margin:0!important;font-size:10px!important;line-height:1.35!important;color:#8eaa9d!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;max-width:95%}
#view-library .note-preview{display:none!important}
#view-library .note-card-footer{width:100%;margin-top:auto!important;padding-top:10px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important}
#view-library .note-q-count{font-size:10px!important;font-weight:800!important;color:#91b6a3!important}.note-card-footer .btn{display:none!important}
#view-library .note-card::after{content:'›';position:absolute;right:13px;bottom:12px;font-size:27px;font-weight:700;line-height:1;color:#5fc18d}
@media(max-width:1100px){#view-library .library-note-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:760px){#view-library .library-note-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px!important}#view-library .note-card{min-height:205px!important;padding:17px 12px!important;border-radius:18px!important}#view-library .note-card h2{font-size:16px!important}#view-library .note-card .topic-icon{width:54px;height:54px;font-size:29px!important}#view-library .note-card>p{font-size:9px!important;-webkit-line-clamp:2}#view-library .note-card::after{right:11px;bottom:10px}}
@media(max-width:380px){#view-library .library-note-grid{gap:9px!important}#view-library .note-card{min-height:190px!important;padding:14px 9px!important}#view-library .note-card h2{font-size:14px!important}}
body.light #view-library .note-card{background:linear-gradient(145deg,#edf8f1,#e4f2e9)!important;border-color:rgba(31,113,75,.14)!important;box-shadow:0 8px 24px rgba(31,77,53,.08)!important}body.light #view-library .note-card h2{color:#183b2c!important}body.light #view-library .note-card>p{color:#60796d!important}
`;document.head.appendChild(s)}
function bind(){style();document.addEventListener('click',e=>{const direct=e.target.closest('[data-open-topic]');const card=e.target.closest('.note-card[data-topic-id]');const b=direct||card;if(!b)return;const id=b.dataset.openTopic||b.dataset.topicId;if(!id)return;if(window.YB105LibraryReader?.open){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.YB105LibraryReader.open(id);}},true)}
function loadReader(){if(window.YB105LibraryReader){bind();return}if(window.__YB105_LOADING__)return;window.__YB105_LOADING__=true;const s=document.createElement('script');s.src='v105-library-reader.js?v=105.0.0';s.onload=()=>{window.__YB105_LOADING__=false;bind()};s.onerror=()=>{window.__YB105_LOADING__=false};document.body.appendChild(s)}
loadReader();window.addEventListener('load',()=>setTimeout(loadReader,100));
})();

/* 108 loader — loaded once from the existing library bootstrap. */
(()=>{'use strict';if(window.__YB108_LOADING__||window.__YB108_MAP_NAV__)return;window.__YB108_LOADING__=true;const s=document.createElement('script');s.src='v108-map-navigation.js?v=108.0.0';s.onload=()=>window.__YB108_LOADING__=false;s.onerror=()=>window.__YB108_LOADING__=false;document.body.appendChild(s)})();