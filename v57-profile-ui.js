/* Yurdunu Bil 57 — profile identity renderer */
(()=>{'use strict';
if(window.__YB57_PROFILE_UI__)return;window.__YB57_PROFILE_UI__=true;
const C=window.YURDUNUBIL_CONFIG||{};if(!C.SUPABASE_URL||!C.SUPABASE_PUBLISHABLE_KEY||!window.supabase)return;
const sb=window.supabase.createClient(C.SUPABASE_URL,C.SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const avatars={"atlas-01":"🧭","atlas-02":"🌍","atlas-03":"⛰️","atlas-04":"🌊","atlas-05":"🌲","atlas-06":"🌾","atlas-07":"🏔️","atlas-08":"☀️","atlas-09":"🗺️","atlas-10":"🦅","atlas-11":"🏛️","atlas-12":"🚩"};
async function paint(user){if(!user)return;try{const r=await sb.from('profiles').select('display_name,username,avatar_id').eq('id',user.id).maybeSingle();if(r.error||!r.data)return;const a=avatars[r.data.avatar_id]||'🧭';['#side-avatar','#top-avatar','#menu-avatar'].forEach(s=>{const e=document.querySelector(s);if(e){e.textContent=a;e.title=r.data.username?'@'+r.data.username:'';e.dataset.ybAvatar=r.data.avatar_id||'atlas-01'}});['#side-name','#top-name','#menu-name'].forEach(s=>{const e=document.querySelector(s);if(e&&r.data.display_name)e.textContent=r.data.display_name})}catch(e){console.warn('YB57 profile ui',e)}}
sb.auth.getSession().then(({data})=>paint(data.session?.user));sb.auth.onAuthStateChange((_,s)=>paint(s?.user));window.addEventListener('yb57-profile-complete',e=>{const d=e.detail||{},a=avatars[d.avatarId]||'🧭';['#side-avatar','#top-avatar','#menu-avatar'].forEach(s=>{const el=document.querySelector(s);if(el)el.textContent=a});});
})();
