// Shared credentials (change these)
const VALID_USERNAME = 'Dubidubidapdap';
const VALID_PASSWORD = 'PitouandSaika18125';
// Sync backend config (change if deploying)
const SYNC_URL = 'http://localhost:8787'; // unused (sync disabled)
const SYNC_TOKEN = 'changeme'; // unused (sync disabled)

// Supabase cloud persistence (free)
const SUPABASE_URL = 'https://mqhcdiakvmbbxoywmqoj.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xaGNkaWFrdm1iYnhveXdtcW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzA1NjMsImV4cCI6MjA3NzUwNjU2M30.suB0d45H8yGYWySwCGIcHEUtXF8IPGw6ZYEsHZvxMk0';
let supa;
try{ if(window.supabase){ supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON); } }catch(_){}

// Creator profile (edit these to personalize)
const CREATOR = {
  name: 'Rm Rance',
  role: 'Web Developer',
  edu: 'BS Information Technology — 1st Year',
  school: 'Bulacan State University',
  // Built-in offline-safe SVG dog as default (will always render)
  photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect fill='%23ffe9f1' width='120' height='120'/><text x='50%' y='58%' text-anchor='middle' dominant-baseline='middle' font-size='64'>🐶</text></svg>",
  links: {
    github: 'https://github.com/PitouSaika',
    instagram: 'https://www.instagram.com/rxpitou?igsh=NjNnZG1iNWZsb2dr',
    facebook: 'https://www.facebook.com/share/1DiKwMyXts/',
    email: 'rancerm09@gmail.com',
  }
};
// Elements
const loginSection = document.getElementById('login');
const appSection = document.getElementById('app');
const loginForm = document.getElementById('loginForm');
const usernameEl = document.getElementById('username');
const passwordEl = document.getElementById('password');
const togglePwBtn = document.getElementById('togglePw');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logout');

const tabs = Array.from(document.querySelectorAll('.tab'));
const panels = {
  dashboard: document.getElementById('dashboard'),
  photos: document.getElementById('photos'),
  videos: document.getElementById('videos'),
  letters: document.getElementById('letters'),
};
const countPhotosEl = document.getElementById('countPhotos');
const countVideosEl = document.getElementById('countVideos');
const countLettersEl = document.getElementById('countLetters');
// Backup controls
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importInput = document.getElementById('importInput');
const clearAllBtn = document.getElementById('clearAllBtn');
// const syncNowBtn = document.getElementById('syncNow'); // removed
// Profile elements
const elCreatorImg = document.getElementById('creatorImg');
const elLinkGitHub = document.getElementById('linkGitHub');
const elLinkInstagram = document.getElementById('linkInstagram');
const elLinkFacebook = document.getElementById('linkFacebook');
const elLinkEmail = document.getElementById('linkEmail');
const elProfileName = document.querySelector('.profile-card .who .name');
const elProfileRole = document.querySelector('.profile-card .who .role');
const elProfileEdu = document.querySelector('.profile-card .who .edu');
const elProfileSchool = document.querySelector('.profile-card .who .school');
const elInitials = document.querySelector('.profile-card .avatar .initials');
const elAvatar = document.querySelector('.profile-card .avatar');
// Profile sheet elements
const profileModal = document.getElementById('profileModal');
const profileAvatar = document.getElementById('profileAvatar');
const profileName = document.getElementById('profileName');
const profileRole = document.getElementById('profileRole');
const profileEdu = document.getElementById('profileEdu');
const profileSchool = document.getElementById('profileSchool');
const profileLinkGitHub = document.getElementById('profileLinkGitHub');
const profileLinkInstagram = document.getElementById('profileLinkInstagram');
const profileLinkFacebook = document.getElementById('profileLinkFacebook');
const profileLinkEmail = document.getElementById('profileLinkEmail');

// Forms and containers
// Photos
const photoForm = document.getElementById('photoForm');
const photoTitle = document.getElementById('photoTitle');
const photoAuthor = document.getElementById('photoAuthor');
const photoFiles = document.getElementById('photoFiles');
const photoPreviews = document.getElementById('photoPreviews');
const photoCaption = document.getElementById('photoCaption');
const photoGrid = document.getElementById('photoGrid');
const photoSort = document.getElementById('photoSort');

