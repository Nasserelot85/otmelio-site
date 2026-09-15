document.getElementById("year").textContent=new Date().getFullYear();

const officialBrandStyle=document.createElement("style");
officialBrandStyle.textContent=`
.brand-mark,.hero-logo svg{display:none!important}
.brand::before{content:"";width:42px;height:42px;flex:0 0 42px;background:url("/otmelio-mark.svg") center/contain no-repeat!important;border-radius:0!important}
.hero-logo{width:230px!important;height:230px;background:url("/otmelio-mark.svg") center/contain no-repeat!important}
.footer-brand::before{filter:brightness(0) invert(1);opacity:.96}
.service-home{padding:72px 0;background:#f8f9fa}.service-home-card{display:grid;grid-template-columns:1.35fr .65fr;gap:32px;align-items:center;background:#0B2545;color:#fff;border-radius:24px;padding:42px}.service-home-card h2{color:#fff;margin:10px 0 14px}.service-home-card p{line-height:1.7}.service-home-card .eyebrow{color:#D4AF7C}.service-home-flow{display:grid;gap:9px}.service-home-flow span{background:rgba(255,255,255,.09);padding:12px 14px;border-radius:10px;font-weight:600}.service-home-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}@media(max-width:760px){.service-home-card{grid-template-columns:1fr;padding:28px}}
`;
document.head.appendChild(officialBrandStyle);

const CAM_CCK_WEBHOOK="https://n8n-cqqr.srv1932573.hstgr.cloud/webhook/otmelio-cck-001-cta";
const buyButton=document.getElementById("buy-cck");
buyButton?.addEventListener("click",()=>{
  const params=new URLSearchParams(window.location.search);
  const timestamp=new Date().toISOString();
  const camEvent={event:"cck_cta_click",product_id:"CCK-001",source:"https://otmelio.com/",timestamp};
  const analyticsEvent={...camEvent,page:window.location.pathname,referrer:document.referrer||"direct",utm_source:params.get("utm_source")||"otmelio",medium:params.get("utm_medium")||"website",campaign:params.get("utm_campaign")||"cck_first_sale",destination:buyButton.href};
  window.dataLayer=window.dataLayer||[];window.dataLayer.push(analyticsEvent);
  try{const history=JSON.parse(localStorage.getItem("otmelio_cta_events")||"[]");history.push(analyticsEvent);localStorage.setItem("otmelio_cta_events",JSON.stringify(history.slice(-20)));}catch(_){}
  fetch(CAM_CCK_WEBHOOK,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(camEvent),keepalive:true,mode:"cors",credentials:"omit"}).catch(()=>{});
});

const ETSY={
  academic:"https://www.etsy.com/listing/4574449032/2026-2027-college-planner-printable-pdf",
  contractor:"https://www.etsy.com/listing/4573039452/contractor-job-costing-spreadsheet",
  plumbing:"https://www.etsy.com/listing/4574560483/plumbing-estimate-spreadsheet-plumber"
};

const productsContainer=document.querySelector('#products .container');
if(productsContainer && !document.getElementById('product-004')){
  const product004=document.createElement('article');
  product004.id='product-004';product004.className='product-card contractor-card';
  product004.innerHTML=`<div class="product-visual contractor-visual"><div class="product-badge">PRODUCT 004 • PLUMBING</div><div class="profit-mock"><div class="profit-title">PLUMBING PROFIT CONTROL</div><div class="profit-kpis"><b>PRICE BOOK</b><b>QUOTE</b><b>PROFIT</b></div><div class="profit-chart"><span></span><span></span><span></span><span></span></div><small>Estimate • Change Orders • Actual vs Estimate</small></div></div><div class="product-copy"><span class="eyebrow">For independent plumbers & small plumbing contractors</span><h3>Plumbing Quote, Price Book & Profit Control System</h3><p><strong>Price the plumbing job. Protect your margin. Know the real profit.</strong></p><ul><li>Editable plumbing price book for local supplier costs and labor assumptions</li><li>Target-margin estimating with margin-vs-markup guidance</li><li>Professional client quotation workflow</li><li>Approved-only change-order control</li><li>Estimated-vs-actual cost tracking</li><li>Final profit dashboard for each job</li></ul><div class="price-row"><div><small>One-time purchase</small><strong>$29</strong></div><a class="btn btn-primary" href="${ETSY.plumbing}" target="_blank" rel="noopener">Buy on Etsy</a></div><p class="product-note">Microsoft Excel digital workbook in English. Uses buyer-entered local costs and tax settings. No generic plumbing market prices are presented as facts.</p></div>`;
  const cck=document.querySelector('#buy-cck')?.closest('article');
  if(cck)productsContainer.insertBefore(product004,cck);else productsContainer.appendChild(product004);
}

