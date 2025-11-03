// Lightweight admin JS that works without a backend.
// - Gallery images and site settings are stored in localStorage.
// - Optionally, set a Google Apps Script web app URL in Settings to forward contact form submissions to a Google Sheet.

const setStatus = (msg)=>{ const s = document.getElementById('status'); if(s) s.textContent = msg; };

function saveSettings(){
  const settings = {
    ownerName: document.getElementById('ownerName').value.trim(),
    ownerInsta: document.getElementById('ownerInsta').value.trim(),
    ownerWhatsApp: document.getElementById('ownerWhatsApp').value.trim(),
    sheetsEndpoint: document.getElementById('sheetsEndpoint').value.trim(),
  };
  localStorage.setItem('kh_settings', JSON.stringify(settings));
  setStatus('Settings saved.');
  // notify main window (site) via storage event if open
}

function loadSettings(){
  const s = JSON.parse(localStorage.getItem('kh_settings')||'{}');
  if(s.ownerName) document.getElementById('ownerName').value = s.ownerName;
  if(s.ownerInsta) document.getElementById('ownerInsta').value = s.ownerInsta;
  if(s.ownerWhatsApp) document.getElementById('ownerWhatsApp').value = s.ownerWhatsApp;
  if(s.sheetsEndpoint) document.getElementById('sheetsEndpoint').value = s.sheetsEndpoint;
}

function getGallery(){
  return JSON.parse(localStorage.getItem('kh_gallery')||'[]');
}

function renderGalleryAdmin(){
  const list = getGallery();
  const c = document.getElementById('galleryAdmin');
  if(!c) return;
  c.innerHTML = list.map((g,idx)=>`<div style="display:inline-block;margin:6px;text-align:center;max-width:140px"><img src="${g.data}" alt="${(g.alt||'')}]" style="height:80px;border:1px solid #eee;border-radius:8px;display:block;margin-bottom:6px"/><div style="font-size:12px">${g.alt||''}</div><button data-idx="${idx}" class="removeImg">Remove</button></div>`).join('');
  c.querySelectorAll('.removeImg').forEach(btn=>btn.onclick = ()=>{
    const idx = +btn.dataset.idx;
    const arr = getGallery(); arr.splice(idx,1); localStorage.setItem('kh_gallery', JSON.stringify(arr)); renderGalleryAdmin();
  });
}

document.getElementById('saveSettings').onclick = saveSettings;
document.getElementById('exportSubmissions').onclick = ()=>{
  const subs = JSON.parse(localStorage.getItem('kh_submissions')||'[]');
  if(!subs.length) return setStatus('No submissions to export.');
  const csv = toCSV(subs);
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
  a.download = 'submissions.csv';
  a.click();
};

document.getElementById('addImg').onclick = async ()=>{
  const f = document.getElementById('adminImgFile').files[0];
  if(!f) return setStatus('Choose an image to add.');
  const alt = document.getElementById('adminImgAlt').value.trim();
  const data = await fileToDataURL(f);
  const arr = getGallery(); arr.push({data, alt}); localStorage.setItem('kh_gallery', JSON.stringify(arr));
  renderGalleryAdmin();
  setStatus('Added to gallery (stored in browser).');
};

function fileToDataURL(file){
  return new Promise((res,rej)=>{
    const r = new FileReader(); r.onload = ()=>res(r.result); r.onerror = rej; r.readAsDataURL(file);
  });
}

function toCSV(arr){
  const keys = Object.keys(arr[0]||{});
  const esc = v => `"${String(v||'').replace(/"/g,'""')}"`;
  return [keys.map(esc).join(','), ...arr.map(o => keys.map(k=>esc(o[k])).join(','))].join('\n');
}

// Content save (hero)
document.getElementById('saveContent').onclick = ()=>{
  const hero = document.getElementById('heroText').value;
  const sub = document.getElementById('heroSub').value;
  const c = {hero,sub};
  localStorage.setItem('kh_content', JSON.stringify(c));
  setStatus('Content saved.');
};

// Contact submissions exported from contact form (see /contact.html). Admin can also export as CSV.
function addSubmission(obj){
  const arr = JSON.parse(localStorage.getItem('kh_submissions')||'[]'); arr.push(obj); localStorage.setItem('kh_submissions', JSON.stringify(arr));
}

// Initialize
loadSettings(); renderGalleryAdmin();

