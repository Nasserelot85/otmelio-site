document.getElementById("year").textContent=new Date().getFullYear();

// Official OTMELIO brand identity: midnight-blue O with champagne-gold sweep and star.
const officialBrandStyle=document.createElement("style");
officialBrandStyle.textContent=`
.brand-mark,.hero-logo svg{display:none!important}
.brand::before{content:"";width:42px;height:42px;flex:0 0 42px;background:url("/otmelio-mark.svg") center/contain no-repeat!important;border-radius:0!important}
.hero-logo{width:230px!important;height:230px;background:url("/otmelio-mark.svg") center/contain no-repeat!important}
.footer-brand::before{filter:brightness(0) invert(1);opacity:.96}
.service-home{padding:72px 0;background:#f8f9fa}.service-home-card{display:grid;grid-template-columns:1.35fr .65fr;gap:32px;align-items:center;background:#0B2545;color:#fff;border-radius:24px;padding:42px}.service-home-card h2{color:#fff;margin:10px 0 14px}.service-home-card p{line-height:1.7}.service-home-card .eyebrow{color:#D4AF7C}.service-home-flow{display:grid;gap:9px}.service-home-flow span{background:rgba(255,255,255,.09);padding:12px 14px;border-radius:10px;font-weight:600}.service-home-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}@media(max-width:760px){.service-home-card{grid-template-columns:1fr;padding:28px}}
`;
document.head.appendChild(officialBrandStyle);

// Complete the Product JSON-LD with a crawlable product image and item condition.
const productStructuredData=document.querySelector('script[type="application/ld+json"]');
if(productStructuredData){
  try{
    const product=JSON.parse(productStructuredData.textContent);
    if(product?.["@type"]==="Product"){
      product.image=["https://otmelio.com/cck-product-preview.svg"];
      if(product.offers?.["@type"]==="Offer") product.offers.itemCondition="https://schema.org/NewCondition";
      productStructuredData.textContent=JSON.stringify(product);
    }
  }catch(error){console.warn("OTMELIO structured data enhancement skipped",error);}
}

const CAM_CCK_WEBHOOK="https://n8n-cqqr.srv1932573.hstgr.cloud/webhook/otmelio-cck-001-cta";
const buyButton=document.getElementById("buy-cck");
if(buyButton?.dataset.placeholder==="true") buyButton.title="Add the public Gumroad URL before publishing";
buyButton?.addEventListener("click",()=>{
  const params=new URLSearchParams(window.location.search);
  const timestamp=new Date().toISOString();
  const camEvent={event:"cck_cta_click",product_id:"CCK-001",source:"https://otmelio.com/",timestamp};
  const analyticsEvent={...camEvent,page:window.location.pathname,referrer:document.referrer||"direct",utm_source:params.get("utm_source")||"otmelio",medium:params.get("utm_medium")||"website",campaign:params.get("utm_campaign")||"cck_first_sale",destination:buyButton.href};
  window.dataLayer=window.dataLayer||[]; window.dataLayer.push(analyticsEvent);
  try{const history=JSON.parse(localStorage.getItem("otmelio_cta_events")||"[]");history.push(analyticsEvent);localStorage.setItem("otmelio_cta_events",JSON.stringify(history.slice(-20)));}catch(_){}
  window.dispatchEvent(new CustomEvent("otmelio:cck-cta-click",{detail:analyticsEvent}));
  fetch(CAM_CCK_WEBHOOK,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(camEvent),keepalive:true,mode:"cors",credentials:"omit"}).catch(()=>{});
});

// Product 004: add as a separate catalog item. No fake checkout link is created.
const productsContainer=document.querySelector('#products .container');
if(productsContainer && !document.getElementById('product-004')){
  const product004=document.createElement('article');
  product004.id='product-004';
  product004.className='product-card contractor-card';
  product004.innerHTML=`<div class="product-visual contractor-visual"><div class="product-badge">PRODUCT 004 • PLUMBING</div><div class="profit-mock"><div class="profit-title">PLUMBING PROFIT CONTROL</div><div class="profit-kpis"><b>PRICE BOOK</b><b>QUOTE</b><b>PROFIT</b></div><div class="profit-chart"><span></span><span></span><span></span><span></span></div><small>Estimate • Change Orders • Actual vs Estimate</small></div></div><div class="product-copy"><span class="eyebrow">For independent plumbers & small plumbing contractors</span><h3>Plumbing Quote, Price Book & Profit Control System</h3><p><strong>Price the plumbing job. Protect your margin. Know the real profit.</strong></p><ul><li>Editable plumbing price book for local supplier costs and labor assumptions</li><li>Target-margin estimating with margin-vs-markup guidance</li><li>Professional client quotation workflow</li><li>Approved-only change-order control</li><li>Estimated-vs-actual cost tracking</li><li>Final profit dashboard for each job</li></ul><div class="price-row"><div><small>Recommended one-time price</small><strong>$29</strong></div><span class="btn btn-secondary product003-status" aria-label="Product 004 sales page is being prepared">Sales page in preparation</span></div><p class="product-note">Microsoft Excel digital workbook in English. Uses buyer-entered local costs and tax settings. No generic plumbing market prices are presented as facts.</p></div>`;
  const cck=document.querySelector('#buy-cck')?.closest('article');
  if(cck) productsContainer.insertBefore(product004,cck); else productsContainer.appendChild(product004);
}

// Promote OTMELIO's first B2B automation service on the homepage without removing existing products.
if(location.pathname==='/' || location.pathname.endsWith('/index.html')){
  const products=document.getElementById('products');
  if(products && !document.getElementById('hvac-service-home')){
    const service=document.createElement('section');
    service.id='hvac-service-home'; service.className='service-home';
    service.innerHTML=`<div class="container"><div class="service-home-card"><div><span class="eyebrow">OTMELIO Business Automation • HVAC</span><h2>Recover missed HVAC leads before they go cold.</h2><p>Our HVAC Lead Recovery workflow follows up on missed opportunities, captures service type, ZIP code and urgency, and alerts your team with a qualified lead.</p><div class="service-home-actions"><a class="btn btn-gold" href="/hvac-lead-recovery.html">Explore HVAC Lead Recovery</a><a class="btn btn-secondary" href="mailto:contact@otmelio.com?subject=HVAC%20Lead%20Recovery%20Demo">Request Demo</a></div></div><div class="service-home-flow"><span>Missed Call</span><span>Fast Follow-Up</span><span>Lead Qualification</span><span>Team Alert</span><span>$199 Early Pilot Setup</span></div></div></div>`;
    products.parentNode.insertBefore(service,products);
  }
  const nav=document.querySelector('.site-header nav');
  if(nav && !nav.querySelector('a[href="/hvac-lead-recovery.html"]')){
    const link=document.createElement('a'); link.href='/hvac-lead-recovery.html'; link.textContent='Services'; nav.insertBefore(link,nav.firstChild);
  }
}