// Replace stale marketplace status labels with the verified live Etsy listings.
const cards=[...document.querySelectorAll('#products article.product-card')];
const academic=cards.find(card=>card.textContent.includes('Academic Success System 2026–2027'));
const contractor=cards.find(card=>card.textContent.includes('Contractor Quote & Profit Control System'));
function setLiveEtsyButton(card,url){
  const status=card?.querySelector('.product003-status');
  if(!status)return;
  const link=document.createElement('a');link.className='btn btn-primary';link.href=url;link.target='_blank';link.rel='noopener';link.textContent='Buy on Etsy';status.replaceWith(link);
}
setLiveEtsyButton(academic,ETSY.academic);
setLiveEtsyButton(contractor,ETSY.contractor);

// Keep structured product offers aligned with the verified public sales destinations.
const structured=document.querySelector('script[type="application/ld+json"]');
if(structured){try{const data=JSON.parse(structured.textContent);const graph=data['@graph'];if(Array.isArray(graph)){for(const p of graph){if(p.name==='Academic Success System 2026–2027 — US College Edition'){p.offers={"@type":"Offer",url:ETSY.academic,priceCurrency:'USD',price:'9.99',availability:'https://schema.org/InStock'};}if(p.name==='Contractor Quote & Profit Control System'&&p.offers){p.offers.url=ETSY.contractor;}}graph.push({"@type":"Product",name:'Plumbing Quote, Price Book & Profit Control System',brand:{"@type":"Brand",name:'OTMELIO'},offers:{"@type":"Offer",url:ETSY.plumbing,priceCurrency:'USD',price:'29.00',availability:'https://schema.org/InStock'}});structured.textContent=JSON.stringify(data);}}catch(error){console.warn('OTMELIO structured data sync skipped',error);}}

if(location.pathname==='/'||location.pathname.endsWith('/index.html')){
  const products=document.getElementById('products');
  if(products&&!document.getElementById('hvac-service-home')){
    const service=document.createElement('section');service.id='hvac-service-home';service.className='service-home';
    service.innerHTML=`<div class="container"><div class="service-home-card"><div><span class="eyebrow">OTMELIO Business Automation • HVAC</span><h2>Recover missed HVAC leads before they go cold.</h2><p>Our HVAC Lead Recovery workflow follows up on missed opportunities, captures service type, ZIP code and urgency, and alerts your team with a qualified lead.</p><div class="service-home-actions"><a class="btn btn-gold" href="/hvac-lead-recovery.html">Explore HVAC Lead Recovery</a><a class="btn btn-secondary" href="mailto:contact@otmelio.com?subject=HVAC%20Lead%20Recovery%20Demo">Request Demo</a></div></div><div class="service-home-flow"><span>Missed Call</span><span>Fast Follow-Up</span><span>Lead Qualification</span><span>Team Alert</span><span>$199 Early Pilot Setup</span></div></div></div>`;
    products.parentNode.insertBefore(service,products);
  }
  const nav=document.querySelector('.site-header nav');if(nav&&!nav.querySelector('a[href="/hvac-lead-recovery.html"]')){const link=document.createElement('a');link.href='/hvac-lead-recovery.html';link.textContent='Services';nav.insertBefore(link,nav.firstChild);}
}
