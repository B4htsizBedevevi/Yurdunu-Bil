/* Yurdunu Bil 27 — interactive atlas + live data controls */
(() => {
  'use strict';
  const ROOTS=['dash-svg','map-svg'];
  const maps=new WeakMap();
  let liveBound=false;
  let liveIndex=0;
  const LIVE_COUNT=6;

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];

  function mapState(svg){
    let s=maps.get(svg);
    if(!s){s={x:0,y:0,zoom:1,pointer:false,startX:0,startY:0,baseX:0,baseY:0,moved:false,suppress:false};maps.set(svg,s);}
    return s;
  }

  function applyMap(svg){
    const s=mapState(svg);
    svg.style.transform=`translate3d(${s.x}px,${s.y}px,0) scale(${s.zoom})`;
    svg.classList.toggle('atlas-panning',s.pointer);
    const controls=svg.closest('.atlas-shell')?.querySelector('.atlas-reset-note');
    if(controls)controls.textContent=`${Math.round(s.zoom*100)}%`;
  }

  function resetMap(svg){
    const s=mapState(svg);s.x=0;s.y=0;s.zoom=1;s.pointer=false;s.moved=false;applyMap(svg);
  }
  function pan(svg,dx,dy){const s=mapState(svg);s.x=clamp(s.x+dx,-280,280);s.y=clamp(s.y+dy,-170,170);applyMap(svg);}
  function zoomAt(svg,delta){const s=mapState(svg);s.zoom=clamp(s.zoom+delta,.72,2.25);applyMap(svg);}

  function addMapControls(svg){
    const shell=svg.closest('.atlas-shell');if(!shell||shell.querySelector('.atlas-nav'))return;
    const nav=document.createElement('div');nav.className='atlas-nav';
    nav.innerHTML=`<button type="button" data-map-left aria-label="Haritayı sola taşı">‹</button><button type="button" data-map-zoom-out aria-label="Uzaklaştır">−</button><button type="button" class="atlas-reset" data-map-reset aria-label="Haritayı sıfırla">⌂</button><button type="button" data-map-zoom-in aria-label="Yakınlaştır">+</button><button type="button" data-map-right aria-label="Haritayı sağa taşı">›</button><span class="atlas-reset-note">100%</span>`;
    shell.appendChild(nav);
    const hint=document.createElement('div');hint.className='atlas-gesture-hint';hint.textContent='Sürükle • kaydır • yakınlaştır';shell.appendChild(hint);
    nav.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.mapLeft)pan(svg,-90,0);else if(b.dataset.mapRight)pan(svg,90,0);else if(b.dataset.mapZoomIn)zoomAt(svg,.18);else if(b.dataset.mapZoomOut)zoomAt(svg,-.18);else if(b.dataset.mapReset)resetMap(svg);});
  }

  function bindMap(svg){
    if(svg.dataset.v27Bound==='1'){addMapControls(svg);return;}
    svg.dataset.v27Bound='1';addMapControls(svg);
    const s=mapState(svg);
    svg.addEventListener('wheel',e=>{e.preventDefault();zoomAt(svg,e.deltaY<0?.12:-.12)},{passive:false});
    svg.addEventListener('pointerdown',e=>{
      if(e.pointerType==='mouse'&&e.button!==0)return;
      s.pointer=true;s.moved=false;s.suppress=false;s.startX=e.clientX;s.startY=e.clientY;s.baseX=s.x;s.baseY=s.y;
      try{svg.setPointerCapture(e.pointerId)}catch{}
    });
    svg.addEventListener('pointermove',e=>{
      if(!s.pointer)return;
      const dx=e.clientX-s.startX,dy=e.clientY-s.startY;
      if(Math.abs(dx)+Math.abs(dy)>6)s.moved=true;
      if(!s.moved)return;
      s.x=clamp(s.baseX+dx,-280,280);s.y=clamp(s.baseY+dy,-170,170);applyMap(svg);e.preventDefault();
    },{passive:false});
    const end=e=>{if(!s.pointer)return;s.pointer=false;s.suppress=s.moved;try{svg.releasePointerCapture(e.pointerId)}catch{}applyMap(svg);if(s.suppress)setTimeout(()=>s.suppress=false,80)};
    svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);svg.addEventListener('dblclick',()=>resetMap(svg));
    svg.addEventListener('click',e=>{if(s.suppress){e.preventDefault();e.stopImmediatePropagation();s.suppress=false;}},true);
  }

  function enhanceMaps(){ROOTS.forEach(id=>{const svg=document.getElementById(id);if(svg)bindMap(svg)})}

  function setLiveIndex(i){
    liveIndex=(i+LIVE_COUNT)%LIVE_COUNT;
    const el=q('#live-stats');if(!el)return;
    el.dataset.liveIndex=String(liveIndex);
    const root=el.querySelector('.live-main');
    if(root)root.classList.remove('live-swap');
    requestAnimationFrame(()=>root?.classList.add('live-swap'));
    qa('.live-dots i',el).forEach((d,n)=>d.classList.toggle('active',n===liveIndex));
  }

  function bindLive(){
    const el=q('#live-stats');if(!el)return;
    if(el.dataset.v27Live==='1')return;
    el.dataset.v27Live='1';
    const head=el.querySelector('.live-head');
    if(head){
      const old=head.querySelector('b');if(old)old.style.display='none';
      const refresh=document.createElement('button');refresh.type='button';refresh.className='live-refresh';refresh.textContent='↻ Yenile';refresh.dataset.atlasRefresh='1';head.appendChild(refresh);
    }
    const wrap=document.createElement('div');wrap.className='live-switcher';
    wrap.innerHTML=`<button type="button" data-live-prev aria-label="Önceki güncel veri">‹</button><div class="live-track"></div><button type="button" data-live-next aria-label="Sonraki güncel veri">›</button>`;
    const main=el.querySelector('.live-main');
    if(main){main.parentNode.insertBefore(wrap,main);const track=wrap.querySelector('.live-track');track.appendChild(main);}
    const dots=el.querySelector('.live-dots');if(dots)qa('i',dots).forEach((d,i)=>d.addEventListener('click',()=>setLiveIndex(i)));
    el.addEventListener('click',e=>{const b=e.target.closest('[data-live-prev],[data-live-next],[data-atlas-refresh]');if(!b)return;e.preventDefault();if(b.dataset.livePrev)setLiveIndex(liveIndex-1);else if(b.dataset.liveNext)setLiveIndex(liveIndex+1);else hardRefresh();});
    let sx=0,sy=0,drag=false;
    el.addEventListener('touchstart',e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;drag=true},{passive:true});
    el.addEventListener('touchend',e=>{if(!drag)return;drag=false;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){setLiveIndex(liveIndex+(dx<0?1:-1));e.preventDefault();}},{passive:false});
    setLiveIndex(liveIndex);
  }

  function hardRefresh(){
    try{sessionStorage.setItem('yb_force_reload',String(Date.now()))}catch{}
    location.reload();
  }

  function patchExistingRefreshButtons(){
    qa('button,a').forEach(b=>{
      if(b.dataset.v27RefreshBound==='1')return;
      const t=(b.textContent||'').trim().toLocaleLowerCase('tr-TR');
      if(!t)return;
      if(t.includes('yenile')||t.includes('refresh')){
        b.dataset.v27RefreshBound='1';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();hardRefresh()},true);
      }
    });
  }

  let observerTimer=0;
  const observer=new MutationObserver(()=>{clearTimeout(observerTimer);observerTimer=setTimeout(()=>{enhanceMaps();bindLive();patchExistingRefreshButtons()},100)});
  function start(){enhanceMaps();bindLive();patchExistingRefreshButtons();observer.observe(document.body,{subtree:true,childList:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
