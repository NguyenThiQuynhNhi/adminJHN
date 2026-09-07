(() => {
  'use strict';
  const homeFile = 'yuushi_homepage_standalone.html';
  const pageTitles = {
    'support_landing.html':'Support Services',
    'supportal_directory.html':'Find a Provider',
    'supportal_profile.html':'Provider Profile',
    'supportal_request_form.html':'Request a Service',
    'supportal_matching_result.html':'Matching Providers',
    'customer-billing-payments.html':'Billing & Payments',
    'customer-plans.html':'Plans'
  };
  const frame = document.getElementById('clientContentFrame');
  const menu = document.getElementById('accountMenu');
  const toggle = document.getElementById('profileToggle');
  let signedIn = false;
  try { signedIn = sessionStorage.getItem('yuushi.client.previewSignedIn') === 'true'; } catch {}
  function closeProfile() { menu.hidden = true; toggle.setAttribute('aria-expanded','false'); }
  function updateAccount() {
    document.body.classList.toggle('cp-signed-in',signedIn);
    document.getElementById('clientGuestActions').hidden = signedIn;
    document.getElementById('clientAccountActions').hidden = !signedIn;
    closeProfile();
  }
  // This static prototype changes the header only; no authentication request is made.
  window.clientLogin = () => {
    signedIn = true;
    try { sessionStorage.setItem('yuushi.client.previewSignedIn','true'); } catch {}
    updateAccount();
    menu.hidden = false;
    toggle.setAttribute('aria-expanded','true');
    toggle.focus();
    frame.contentWindow?.postMessage({type:'client-account-state',signedIn},location.origin === 'null' ? '*' : location.origin);
  };
  window.clientIsSignedIn = () => signedIn;
  function renderRoute() {
    const url = new URL(location.href);
    const page = url.searchParams.get('page');
    const validPage = Object.hasOwn(pageTitles,page);
    const isSupportPage = validPage && page.startsWith('support');
    document.getElementById('clientHomeContent').hidden = validPage;
    document.getElementById('clientContent').hidden = !validPage;
    document.body.classList.toggle('cp-content-view',validPage);
    document.getElementById('clientSupportNav').hidden = !isSupportPage;
    closeProfile();
    document.querySelectorAll('.cp-insights').forEach(el=>el.open=false);
    if (validPage) {
      const content = new URL(page,location.href);
      url.searchParams.forEach((value,key)=>{ if(key !== 'page') content.searchParams.append(key,value); });
      content.hash = url.hash;
      if(frame.getAttribute('src') !== content.href) { frame.style.height='800px'; frame.src=content.href; }
      frame.title = pageTitles[page];
      document.title = pageTitles[page]+' — YUUSHI';
    } else {
      if(frame.getAttribute('src') !== 'about:blank') frame.src='about:blank';
      document.title = 'YUUSHI — Homepage';
      if(url.hash) requestAnimationFrame(()=>document.getElementById(url.hash.slice(1))?.scrollIntoView());
    }
    const active = validPage ? isSupportPage ? 'support' : '' : url.hash.slice(1) || 'home';
    document.querySelectorAll('[data-main-nav]').forEach(a=> {
      if(a.dataset.mainNav===active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('.cp-content-nav a, .cp-account-menu a').forEach(a=> {
      const target = new URL(a.href);
      const match = target.search === url.search;
      if(match) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
  }
  window.clientNavigate = href => {
    const destination = new URL(href,location.href);
    if(destination.origin !== location.origin) return;
    const file = destination.pathname.split('/').pop();
    let route;
    if(file === homeFile) route=destination;
    else if(Object.hasOwn(pageTitles,file)) {
      route=new URL(homeFile,location.href);
      route.search=destination.search;
      route.searchParams.set('page',file);
      route.hash=destination.hash;
    } else return;
    if(route.href!==location.href) history.pushState(null,'',route);
    renderRoute();
    if(!route.hash) window.scrollTo({top:0});
  };
  document.addEventListener('click',event=> {
    if(event.target.closest('[data-client-login]')) { event.preventDefault(); window.clientLogin(); return; }
    const link=event.target.closest('a[href]');
    if(link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && !link.target && !link.hasAttribute('download')) {
      const url=new URL(link.href);
      if(url.origin===location.origin && url.pathname.split('/').pop()===homeFile) {
        event.preventDefault(); window.clientNavigate(url.href);
      }
    }
    if(!event.target.closest('.cp-profile-wrap')) closeProfile();
    if(!event.target.closest('.cp-insights')) document.querySelectorAll('.cp-insights').forEach(el=>el.open=false);
  });
  toggle.addEventListener('click',()=> { menu.hidden=!menu.hidden; toggle.setAttribute('aria-expanded',String(!menu.hidden)); });
  document.getElementById('clientLogout').addEventListener('click',()=> {
    signedIn=false;
    try { sessionStorage.removeItem('yuushi.client.previewSignedIn'); } catch {}
    updateAccount(); window.clientNavigate(homeFile);
  });
  document.addEventListener('keydown',event=> { if(event.key==='Escape') { const wasOpen=!menu.hidden; closeProfile(); if(wasOpen) toggle.focus(); document.querySelectorAll('.cp-insights').forEach(el=>el.open=false); } });
  window.addEventListener('message',event=> {
    if(event.source!==frame.contentWindow || event.origin!==location.origin) return;
    if(event.data?.type==='client-content-interaction') { closeProfile(); document.querySelectorAll('.cp-insights').forEach(el=>el.open=false); }
    if(event.data?.type==='client-content-height' && Number.isFinite(event.data.height)) frame.style.height=Math.max(420,Math.min(event.data.height,30000))+'px';
  });
  window.addEventListener('popstate',renderRoute);
  window.addEventListener('hashchange',renderRoute);
  const calculator=document.getElementById('clientMortgageDialog');
  document.getElementById('clientMortgageOpen').addEventListener('click',()=>calculator.showModal());
  document.getElementById('clientMortgageForm').addEventListener('submit',event=> {
    event.preventDefault();
    const amount=Number(document.getElementById('mortgageAmount').value);
    const rate=Number(document.getElementById('mortgageRate').value)/1200;
    const months=Number(document.getElementById('mortgageYears').value)*12;
    const payment=rate===0?amount/months:amount*rate/(1-Math.pow(1+rate,-months));
    document.getElementById('mortgageResult').textContent=new Intl.NumberFormat('en-US',{style:'currency',currency:'JPY',maximumFractionDigits:0}).format(payment)+' / month';
  });
  updateAccount(); renderRoute();
})();
