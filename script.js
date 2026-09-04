document.getElementById("year").textContent = new Date().getFullYear();

const buyButton = document.getElementById("buy-cck");
if (buyButton?.dataset.placeholder === "true") {
  buyButton.title = "Add the public Gumroad URL before publishing";
}
