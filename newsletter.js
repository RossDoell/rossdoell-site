// Footer newsletter signup → MailerLite ("Website footer" embedded form,
// which adds subscribers to the Newsletter group). This posts the same
// fields MailerLite's own embed code sends, but keeps the site's footer
// design instead of MailerLite's widget. The endpoint allows cross-origin
// requests and replies with JSON: {success:true} or
// {success:false, errors:{fields:{email:[...]}}}. Double opt-in is on, so
// a new subscriber is only added once they click the confirmation email.
// If MailerLite can't be reached, the visitor gets a mailto link to
// info@rossdoell.com instead, so the signup isn't lost.
(function(){
  var ENDPOINT = 'https://assets.mailerlite.com/jsonp/2704859/forms/201098625792607567/subscribe';
  var FALLBACK_TO = 'info@rossdoell.com';

  var form = document.getElementById('news-form');
  var status = document.getElementById('news-status');
  if(!form || !status) return;
  var input = form.querySelector('.news-input');
  var btn = form.querySelector('.news-submit');

  function fallback(email){
    status.textContent = "We couldn't sign you up just now. ";
    var a = document.createElement('a');
    a.href = 'mailto:' + FALLBACK_TO + '?subject=' + encodeURIComponent('Newsletter signup') + '&body=' + encodeURIComponent('Please add ' + email + ' to the newsletter.');
    a.textContent = 'Email us to join instead.';
    status.appendChild(a);
  }

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    var email = input.value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      status.textContent = 'Please enter a valid email address.';
      input.focus();
      return;
    }
    btn.disabled = true;
    status.textContent = 'Signing you up…';

    // url-encoded body keeps this a "simple" request (no CORS preflight)
    var body = new URLSearchParams();
    body.set('fields[email]', email);
    body.set('ml-submit', '1');
    body.set('anticsrf', 'true');

    var res, data;
    try {
      res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json' }, body: body });
      data = await res.json();
    } catch(err) {
      fallback(email);
      btn.disabled = false;
      return;
    }
    btn.disabled = false;
    if(data && data.success){
      form.reset();
      status.textContent = 'Almost done: check your inbox to confirm your subscription.';
    } else if(data && data.errors && data.errors.fields && data.errors.fields.email){
      status.textContent = 'Please enter a valid email address.';
      input.focus();
    } else {
      fallback(email);
    }
  });
})();