// Videos
const videoForm = document.getElementById('videoForm');
const videoTitle = document.getElementById('videoTitle');
const videoAuthor = document.getElementById('videoAuthor');
const videoFile = document.getElementById('videoFile');
const videoPreview = document.getElementById('videoPreview');
const videoCaption = document.getElementById('videoCaption');
const videoGrid = document.getElementById('videoGrid');
const videoSort = document.getElementById('videoSort');

// Letters
const letterForm = document.getElementById('letterForm');
const letterTitle = document.getElementById('letterTitle');
const letterAuthor = document.getElementById('letterAuthor');
const letterBody = document.getElementById('letterBody');
const letterList = document.getElementById('letterList');
const letterSort = document.getElementById('letterSort');
// Format buttons
const btnBold = document.getElementById('btnBold');
const btnItalic = document.getElementById('btnItalic');

// Modals
const photoModal = document.getElementById('photoModal');
const photoPrevBtn = document.getElementById('photoPrev');
const photoNextBtn = document.getElementById('photoNext');
const viewImg = document.getElementById('viewImg');
const viewCaption = document.getElementById('viewCaption');
const viewMeta = document.getElementById('viewMeta');

const videoModal = document.getElementById('videoModal');
const viewVideo = document.getElementById('viewVideo');
const videoCaptionText = document.getElementById('videoCaptionText');
const videoMeta = document.getElementById('videoMeta');

// Hearts toggle
const toggleHearts = document.getElementById('toggleHearts');
const floatHearts = document.getElementById('floatHearts');
let heartsTimer;

// State
let photoList = [];
let videoList = [];
let letterItems = [];
let currentPhotoIndex = -1;
let isProfileView = false;

// Helpers
function spawnHeart(){
  const el=document.createElement('div');
  el.className='heart';
  el.textContent=Math.random()<0.5?'❤':'💖';
  el.style.left=Math.random()*100+'vw';
  el.style.fontSize=(14+Math.random()*22)+'px';
  const dur=7+Math.random()*7; el.style.animation=`rise ${dur}s linear forwards`;
  floatHearts.appendChild(el); setTimeout(()=>el.remove(), dur*1000);
}
function startHearts(){ if(heartsTimer) return; heartsTimer=setInterval(spawnHeart, 1000); }
function stopHearts(){ clearInterval(heartsTimer); heartsTimer=undefined; }

function showApp(){
  document.body.classList.add('authed');
  loginSection.classList.add('hide');
  appSection.classList.remove('hide');
  startHearts();
}
function showLogin(){
  document.body.classList.remove('authed');
  appSection.classList.add('hide');
  loginSection.classList.remove('hide');
  stopHearts();
}

function escapeHtml(s){ return s.replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }
function timeStr(ts){ return new Date(ts).toLocaleString(); }

function showTab(name){
  Object.entries(panels).forEach(([k,el])=>{ el.classList.toggle('active', k===name); el.classList.toggle('hide', k!==name); });
  tabs.forEach(t=> t.classList.toggle('active', t.dataset.tab===name));
}

// Auth
togglePwBtn.addEventListener('click', ()=>{
  const isPw = passwordEl.type === 'password';
  passwordEl.type = isPw ? 'text' : 'password';
  togglePwBtn.textContent = isPw ? '🙈' : '👁';
});

if (localStorage.getItem('session')==='ok') showApp();

loginForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const u=usernameEl.value.trim();
  const p=passwordEl.value;
  if(u===VALID_USERNAME && p===VALID_PASSWORD){
    localStorage.setItem('session','ok');
    loginError.textContent='';
    showApp();
    renderAll();
  } else {
    loginError.textContent='Wrong details. Try again, my love.';
  }
});
logoutBtn.addEventListener('click', ()=>{ localStorage.removeItem('session'); showLogin(); });

tabs.forEach(btn=> btn.addEventListener('click', ()=> showTab(btn.dataset.tab)) );

