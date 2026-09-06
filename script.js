document.getElementById("year").textContent=new Date().getFullYear();

// Complete the Product JSON-LD with a crawlable product image and item condition.
// Google renders JavaScript-generated Product structured data before rich-result extraction.
const productStructuredData=document.querySelector('script[type="application/ld+json"]');
if(productStructuredData){
  try{
    const product=JSON.parse(productStructuredData.textContent);
    if(product?.["@type"]==="Product"){
      product.image=["https://otmelio.com/cck-product-preview.svg"];
      if(product.offers?.["@type"]==="Offer"){
        product.offers.itemCondition="https://schema.org/NewCondition";
      }
      productStructuredData.textContent=JSON.stringify(product);
    }
  }catch(error){
    console.warn("OTMELIO structured data enhancement skipped",error);
  }
}

const CAM_CCK_WEBHOOK="https://n8n-cqqr.srv1932573.hstgr.cloud/webhook/otmelio-cck-001-cta";
const buyButton=document.getElementById("buy-cck");
if(buyButton?.dataset.placeholder==="true"){
  buyButton.title="Add the public Gumroad URL before publishing";
}

buyButton?.addEventListener("click",()=>{
  const params=new URLSearchParams(window.location.search);
  const timestamp=new Date().toISOString();
  const camEvent={
    event:"cck_cta_click",
    product_id:"CCK-001",
    source:"https://otmelio.com/",
    timestamp
  };
  const analyticsEvent={
    ...camEvent,
    page:window.location.pathname,
    referrer:document.referrer||"direct",
    utm_source:params.get("utm_source")||"otmelio",
    medium:params.get("utm_medium")||"website",
    campaign:params.get("utm_campaign")||"cck_first_sale",
    destination:buyButton.href
  };

  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push(analyticsEvent);
  try{
    const history=JSON.parse(localStorage.getItem("otmelio_cta_events")||"[]");
    history.push(analyticsEvent);
    localStorage.setItem("otmelio_cta_events",JSON.stringify(history.slice(-20)));
  }catch(_){}
  window.dispatchEvent(new CustomEvent("otmelio:cck-cta-click",{detail:analyticsEvent}));

  // Send only the minimal event CAM needs. keepalive lets the request finish while Gumroad opens.
  fetch(CAM_CCK_WEBHOOK,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(camEvent),
    keepalive:true,
    mode:"cors",
    credentials:"omit"
  }).catch(()=>{});
});
