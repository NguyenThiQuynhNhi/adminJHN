(() => {
  'use strict';
  const homeFile='yuushi_homepage_standalone.html';
  const contentFiles=new Set(['client-myprofile.html','customer-profile.html','support_landing.html','supportal_directory.html','supportal_profile.html','supportal_request_form.html','supportal_matching_result.html','customer-billing-payments.html','customer-plans.html']);
  if(window.top === window) {
    const route=new URL(homeFile,location.href);
    route.search=location.search;
    route.searchParams.set('page',location.pathname.split('/').pop());
    route.hash=location.hash;
    location.replace(route.href);
    return;
  }
  function routeTo(href) {
    if(typeof parent.clientNavigate==='function') parent.clientNavigate(href);
  }
  document.addEventListener('click',event=> {
    parent.postMessage({type:'client-content-interaction'},location.origin==='null'?'*':location.origin);
    if(event.target.closest('[data-client-login]')) { event.preventDefault(); parent.clientLogin?.(); return; }
    const link=event.target.closest('a[href]');
    if(!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hasAttribute('download') || link.target) return;
    const url=new URL(link.href);
    const file=url.pathname.split('/').pop();
    if(url.origin===location.origin && (contentFiles.has(file) || file===homeFile)) {
      event.preventDefault(); routeTo(url.href);
    }
  });
  document.addEventListener('submit',event=> {
    const form=event.target;
    const destination=new URL(form.action || location.href);
    if(form.method.toLowerCase()!=='get' || !contentFiles.has(destination.pathname.split('/').pop())) return;
    event.preventDefault();
    new FormData(form).forEach((value,key)=> { if(typeof value==='string') destination.searchParams.append(key,value); });
    routeTo(destination.href);
  });
  // Keep search filters visible after navigation or refreshing the shell URL.
  const params=new URLSearchParams(location.search);
  document.querySelectorAll('form [name]').forEach(input=> {
    if(params.has(input.name) && ['SELECT','INPUT'].includes(input.tagName) && !['checkbox','radio','file'].includes(input.type)) input.value=params.get(input.name);
  });
  document.addEventListener('keydown',event=> {
    if(event.key==='Escape') parent.postMessage({type:'client-content-interaction'},location.origin==='null'?'*':location.origin);
  });
  let lastHeight=0;
  const resize=()=> {
    const style=getComputedStyle(document.body);
    const height=Math.ceil(document.body.getBoundingClientRect().height+(parseFloat(style.marginTop)||0)+(parseFloat(style.marginBottom)||0));
    if(height!==lastHeight) { lastHeight=height; parent.postMessage({type:'client-content-height',height},location.origin==='null'?'*':location.origin); }
  };
  new ResizeObserver(resize).observe(document.body);
  window.addEventListener('load',resize);
  resize();
})();