toggleHearts.addEventListener('change', ()=>{ if(toggleHearts.checked) startHearts(); else stopHearts(); });

// DB init
(async function init(){
  await DB.openDB();
  // Set profile info
  applyCreatorProfile();
  // Try to load cloud backup (if exists)
  await cloudLoad().catch(()=>{});
  if (localStorage.getItem('session')==='ok') renderAll();
})();

// Previews
photoFiles.addEventListener('change', ()=>{
  photoPreviews.innerHTML='';
  Array.from(photoFiles.files).forEach(file=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const img=document.createElement('img'); img.src=reader.result; photoPreviews.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

videoFile.addEventListener('change', ()=>{
  videoPreview.innerHTML='';
  const file=videoFile.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=()=>{
    const v=document.createElement('video'); v.src=reader.result; v.muted=true; v.playsInline=true; v.controls=false; videoPreview.appendChild(v);
  };
  reader.readAsDataURL(file);
});

// Upload handlers
photoForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const files = Array.from(photoFiles.files);
  if (!files.length) return;
  for (const f of files){
    const dataUrl = await readAsDataURL(f);
    await DB.addPhoto({
      title: photoTitle.value.trim(),
      caption: photoCaption.value.trim(),
      author: photoAuthor.value,
      dataUrl,
      favorite: false,
      createdAt: Date.now(),
    });
  }
  photoForm.reset(); photoPreviews.innerHTML='';
  await renderPhotos();
  await cloudSave().catch(()=>{});
  await renderCounts();
});

videoForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const f = videoFile.files[0]; if(!f) return;
  const dataUrl = await readAsDataURL(f);
  await DB.addVideo({
    title: videoTitle.value.trim(),
    caption: videoCaption.value.trim(),
    author: videoAuthor.value,
    dataUrl,
    favorite: false,
    createdAt: Date.now(),
  });
  videoForm.reset(); videoPreview.innerHTML='';
  await renderVideos();
  await cloudSave().catch(()=>{});
  await renderCounts();
});

letterForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  await DB.addLetter({
    title: letterTitle.value.trim() || 'Untitled',
    body: letterBody.value.trim(),
    author: letterAuthor.value,
    favorite: false,
    createdAt: Date.now(),
  });
  letterForm.reset();
  await renderLetters();
  await cloudSave().catch(()=>{});
  await renderCounts();
});

function readAsDataURL(file){
  return new Promise((resolve, reject)=>{
    const r=new FileReader();
    r.onload=()=>resolve(r.result);
    r.onerror=()=>reject(r.error);
    r.readAsDataURL(file);
  });
}

// Renderers
async function renderCounts(){
  const [p,v,l] = await Promise.all([DB.listPhotos(), DB.listVideos(), DB.listLetters()]);
  countPhotosEl.textContent = p.length;
  countVideosEl.textContent = v.length;
  countLettersEl.textContent = l.length;
}

async function renderPhotos(){
  photoList = await DB.listPhotos();
  if (photoSort.value==='old') photoList = [...photoList].reverse();
  photoGrid.innerHTML='';
  for (const it of photoList){
    const card=document.createElement('div'); card.className='card-item';
    const img=document.createElement('img'); img.src=it.dataUrl; img.alt=it.title||'Photo'; img.loading='lazy';
    const body=document.createElement('div'); body.className='body';
    const title=document.createElement('div'); title.innerHTML = `<strong>${escapeHtml(it.title||'')}</strong>`;
    const cap=document.createElement('div'); cap.className='meta'; cap.textContent = it.caption||'';
    const meta=document.createElement('div'); meta.className='meta'; meta.textContent = `${it.author==='me'?'From me':'From her'} • ${timeStr(it.createdAt)}`;
    const actions=document.createElement('div'); actions.className='actions-row';
    const fav=document.createElement('button'); fav.className='icon-btn fav'+(it.favorite?' active':''); fav.textContent='❤';
    fav.addEventListener('click', async ()=>{ it.favorite=!it.favorite; await DB.putPhoto(it); fav.classList.toggle('active', it.favorite); await cloudSave().catch(()=>{}); });
    const del=document.createElement('button'); del.className='icon-btn'; del.textContent='🗑';
    del.addEventListener('click', async()=>{ if(confirm('Delete this photo?')){ await DB.deletePhoto(it.id); await renderPhotos(); await cloudSave().catch(()=>{}); await renderCounts(); }});
    actions.append(fav, del);
    img.addEventListener('click', ()=> openPhotoLightbox(it));
    body.append(title, cap, meta);
    card.append(img, body, actions);
    photoGrid.appendChild(card);
  }
}

