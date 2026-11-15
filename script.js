const products = [
  {id:1,name:"Forest Heritage",club:"Classic Edit",category:"Retro",price:2450,tag:"FAN FAVOURITE",shirt:"#174b37",trim:"#d8b65f",detail:"#0c3024",note:"A timeless green classic."},
  {id:2,name:"Rosso Revival",club:"Archive Collection",category:"Retro",price:2650,tag:"RETRO PICK",shirt:"#a51f2b",trim:"#f0e7d5",detail:"#7c1721",note:"A bold red from the archives."},
  {id:3,name:"Royal Blue",club:"Club Collection",category:"Club",price:2350,tag:"BEST SELLER",shirt:"#164b91",trim:"#f5f0df",detail:"#0c2e5c",note:"Blue that speaks for itself."},
  {id:4,name:"Midnight Navy",club:"Club Collection",category:"Club",price:2550,tag:"NEW ARRIVAL",shirt:"#172b4c",trim:"#d8b65f",detail:"#0c1a31",note:"For the nights under the lights."},
  {id:5,name:"Three Lions White",club:"National Collection",category:"National",price:2500,tag:"NATIONAL",shirt:"#eee9dc",trim:"#24436a",detail:"#d7d1c3",note:"A clean, classic match-day look."},
  {id:6,name:"Azzurri Blue",club:"National Collection",category:"National",price:2550,tag:"FAN FAVOURITE",shirt:"#1762a5",trim:"#e8cf73",detail:"#104779",note:"Inspired by Italian football style."},
  {id:7,name:"Golden Selecao",club:"National Collection",category:"National",price:2600,tag:"LIMITED FEEL",shirt:"#e4bd28",trim:"#1c5039",detail:"#c79c15",note:"A bright shirt for big moments."},
  {id:8,name:"Classic Stripes",club:"Archive Collection",category:"Retro",price:2750,tag:"ARCHIVE",shirt:"#f1eee5",trim:"#202c42",detail:"#b8c5cf",note:"A vintage-inspired striped look."}
];
const money = n => "৳" + n.toLocaleString("en-BD");
const grid = document.getElementById("productGrid");
const cart = new Map();
let activeFilter = "All";
let searchTerm = "";

