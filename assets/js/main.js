document.getElementById('year').textContent = new Date().getFullYear();
// Example: load teaser images from a public JSON (replaced by admin uploads later)
const teaser = document.getElementById('teaserGrid');
if (teaser){
  const imgs = ['/assets/img/sample1.jpg','/assets/img/sample2.jpg','/assets/img/sample3.jpg','/assets/img/sample4.jpg','/assets/img/sample5.jpg','/assets/img/sample6.jpg'];
  teaser.innerHTML = imgs.map(src => `<img src="${src}" alt="Bridal mehendi by Kulsum Huda" loading="lazy" />`).join('');
}
