document.getElementById('year').textContent = new Date().getFullYear();
// Example: load teaser images from a public JSON (replaced by admin uploads later)
const teaser = document.getElementById('teaserGrid');
if (teaser){
  // prefer gallery stored in localStorage (admin uploads)
  const stored = JSON.parse(localStorage.getItem('kh_gallery')||'[]');
  if(stored.length){
    teaser.innerHTML = stored.map(g=>`<img src="${g.data}" alt="${g.alt||'Bridal mehendi by Kulsum Huda'}" loading="lazy" />`).join('');
  } else {
    const imgs = ['../img/sample1.svg','../img/sample2.svg','../img/sample3.svg','../img/sample4.svg','../img/sample5.svg','../img/sample6.svg'];
    teaser.innerHTML = imgs.map(src => `<img src="${src}" alt="Bridal mehendi by Kulsum Huda" loading="lazy" />`).join('');
  }
}

// Apply owner/site settings from admin (stored in localStorage)
try{
  const settings = JSON.parse(localStorage.getItem('kh_settings')||'{}');
  if(settings.ownerName){
    const brand = document.querySelector('.nav .brand');
    if(brand) brand.innerHTML = `<img src="/assets/img/logo.svg" alt="KH logo" /> ${settings.ownerName}`;
    const footerName = document.querySelector('.footer p span#year')?.parentElement; // noop
  }
  if(settings.ownerWhatsApp){
    const wa = document.querySelector('.footer a[href*="wa.me"]');
    if(wa) wa.href = `https://wa.me/${settings.ownerWhatsApp}`;
  }
  if(settings.ownerInsta){
    const insta = document.querySelector('.footer a[href*="instagram.com"]');
    if(insta) insta.href = settings.ownerInsta;
  }
}catch(e){console.warn('Error applying settings', e)}
