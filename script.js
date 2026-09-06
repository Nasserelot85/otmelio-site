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

const buyButton=document.getElementById("buy-cck");if(buyButton?.dataset.placeholder==="true"){buyButton.title="Add the public Gumroad URL before publishing";}buyButton?.addEventListener("click",()=>{const params=new URLSearchParams(window.location.search);const event={event:"cck_cta_click",product_id:"CCK-001",timestamp:new Date().toISOString(),page:window.location.pathname,referrer:document.referrer||"direct",source:params.get("utm_source")||"otmelio",medium:params.get("utm_medium")||"website",campaign:params.get("utm_campaign")||"cck_first_sale",destination:buyButton.href};window.dataLayer=window.dataLayer||[];window.dataLayer.push(event);try{const history=JSON.parse(localStorage.getItem("otmelio_cta_events")||"[]");history.push(event);localStorage.setItem("otmelio_cta_events",JSON.stringify(history.slice(-20)));}catch(_){}window.dispatchEvent(new CustomEvent("otmelio:cck-cta-click",{detail:event}));});
