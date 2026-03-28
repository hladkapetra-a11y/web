document.addEventListener('DOMContentLoaded', function(){
  // Add a page class to <body> based on the current filename (e.g. page-index, page-kontakt)
  try{
    var path = (location.pathname || '').split('/').pop() || 'index.html';
    var base = (path.split('.')[0] || 'index').toLowerCase().replace(/[^a-z0-9_-]/g,'');
    if(base) document.body.classList.add('page-' + base);
  }catch(e){ /* ignore */ }

  // Find all elements with data-include and load the corresponding fragment from /js
  var includes = document.querySelectorAll('[data-include]');
  if(!includes || includes.length === 0) return;

  includes.forEach(function(el){
    var name = (el.getAttribute('data-include') || '').trim();
    if(!name) return;
    // allow either 'name' or 'name.html' values
    var filename = name.toLowerCase().endsWith('.html') ? name : (name + '.html');
    // try to fetch from js/filename
    fetch('js/' + filename).then(function(res){
      if(!res.ok) throw new Error('Not found');
      return res.text();
    }).then(function(html){
      el.innerHTML = html;
      // After inserting fragment, try to initialise Lucide icons if present
      try {
        if(window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        } else if(!document.querySelector('script[data-lucide-loader]')) {
          var s = document.createElement('script');
          s.src = 'https://unpkg.com/lucide@latest';
          s.setAttribute('data-lucide-loader','1');
          s.onload = function(){ if(window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons(); };
          document.head.appendChild(s);
        }
      } catch(e) {
        // ignore errors during icon init
      }
    }).catch(function(){ /* silently ignore missing fragments */ });
  });
});