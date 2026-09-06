document.getElementById("year").textContent=new Date().getFullYear();

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

const CAM_CTA_WEBHOOK="https://n8n-cqqr.srv1932573.hstgr.cloud/webhook/otmelio-cck-001-cta";
const buyButton=document.getElementById("buy-cck");
if(buyButton?.dataset.placeholder==="true") buyButton.title="Add the public Gumroad URL before publishing";

buyButton?.addEventListener("click",()=>{
  const params=new URLSearchParams(window.location.search);
  const event={
    event:"cck_cta_click",
    product_id:"CCK-001",
    source:"https://otmelio.com/",
    timestamp:new Date().toISOString(),
    page:window.location.pathname,
    referrer:document.referrer||"direct",
    medium:params.get("utm_medium")||"website",
    campaign:params.get("utm_campaign")||"cck_first_sale",
    destination:buyButton.href
  };

  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push(event);
  try{
    const history=JSON.parse(localStorage.getItem("otmelio_cta_events")||"[]");
    history.push(event);
    localStorage.setItem("otmelio_cta_events",JSON.stringify(history.slice(-20)));
  }catch(_){}
  window.dispatchEvent(new CustomEvent("otmelio:cck-cta-click",{detail:event}));

  // Fire-and-forget measurement must never block the Gumroad purchase navigation.
  try{
    fetch(CAM_CTA_WEBHOOK,{
      method:"POST",
      mode:"cors",
      keepalive:true,
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(event)
    }).catch(()=>{});
  }catch(_){}
});
