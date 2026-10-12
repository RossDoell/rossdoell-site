// Every page opens at the top. Browsers otherwise restore the previous
// scroll position on reload/back/forward (and the artifact viewer can carry
// it between pages), which dropped visitors halfway down a project page.
// A #hash link still jumps to its target as normal.
(function(){
  if('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // the load event can land a moment after the visitor has already started
  // scrolling (it waits on images), so stop forcing the top once they have
  var userScrolled = false;
  ['wheel', 'touchstart', 'keydown'].forEach(function(type){
    window.addEventListener(type, function(){ userScrolled = true; }, { passive:true, once:true });
  });
  function toTop(){ if(!location.hash && !userScrolled) window.scrollTo(0, 0); }
  toTop();
  window.addEventListener('DOMContentLoaded', toTop);
  window.addEventListener('load', toTop);
  // pages restored from the back/forward cache skip load entirely
  window.addEventListener('pageshow', function(e){ if(e.persisted){ userScrolled = false; toTop(); } });
})();

(function(){
  var header = document.querySelector('header');
  if(!header) return;
  var lastY = window.scrollY;
  var ticking = false;
  var root = document.documentElement;

  function setHidden(hidden){
    header.classList.toggle('header-hidden', hidden);
    root.style.setProperty('--header-h', hidden ? '0px' : '120px');
  }

  function update(){
    var y = window.scrollY;
    if(y <= 0){
      setHidden(false);
    } else if(y > lastY){
      setHidden(true);
    } else if(y < lastY){
      setHidden(false);
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  }, {passive:true});
})();
