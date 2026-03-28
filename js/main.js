// Small vanilla JS for interactivity: menu toggle, form honeypot check
document.addEventListener('DOMContentLoaded',function(){
  // Menu toggle: header may be injected asynchronously (include-fragments.js),
  // so bind when the element is available. Use MutationObserver as fallback.
  function bindNavToggle(){
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('main-nav');
    if(!navToggle || !nav) return false;
    // avoid double-binding
    if(navToggle.dataset.bound === '1') return true;
    navToggle.dataset.bound = '1';
    navToggle.addEventListener('click', ()=>{
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      if(!expanded){
        nav.style.display = 'block';
        nav.classList.add('animating');
        setTimeout(()=>nav.classList.remove('animating'), 600);
      } else {
        nav.style.display = 'none';
      }
    });
    return true;
  }

  if(!bindNavToggle()){
    // watch for injected header
    const obs = new MutationObserver(function(mutations, observer){
      if(bindNavToggle()) observer.disconnect();
    });
    obs.observe(document.documentElement || document.body, {childList:true, subtree:true});
  }

  // Fixed header: always at top and hide/show on scroll
  (function(){
    const header = document.querySelector('.site-header');
    if(!header) return;
    // ensure header is visible initially
    header.classList.add('visible');
    // set body top padding to header height so content doesn't jump under the fixed header
    // also set CSS var so the hide transform can use exact header height for smooth sliding
    const setSpacing = ()=>{
      const h = header.offsetHeight;
      document.body.style.paddingTop = h + 'px';
      document.documentElement.style.setProperty('--header-hide-offset', h + 'px');
    };
    setSpacing();
    window.addEventListener('resize', setSpacing);
    let lastY = window.scrollY;
    let ticking = false;
    let hidden = false;
    window.addEventListener('scroll', ()=>{
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(()=>{
        const y = window.scrollY;
        if(y > lastY && y > header.offsetHeight + 20){
          if(!hidden){ header.classList.add('hidden'); header.classList.remove('visible'); hidden = true; }
        } else {
          if(hidden){ header.classList.remove('hidden'); header.classList.add('visible'); hidden = false; }
        }
        lastY = y <= 0 ? 0 : y;
        ticking = false;
      });
    });
  })();

  // contact form honeypot and basic validation
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      const hp = form.querySelector('input[name="website"]');
      if(hp && hp.value.trim() !== ''){
        // likely bot
        e.preventDefault();
        return;
      }
      const name = form.querySelector('[name="name"]');
      const contact = form.querySelector('[name="contact"]');
      if(!name.value.trim() || !contact.value.trim()){
        e.preventDefault();
        alert('Vyplňte prosím povinná pole: jméno a kontakt.');
      }
    });
  }

  // Lightbox for catalog images (click to enlarge)
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lightbox-image');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev = document.getElementById('lightbox-prev');
  const lbNext = document.getElementById('lightbox-next');
  const catalogImgs = Array.from(document.querySelectorAll('.catalog-grid .img-container img'));
  let currentIndex = -1;

  function openLightbox(index){
    const img = catalogImgs[index];
    if(!img) return;
    currentIndex = index;
    lbImage.src = img.src;
    lbImage.alt = img.alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    // reveal nav only if multiple images
    if(catalogImgs.length > 1){ lbPrev.style.display = ''; lbNext.style.display = ''; }
  }

  function closeLightbox(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    lbImage.src = '';
    document.body.style.overflow = '';
  }

  function showPrev(){
    if(currentIndex <= 0) currentIndex = catalogImgs.length - 1; else currentIndex--;
    lbImage.src = catalogImgs[currentIndex].src;
    lbImage.alt = catalogImgs[currentIndex].alt || '';
  }

  function showNext(){
    if(currentIndex >= catalogImgs.length - 1) currentIndex = 0; else currentIndex++;
    lbImage.src = catalogImgs[currentIndex].src;
    lbImage.alt = catalogImgs[currentIndex].alt || '';
  }

  if(catalogImgs.length){
    catalogImgs.forEach((img, idx)=>{
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (e)=>{ openLightbox(idx); });
    });
    // close handlers
    if(lbClose) lbClose.addEventListener('click', closeLightbox);
    if(lightbox) lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
    if(lbPrev) lbPrev.addEventListener('click', (e)=>{ e.stopPropagation(); showPrev(); });
    if(lbNext) lbNext.addEventListener('click', (e)=>{ e.stopPropagation(); showNext(); });
    document.addEventListener('keydown', (e)=>{
      if(lightbox.classList.contains('open')){
        if(e.key === 'Escape') closeLightbox();
        if(e.key === 'ArrowLeft') showPrev();
        if(e.key === 'ArrowRight') showNext();
      }
    });
  }
});
