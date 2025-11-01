// IndexedDB wrapper with CRUD for photos, videos, letters
const DB_NAME = 'couple_portal_db';
const DB_VERSION = 1;
let db;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains('photos')) {
        const s = d.createObjectStore('photos', { keyPath: 'id', autoIncrement: true });
        s.createIndex('createdAt', 'createdAt');
        s.createIndex('favorite', 'favorite');
      }
      if (!d.objectStoreNames.contains('videos')) {
        const s = d.createObjectStore('videos', { keyPath: 'id', autoIncrement: true });
        s.createIndex('createdAt', 'createdAt');
        s.createIndex('favorite', 'favorite');
      }
      if (!d.objectStoreNames.contains('letters')) {
        const s = d.createObjectStore('letters', { keyPath: 'id', autoIncrement: true });
        s.createIndex('createdAt', 'createdAt');
        s.createIndex('favorite', 'favorite');
      }
    };
    req.onsuccess = () => { db = req.result; resolve(db); };
    req.onerror = () => reject(req.error);
  });
}

function store(name, mode = 'readonly') { return db.transaction(name, mode).objectStore(name); }

// Create
function addItem(name, value) { return new Promise((res, rej)=>{ const r = store(name, 'readwrite').add(value); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); }
// Read all (sorted desc by createdAt)
function listItems(name) {
  return new Promise((res, rej) => {
    const out = [];
    const idx = store(name).index('createdAt').openCursor(null, 'prev');
    idx.onsuccess = (e) => { const c = e.target.result; if (c) { out.push(c.value); c.continue(); } else res(out); };
    idx.onerror = () => rej(idx.error);
  });
}
// Update
function putItem(name, value) { return new Promise((res, rej)=>{ const r = store(name, 'readwrite').put(value); r.onsuccess=()=>res(true); r.onerror=()=>rej(r.error); }); }
// Delete
function deleteItem(name, id) { return new Promise((res, rej)=>{ const r = store(name, 'readwrite').delete(id); r.onsuccess=()=>res(true); r.onerror=()=>rej(r.error); }); }

// Helpers for each store
const DB = {
  openDB,
  // Photos
  addPhoto: (v) => addItem('photos', v),
  listPhotos: () => listItems('photos'),
  putPhoto: (v) => putItem('photos', v),
  deletePhoto: (id) => deleteItem('photos', id),
  clearPhotos: () => new Promise((res, rej)=>{ const r=store('photos','readwrite').clear(); r.onsuccess=()=>res(true); r.onerror=()=>rej(r.error);} ),
  // Videos
  addVideo: (v) => addItem('videos', v),
  listVideos: () => listItems('videos'),
  putVideo: (v) => putItem('videos', v),
  deleteVideo: (id) => deleteItem('videos', id),
  clearVideos: () => new Promise((res, rej)=>{ const r=store('videos','readwrite').clear(); r.onsuccess=()=>res(true); r.onerror=()=>rej(r.error);} ),
  // Letters
  addLetter: (v) => addItem('letters', v),
  listLetters: () => listItems('letters'),
  putLetter: (v) => putItem('letters', v),
  deleteLetter: (id) => deleteItem('letters', id),
  clearLetters: () => new Promise((res, rej)=>{ const r=store('letters','readwrite').clear(); r.onsuccess=()=>res(true); r.onerror=()=>rej(r.error);} ),
};

window.DB = DB;