async function renderVideos(){
  videoList = await DB.listVideos();
  if (videoSort.value==='old') videoList = [...videoList].reverse();
  videoGrid.innerHTML='';
  for (const it of videoList){
    const card=document.createElement('div'); card.className='card-item';
    const v=document.createElement('video'); v.src=it.dataUrl; v.muted=true; v.playsInline=true; v.controls=false; v.preload='metadata';
    const body=document.createElement('div'); body.className='body';
    const title=document.createElement('div'); title.innerHTML = `<strong>${escapeHtml(it.title||'')}</strong>`;
    const cap=document.createElement('div'); cap.className='meta'; cap.textContent = it.caption||'';
    const meta=document.createElement('div'); meta.className='meta'; meta.textContent = `${it.author==='me'?'From me':'From her'} • ${timeStr(it.createdAt)}`;
    const actions=document.createElement('div'); actions.className='actions-row';
    const fav=document.createElement('button'); fav.className='icon-btn fav'+(it.favorite?' active':''); fav.textContent='❤';
    fav.addEventListener('click', async ()=>{ it.favorite=!it.favorite; await DB.putVideo(it); fav.classList.toggle('active', it.favorite); await cloudSave().catch(()=>{}); });
    const del=document.createElement('button'); del.className='icon-btn'; del.textContent='🗑';
    del.addEventListener('click', async()=>{ if(confirm('Delete this video?')){ await DB.deleteVideo(it.id); await renderVideos(); await cloudSave().catch(()=>{}); await renderCounts(); }});
    actions.append(fav, del);
    v.addEventListener('click', ()=> openVideoModal(it));
    body.append(title, cap, meta);
    card.append(v, body, actions);
    videoGrid.appendChild(card);
  }
}

async function renderLetters(){
  letterItems = await DB.listLetters();
  if (letterSort.value==='old') letterItems = [...letterItems].reverse();
  letterList.innerHTML='';
  for (const it of letterItems){
    const card=document.createElement('div'); card.className='letter-card';
    const title=document.createElement('div'); title.className='title'; title.textContent = it.title || 'Untitled';
    const text=document.createElement('div'); text.className='text'; text.innerHTML = renderBasicFormatting(it.body);
    const meta=document.createElement('div'); meta.className='meta'; meta.textContent = `${it.author==='me'?'From me':'From her'} • ${timeStr(it.createdAt)}`;
    const actions=document.createElement('div'); actions.className='actions-row';
    const fav=document.createElement('button'); fav.className='icon-btn fav'+(it.favorite?' active':''); fav.textContent='❤';
    fav.addEventListener('click', async ()=>{ it.favorite=!it.favorite; await DB.putLetter(it); fav.classList.toggle('active', it.favorite); await cloudSave().catch(()=>{}); });
    const del=document.createElement('button'); del.className='icon-btn'; del.textContent='🗑';
    del.addEventListener('click', async()=>{ if(confirm('Delete this letter?')){ await DB.deleteLetter(it.id); await renderLetters(); await cloudSave().catch(()=>{}); await renderCounts(); }});
    actions.append(fav, del);
    card.append(title, text, meta, actions);
    letterList.appendChild(card);
  }
}

async function renderAll(){
  await Promise.all([renderPhotos(), renderVideos(), renderLetters(), renderCounts()]);
}

