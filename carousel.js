// Case-study photo carousel: shows two photos at a time (one on phones) and
// slides one step every 5 seconds. The last slot repeats the first photo so
// the loop can jump back to the start invisibly. Skipped entirely for
// visitors who prefer reduced motion.
(function(){
  var track = document.getElementById('carousel-track');
  if(!track) return;
  var slots = track.children.length;
  var real = slots - 1;
  var index = 0;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced) return;

  function stepWidth(){
    var first = track.children[0];
    var rect = first.getBoundingClientRect();
    var gap = parseFloat(getComputedStyle(track).gap) || 0;
    return rect.width + gap;
  }

  function advance(){
    index++;
    track.style.transition = 'transform .7s cubic-bezier(.65,0,.35,1)';
    track.style.transform = 'translateX(-' + (stepWidth() * index) + 'px)';
    if(index === real){
      setTimeout(function(){
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        index = 0;
      }, 720);
    }
  }

  setInterval(advance, 5000);
})();
