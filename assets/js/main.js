document.getElementById('year').textContent = new Date().getFullYear();
// Example: load teaser images from a public JSON (replaced by admin uploads later)
const teaser = document.getElementById('teaserGrid');
if (teaser){
  const imgs = ['/assets/img/sample1.svg','/assets/img/sample2.svg','/assets/img/sample3.svg','/assets/img/sample4.svg','/assets/img/sample5.svg','/assets/img/sample6.svg'];
  teaser.innerHTML = imgs.map(src => `<img src="${src}" alt="Bridal mehendi by Kulsum Huda" loading="lazy" />`).join('');
}
