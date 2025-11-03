const API = 'https://your-admin-api.example.com'; // replace with your deployed API base

let token = localStorage.getItem('kh_token') || '';

const setStatus = (msg)=>{ document.getElementById('status').textContent = msg; };

document.getElementById('loginBtn').onclick = async ()=>{
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const r = await fetch(`${API}/auth/login`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  if(r.ok){
    const data = await r.json();
    token = data.token;
    localStorage.setItem('kh_token', token);
    setStatus('Logged in.');
    loadData();
  } else setStatus('Login failed.');
};

document.getElementById('logoutBtn').onclick = ()=>{
  token = ''; localStorage.removeItem('kh_token'); setStatus('Logged out.');
};

async function authFetch(url, options={}){
  options.headers = Object.assign({'Authorization':`Bearer ${token}`,'Accept':'application/json'}, options.headers||{});
  return fetch(url, options);
}

document.getElementById('savePkg').onclick = async ()=>{
  const name = document.getElementById('pkgName').value.trim();
  const price = +document.getElementById('pkgPrice').value;
  const notes = document.getElementById('pkgNote').value.trim();
  const r = await authFetch(`${API}/prices`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,price,notes})});
  setStatus(r.ok ? 'Saved package.' : 'Error saving.');
  loadPrices();
};

document.getElementById('uploadBtn').onclick = async ()=>{
  const f = document.getElementById('imgFile').files[0];
  if(!f) return setStatus('Choose an image.');
  const fd = new FormData();
  fd.append('file', f);
  fd.append('tag', document.getElementById('imgTag').value);
  fd.append('alt', document.getElementById('imgAlt').value);
  const r = await authFetch(`${API}/gallery`, {method:'POST', body:fd});
  setStatus(r.ok ? 'Uploaded image.' : 'Upload failed.');
  loadGallery();
};

document.getElementById('saveContent').onclick = async ()=>{
  const hero = document.getElementById('heroText').value;
  const sub = document.getElementById('heroSub').value;
  const r = await authFetch(`${API}/content/hero`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({hero,sub})});
  setStatus(r.ok ? 'Content saved.' : 'Error saving content.');
};

async function loadPrices(){
  const r = await fetch(`${API}/prices`);
  const list = r.ok ? await r.json() : [];
  document.querySelector('#pkgTable tbody').innerHTML =
    list.map(p=>`<tr><td>${p.name}</td><td>₹${p.price.toLocaleString('en-IN')}</td><td>${p.notes||''}</td><td><button data-id="${p.id}" class="del">Delete</button></td></tr>`).join('');
  document.querySelectorAll('.del').forEach(btn=>btn.onclick = async ()=>{
    await authFetch(`${API}/prices/${btn.dataset.id}`, {method:'DELETE'}); loadPrices();
  });
}

async function loadGallery(){
  const r = await fetch(`${API}/gallery`);
  const list = r.ok ? await r.json() : [];
  document.getElementById('galleryAdmin').innerHTML =
    list.map(g=>`<div style="display:inline-block;margin:6px"><img src="${g.url}" alt="" style="height:120px;border:1px solid #eee;border-radius:8px"/><div style="text-align:center"><button data-id="${g.id}" class="delg">Delete</button></div></div>`).join('');
  document.querySelectorAll('.delg').forEach(btn=>btn.onclick = async ()=>{
    await authFetch(`${API}/gallery/${btn.dataset.id}`, {method:'DELETE'}); loadGallery();
  });
}

async function loadData(){ loadPrices(); loadGallery(); }
if(token) loadData();
