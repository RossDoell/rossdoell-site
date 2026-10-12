(function(){
  var toggle = document.getElementById('menu-toggle');
  var panel = document.getElementById('mobile-nav');
  var closeBtn = document.getElementById('mobile-nav-close');
  var sourceLinks = document.querySelector('nav.links');
  var panelLinks = panel && panel.querySelector('.mobile-nav-links');
  if(!toggle || !panel || !sourceLinks || !panelLinks) return;

  // build the overlay's links from the real nav rather than duplicating the
  // link list (and which one is "current") in markup on every page
  Array.prototype.forEach.call(sourceLinks.querySelectorAll('a'), function(a){
    panelLinks.appendChild(a.cloneNode(true));
  });

  var lastFocus = null;

  function open(){
    lastFocus = document.activeElement;
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var first = panelLinks.querySelector('a');
    if(first){ first.focus(); }
    document.addEventListener('keydown', onKeydown);
  }

  function close(){
    if(panel.hidden) return;
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    if(lastFocus && lastFocus.focus){ lastFocus.focus(); }
  }

  function onKeydown(e){
    if(e.key === 'Escape'){ close(); }
  }

  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  panelLinks.addEventListener('click', function(e){
    if(e.target.tagName === 'A'){ close(); }
  });

  // if a resize carries the viewport back past the breakpoint while the
  // overlay is open (e.g. rotating a tablet, or a desktop window growing),
  // close it rather than leaving it stuck open over the now-roomy header
  var mq = window.matchMedia('(max-width:560px)');
  function handleBreakpointChange(e){ if(!e.matches){ close(); } }
  if(mq.addEventListener){ mq.addEventListener('change', handleBreakpointChange); }
  else if(mq.addListener){ mq.addListener(handleBreakpointChange); }
})();