// --- Cloud (Supabase) persistence ---
async function cloudSave(){
  if(!supa) return; // SDK not loaded
  try{
    const [photos, videos, letters] = await Promise.all([DB.listPhotos(), DB.listVideos(), DB.listLetters()]);
    const blob = new Blob([JSON.stringify({version:1, savedAt:Date.now(), photos, videos, letters})], {type:'application/json'});
    const { error } = await supa.storage.from('portal').upload('backup.json', blob, { upsert:true, cacheControl:'0' });
    if(error) throw error;
  }catch(err){ /* silent */ }
}

async function cloudLoad(){
  if(!supa) return; // SDK not loaded
  try{
    const { data, error } = await supa.storage.from('portal').download('backup.json');
    if(error) return; // no file yet
    const text = await data.text();
    const json = JSON.parse(text);
    if(!json || !Array.isArray(json.photos) || !Array.isArray(json.videos) || !Array.isArray(json.letters)) return;
    await Promise.all([DB.clearPhotos(), DB.clearVideos(), DB.clearLetters()]);
    for(const p of json.photos){ delete p.id; await DB.addPhoto(p); }
    for(const v of json.videos){ delete v.id; await DB.addVideo(v); }
    for(const l of json.letters){ delete l.id; await DB.addLetter(l); }
    await renderAll();
  }catch(err){ /* silent */ }
}

