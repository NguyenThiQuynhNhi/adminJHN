/* Run in seo-management.html: fetch('tests/seo-management.test.js').then(r=>r.text()).then(eval)
 * Restores localStorage after exercising the actual forms; reload afterward.
 */
(async () => {
  const checks=[];
  const assert=(ok,name)=>{if(!ok)throw new Error(name);checks.push(name);};
  const snapshot=Object.fromEntries(Object.values(SEO.keys).map(k=>[k,localStorage.getItem(k)]));
  try {
    const subtypes=['areaGuide','article','news','faq'];
    assert(JSON.stringify(Object.keys(SEO.types).filter(k=>SEO.types[k].group==='Insight'))===JSON.stringify(subtypes),'Exactly four fixed Insight subtypes');
    assert(!SEO.types.insight&&!document.body.textContent.includes('Add Insight Type'),'No generic configuration or type builder');
    assert(SEO.types.faq.vars.includes('question')&&SEO.types.faq.vars.includes('answer')&&!SEO.types.faq.vars.includes('title'),'FAQ source variables');
    assert(SEO.types.areaGuide.vars.includes('prefecture')&&SEO.types.areaGuide.vars.includes('introDescription'),'Area Guide source variables');
    assert(!SEO.types.news.vars.includes('publishedDate')&&SEO.types.news.vars.includes('shortDescription'),'No invented News date field');
    const before=SEO.configs;
    for(const type of subtypes){
      document.querySelector(`[data-tab="${type}"]`).click();
      const form=document.getElementById('settings');
      for(const name of ['title','description','keywords','ogTitle','ogDescription','image','canonicalOverride','canonical','indexing'])assert(!!form.elements.namedItem(name),`${type}: ${name} control`);
      assert(document.getElementById('preview').textContent.includes('Search Preview')&&document.getElementById('preview').textContent.includes('Social Preview'),`${type}: both previews`);
      const title=form.elements.namedItem('title');title.value=`${type} independent`;
      form.dispatchEvent(new Event('input',{bubbles:true}));form.requestSubmit();
      assert(JSON.parse(localStorage.getItem(SEO.keys[type])).title===`${type} independent`,`${type}: independent persistence`);
      for(const other of subtypes.filter(k=>k!==type))assert(SEO.configs[other].title===(subtypes.indexOf(other)<subtypes.indexOf(type)?`${other} independent`:before[other].title),`${type}: does not overwrite ${other}`);
    }
    const faq=SEO.records.find(r=>r.type==='faq'),config={...SEO.configs.faq,title:'{question}',description:'{answer}',keywords:'{question}',ogTitleMode:'custom',ogTitle:'FAQ {question}',ogDescriptionMode:'custom',ogDescription:'{answer}',canonicalOverride:true,canonical:'https://example.com/faq',indexing:'Noindex, Follow'};
    const g={...SEO.global,siteName:'Global title',description:'Global description',indexing:'Index, Follow'};
    const resolved=SEO.resolve(faq,config,g,{});
    assert(resolved.title.includes(faq.values.question)&&resolved.description===faq.values.answer,'FAQ resolves its own source fields');
    assert(resolved.canonical===config.canonical&&resolved.indexing===config.indexing,'Subtype canonical and indexing');
    const override={type:'faq',title:'Page title',description:'Page description',keywords:'Page keywords',ogTitle:'Page OG',ogDescription:'Page OG description',image:'https://example.com/page.png',canonical:'https://example.com/page',indexing:'Index, Follow'};
    const page=SEO.resolve(faq,config,g,override);
    assert(Object.keys(override).filter(k=>k!=='type').every(k=>page[k]===override[k]),'Individual override wins for every SEO field');
    assert(SEO.resolve(faq,config,g,{...override,type:'article'}).title===resolved.title,'Wrong subtype override cannot bleed into FAQ');
    const fallback=SEO.resolve(faq,{...config,title:'{title}',description:'{publishedDate}',ogTitle:'',ogDescription:'',canonicalOverride:false,indexing:'inherit'},g,{});
    assert(fallback.title===g.siteName&&fallback.description===g.description&&fallback.image===g.image&&fallback.indexing===g.indexing,'Unsupported or missing source fields use Global defaults');
    assert(SEO.template('{question}',{...faq,values:{answer:'Only an answer'}})==='','Missing FAQ field falls back instead of inventing title');
    const article=SEO.records.find(r=>r.type==='article');
    const bodyRecord={...article,values:{...article.values,contentBody:'<p>Body text</p><img src="https://example.com/body.jpg">'}};
    assert(SEO.resolve(bodyRecord,{...SEO.configs.article,image:'Article Body Image'},g,{}).image==='https://example.com/body.jpg','Existing rich-text body image source');
    assert(SEO.template('{contentBody}',bodyRecord)==='Body text','Body template strips markup');
    document.querySelector(`[data-override="${faq.id}"]`).click();
    const form=document.getElementById('overrideForm');form.elements.namedItem('title').value='FAQ individual';form.requestSubmit();
    assert(JSON.parse(localStorage.getItem(SEO.keys.overrides))[faq.id].type==='faq','Saved page override preserves subtype identity');
    assert(SEO.resolve(faq).title==='FAQ individual'&&SEO.resolve(article).title!=='FAQ individual','Page override isolation');
    return {passed:checks.length,checks};
  } finally {
    for(const [key,value] of Object.entries(snapshot))if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);
  }
})()