function shirtMarkup(p, extraClass="") {
  return `<div class="product-shirt ${extraClass}" style="--shirt:${p.shirt};--trim:${p.trim};--shirt2:${p.detail}">
    <svg viewBox="0 0 240 260" role="img" aria-label="${p.name} football shirt">
      <path d="M70 25 96 13q24 18 48 0l26 12 55 38-24 48-31-17v150H70V94l-31 17-24-48Z" fill="${p.shirt}" stroke="rgba(20,30,24,.3)" stroke-width="2"/>
      <path d="M70 25 96 13q24 18 48 0l26 12-19 37H89Z" fill="${p.detail}"/>
      <path d="M96 13q24 26 48 0l-9 30h-30Z" fill="${p.trim}" stroke="rgba(255,255,255,.5)" stroke-width="2"/>
      <path d="M89 65h7v179h-7zm55 0h7v179h-7z" fill="${p.trim}" opacity=".72"/>
      <path d="m120 81 9 6-4 12h-10l-4-12Z" fill="${p.trim}" stroke="rgba(255,255,255,.7)" stroke-width="1.5"/>
      <text x="120" y="145" text-anchor="middle" font-family="Arial" font-size="30" font-weight="800" fill="rgba(255,255,255,.88)">10</text>
      ${p.id===8?'<path d="M70 108h100M70 123h100M70 138h100" stroke="#263d31" stroke-width="5" opacity=".7"/>':''}
    </svg></div>`;
}
function renderProducts(){
  let list = products.filter(p => (activeFilter==="All" || p.category===activeFilter) && (p.name+" "+p.club+" "+p.category).toLowerCase().includes(searchTerm));
  const sort = document.getElementById("sortSelect").value;
  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);
  grid.innerHTML = list.map(p=>`<article class="product-card">
    <div class="product-visual"><span class="product-tag">${p.tag}</span>${shirtMarkup(p)}<button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button></div>
    <div class="product-meta"><span class="product-category">${p.category.toUpperCase()} / ${p.club.toUpperCase()}</span><div class="product-name-row"><h3 class="product-name">${p.name}</h3><span class="product-price">${money(p.price)}</span></div><p class="product-note">${p.note}</p></div>
  </article>`).join("");
  document.getElementById("shownCount").textContent=String(list.length).padStart(2,"0");
  document.getElementById("noResults").hidden=list.length!==0;
  document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeFilter));
}
function cartQuantity(){return [...cart.values()].reduce((s,x)=>s+x.qty,0)}
function updateCart(){
  const count=cartQuantity();
  document.getElementById("cartCount").textContent=count;
  document.getElementById("drawerCount").textContent=`(${count})`;
  document.getElementById("cartSubtotal").textContent=money([...cart.values()].reduce((s,x)=>s+x.product.price*x.qty,0));
  const root=document.getElementById("cartItems");
  if(!count){root.innerHTML=`<div class="empty-bag"><span>✳</span><h3>YOUR BAG IS EMPTY</h3><p>Looks like you haven't found your classic yet.</p><button class="btn btn-dark" id="continueShopping">EXPLORE KITS ↗</button></div>`;document.getElementById("continueShopping").onclick=closeCart;return;}
  root.innerHTML=[...cart.values()].map(({product:p,qty})=>`<div class="cart-row"><div class="cart-thumb">${shirtMarkup(p)}</div><div><h4>${p.name}</h4><p>${p.category} • ${money(p.price)}</p><div class="qty-control"><button data-qty="${p.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="${p.id}" data-change="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${p.id}">REMOVE</button></div>`).join("");
}
function addToCart(id){const p=products.find(x=>x.id===id);const row=cart.get(id)||{product:p,qty:0};row.qty++;cart.set(id,row);updateCart();showToast(`${p.name} added to your bag`);}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","true");document.body.style.overflow="";}
let toastTimer;
function showToast(message){const t=document.getElementById("toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2400);}

grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add));});
document.getElementById("filters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;renderProducts();});
document.getElementById("productSearch").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();renderProducts();});
document.getElementById("sortSelect").addEventListener("change",renderProducts);
document.querySelectorAll("[data-filter-link]").forEach(a=>a.addEventListener("click",()=>{activeFilter=a.dataset.filterLink;renderProducts();}));
document.getElementById("cartToggle").onclick=openCart;
document.getElementById("cartClose").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
document.getElementById("cartItems").addEventListener("click",e=>{
  const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");
  if(q){const id=Number(q.dataset.qty),row=cart.get(id);row.qty+=Number(q.dataset.change);if(row.qty<=0)cart.delete(id);updateCart();}
  if(r){cart.delete(Number(r.dataset.remove));updateCart();}
});
document.getElementById("checkoutBtn").onclick=()=>showToast("Demo store: connect a payment provider to enable checkout.");
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();showToast("Thanks for joining the Volley Kits club!");e.target.reset();});
document.getElementById("headerSearch").addEventListener("input",e=>{
  const value=e.target.value;
  document.getElementById("productSearch").value=value;
  searchTerm=value.trim().toLowerCase();
  renderProducts();
});
document.getElementById("productSearch").addEventListener("input",e=>{
  document.getElementById("headerSearch").value=e.target.value;
});
document.getElementById("headerSearch").addEventListener("keydown",e=>{
  if(e.key==="Enter")document.getElementById("shop").scrollIntoView({behavior:"smooth"});
});
document.getElementById("menuToggle").onclick=()=>{const n=document.getElementById("mainNav"),open=n.classList.toggle("open");document.getElementById("menuToggle").setAttribute("aria-expanded",String(open));};
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>{document.getElementById("mainNav").classList.remove("open");document.getElementById("menuToggle").setAttribute("aria-expanded","false");}));
renderProducts();updateCart();


// Three-image hero slideshow with autoplay, arrows, dots and swipe support.
(() => {
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll("#slideDots button")];
  const counter = document.getElementById("slideCounter");
  const hero = document.querySelector(".hero-slider");
  if (!slides.length) return;
  let current = 0;
  let timer;
  let touchStart = 0;
  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
      slide.setAttribute("aria-hidden", String(i !== current));
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
      dot.setAttribute("aria-pressed", String(i === current));
    });
    counter.textContent = `0${current + 1} / 0${slides.length}`;
  };
  const stop = () => clearInterval(timer);
  const start = () => {
    stop();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setInterval(() => show(current + 1), 6000);
    }
  };
  document.getElementById("slidePrev").addEventListener("click", () => { show(current - 1); start(); });
  document.getElementById("slideNext").addEventListener("click", () => { show(current + 1); start(); });
  dots.forEach(dot => dot.addEventListener("click", () => { show(Number(dot.dataset.go)); start(); }));
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);
  hero.addEventListener("focusin", stop);
  hero.addEventListener("focusout", start);
  hero.addEventListener("touchstart", e => { touchStart = e.changedTouches[0].clientX; }, {passive:true});
  hero.addEventListener("touchend", e => {
    const delta = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 45) { show(current + (delta < 0 ? 1 : -1)); start(); }
  }, {passive:true});
  show(0);
  start();
})();