// --- Sync helpers (disabled) ---
async function api(method, path, body){
  const res = await fetch(`${SYNC_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': SYNC_TOKEN,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if(!res.ok){ throw new Error(`${res.status} ${await res.text()}`); }
  return res.json();
}

function mergeByKey(items, keyFn){
  const m = new Map();
  for(const it of items){
    const k = keyFn(it);
    if(!m.has(k)) m.set(k, it);
  }
  return Array.from(m.values());
}

async function syncNow(){ // not wired
  // 1) read local
  const [pLocal, vLocal, lLocal] = await Promise.all([DB.listPhotos(), DB.listVideos(), DB.listLetters()]);
  // 2) read remote (if server up)
  let remote;
  try {
    remote = await api('GET', '/api/all');
  } catch(err){
    // If server not reachable, bail gracefully
    alert('Sync server not reachable. Make sure server is running.');
    return;
  }
  const pRemote = remote.photos||[];
  const vRemote = remote.videos||[];
  const lRemote = remote.letters||[];

  // 3) merge client+server by createdAt+title(+snippet)
  const photos = mergeByKey([...pRemote, ...pLocal], (x)=>`${x.createdAt||0}-${x.title||''}-${(x.dataUrl||'').slice(0,24)}`)
    .sort((a,b)=> (b.createdAt||0)-(a.createdAt||0));
  const videos = mergeByKey([...vRemote, ...vLocal], (x)=>`${x.createdAt||0}-${x.title||''}-${(x.dataUrl||'').slice(0,24)}`)
    .sort((a,b)=> (b.createdAt||0)-(a.createdAt||0));
  const letters = mergeByKey([...lRemote, ...lLocal], (x)=>`${x.createdAt||0}-${x.title||''}-${(x.body||'').slice(0,24)}`)
    .sort((a,b)=> (b.createdAt||0)-(a.createdAt||0));

  // 4) push merged to server
  await api('POST', '/api/all', { photos, videos, letters });

  // 5) replace local with merged
  await Promise.all([DB.clearPhotos(), DB.clearVideos(), DB.clearLetters()]);
  for(const p of photos){ await DB.addPhoto(p); }
  for(const v of videos){ await DB.addVideo(v); }
  for(const l of letters){ await DB.addLetter(l); }

  await renderAll();
  alert('Sync complete');
}

// Lightbox / Modals
function openPhotoLightbox(it){
  currentPhotoIndex = photoList.findIndex(x=>x.id===it.id);
  if (currentPhotoIndex<0) return;
  showPhotoAt(currentPhotoIndex);
  photoModal.classList.remove('hide');
}
function showPhotoAt(i){
  const it = photoList[i];
  if (!it) return;
  viewImg.src = it.dataUrl;
  viewCaption.textContent = it.caption||'';
  viewMeta.textContent = `${it.author==='me'?'From me':'From her'} • ${timeStr(it.createdAt)}`;
}
photoPrevBtn.addEventListener('click', ()=>{ if(photoList.length){ currentPhotoIndex=(currentPhotoIndex-1+photoList.length)%photoList.length; showPhotoAt(currentPhotoIndex);} });
photoNextBtn.addEventListener('click', ()=>{ if(photoList.length){ currentPhotoIndex=(currentPhotoIndex+1)%photoList.length; showPhotoAt(currentPhotoIndex);} });

function openVideoModal(it){
  viewVideo.src = it.dataUrl;
  videoCaptionText.textContent = it.caption||'';
  videoMeta.textContent = `${it.author==='me'?'From me':'From her'} • ${timeStr(it.createdAt)}`;
  videoModal.classList.remove('hide');
  viewVideo.play().catch(()=>{});
}

Array.from(document.querySelectorAll('[data-close]')).forEach(btn=> btn.addEventListener('click', ()=> {
  const m = btn.closest('.modal');
  if (m===videoModal){ viewVideo.pause(); setTimeout(()=>{ viewVideo.removeAttribute('src'); viewVideo.load(); }, 0); }
  m.classList.add('hide');
}));
photoModal.addEventListener('click', (e)=>{ if(e.target===photoModal) photoModal.classList.add('hide'); });
// Restore arrows on any close of photo modal
photoModal.addEventListener('transitionend', ()=>{}, { once:false });
Array.from(document.querySelectorAll('[data-close]')).forEach(btn=> btn.addEventListener('click', ()=> {
  const m = btn.closest('.modal');
  if (m===videoModal){ viewVideo.pause(); setTimeout(()=>{ viewVideo.removeAttribute('src'); viewVideo.load(); }, 0); }
  if (m===photoModal){ photoPrevBtn.classList.remove('hide'); photoNextBtn.classList.remove('hide'); isProfileView=false; }
  m.classList.add('hide');
}));
photoModal.addEventListener('click', (e)=>{
  if(e.target===photoModal){
    if (isProfileView){ photoPrevBtn.classList.remove('hide'); photoNextBtn.classList.remove('hide'); isProfileView=false; }
    photoModal.classList.add('hide');
  }
});
// Open avatar in dedicated bottom sheet
function openProfileSheet(){
  if (!profileModal) return;
  const src = (elCreatorImg && elCreatorImg.src) ? elCreatorImg.src : CREATOR.photo;
  if (profileAvatar) profileAvatar.src = src;
  if (profileName) profileName.textContent = CREATOR.name || '';
  if (profileRole) profileRole.textContent = CREATOR.role || '';
  if (profileEdu) profileEdu.textContent = CREATOR.edu || '';
  if (profileSchool) profileSchool.textContent = CREATOR.school || '';
  if (profileLinkGitHub) profileLinkGitHub.href = CREATOR.links.github || '#';
  if (profileLinkInstagram) profileLinkInstagram.href = CREATOR.links.instagram || '#';
  if (profileLinkFacebook) profileLinkFacebook.href = CREATOR.links.facebook || '#';
  if (profileLinkEmail) profileLinkEmail.href = CREATOR.links.email ? `mailto:${CREATOR.links.email}` : 'mailto:';
  profileModal.classList.remove('hide');
}
if (elAvatar){ elAvatar.style.cursor='default'; }
videoModal.addEventListener('click', (e)=>{ if(e.target===videoModal){ viewVideo.pause(); videoModal.classList.add('hide'); setTimeout(()=>{ viewVideo.removeAttribute('src'); viewVideo.load(); },0);} });

document.addEventListener('keydown', (e)=>{
  if (e.key==='Escape'){
    if(!photoModal.classList.contains('hide')) photoModal.classList.add('hide');
    if(!videoModal.classList.contains('hide')){ viewVideo.pause(); videoModal.classList.add('hide'); setTimeout(()=>{ viewVideo.removeAttribute('src'); viewVideo.load(); },0); }
    if(profileModal && !profileModal.classList.contains('hide')) profileModal.classList.add('hide');
  }
});

// Start on dashboard tab
showTab('dashboard');

function applyCreatorProfile(){
  if (elCreatorImg){
    const candidates = [
      CREATOR.photo,
      'https://placedog.net/400/400',
      'https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg',
    ].filter(Boolean);

    let idx = 0;
    const tryLoad = () => {
      if (idx >= candidates.length){
        if(elInitials) elInitials.style.display='grid';
        elCreatorImg.style.opacity = '0';
        console.warn('[CreatorImg] all sources failed');
        return;
      }
      const src = candidates[idx++];
      console.debug('[CreatorImg] trying', src);
      elCreatorImg.onload = () => {
        if(elInitials) elInitials.style.display='none';
        elCreatorImg.style.opacity = '1';
        console.debug('[CreatorImg] loaded:', src);
      };
      elCreatorImg.onerror = () => {
        console.warn('[CreatorImg] failed:', src);
        tryLoad();
      };
      elCreatorImg.style.opacity = '0';
      elCreatorImg.src = src;
    };
    tryLoad();
  }
  if (elProfileName) elProfileName.textContent = CREATOR.name || 'Creator';
  if (elProfileRole) elProfileRole.textContent = CREATOR.role || '';
  if (elProfileEdu) elProfileEdu.textContent = CREATOR.edu || '';
  if (elProfileSchool) elProfileSchool.textContent = CREATOR.school || '';
  if (elInitials && CREATOR.name){
    const parts = CREATOR.name.trim().split(/\s+/);
    const initials = (parts[0]?.[0]||'').toUpperCase() + ' ' + (parts[1]?.[0]||'').toUpperCase();
    elInitials.textContent = initials.trim();
  }
  if (elLinkGitHub) elLinkGitHub.href = CREATOR.links.github || '#';
  if (elLinkInstagram) elLinkInstagram.href = CREATOR.links.instagram || '#';
  if (elLinkFacebook) elLinkFacebook.href = CREATOR.links.facebook || '#';
  if (elLinkEmail) elLinkEmail.href = CREATOR.links.email ? `mailto:${CREATOR.links.email}` : 'mailto:';
}

// Formatting helpers
function wrapSelection(textarea, before, after){
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  textarea.value = value.slice(0,start) + before + value.slice(start,end) + after + value.slice(end);
  textarea.focus();
  textarea.setSelectionRange(start+before.length, end+before.length);
}
btnBold.addEventListener('click', ()=> wrapSelection(letterBody, '**','**'));
btnItalic.addEventListener('click', ()=> wrapSelection(letterBody, '*','*'));

function renderBasicFormatting(s){
  const esc = escapeHtml(s).replace(/\n/g,'<br/>');
  // Bold **text** and Italic *text*
  return esc
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

// Backup: export/import/clear
exportBtn.addEventListener('click', async ()=>{
  const [photos, videos, letters] = await Promise.all([DB.listPhotos(), DB.listVideos(), DB.listLetters()]);
  const blob = new Blob([JSON.stringify({version:1, exportedAt: Date.now(), photos, videos, letters}, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=`couple-portal-backup-${new Date().toISOString().slice(0,10)}.json`; a.click();
  URL.revokeObjectURL(url);
});

importBtn.addEventListener('click', ()=> importInput.click());
importInput.addEventListener('change', async ()=>{
  const f = importInput.files[0]; if(!f) return;
  const text = await f.text();
  try {
    const data = JSON.parse(text);
    if(!data || (!Array.isArray(data.photos)) || (!Array.isArray(data.videos)) || (!Array.isArray(data.letters))) throw new Error('Invalid backup format');
    if(!confirm('Importing will add items to your current data. Continue?')) return;
    for(const p of data.photos){ delete p.id; await DB.addPhoto(p); }
    for(const v of data.videos){ delete v.id; await DB.addVideo(v); }
    for(const l of data.letters){ delete l.id; await DB.addLetter(l); }
    await renderAll();
    alert('Import complete');
  } catch(err){ alert('Import failed: '+err.message); }
  importInput.value='';
});

clearAllBtn.addEventListener('click', async ()=>{
  if(!confirm('Clear ALL photos, videos, and letters? This cannot be undone.')) return;
  await Promise.all([DB.clearPhotos(), DB.clearVideos(), DB.clearLetters()]);
  await renderAll();
});
// no sync button wired
