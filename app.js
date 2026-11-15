
(()=> {
const products=window.VK_PRODUCTS||[];
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

const currencySymbols={BDT:"৳",USD:"$",EUR:"€",GBP:"£",INR:"₹",AED:"د.إ",SAR:"ر.س"};
let selectedCurrency=localStorage.getItem('vk_currency')||'BDT';
let fxRates=read('vk_fx_rates',{BDT:1});
const money=n=>{const rate=Number(fxRates[selectedCurrency]||1);const val=Number(n)*rate;return (currencySymbols[selectedCurrency]||'')+val.toLocaleString('en-US',{minimumFractionDigits:selectedCurrency==='BDT'?0:2,maximumFractionDigits:2})};

let cart=read('vk_cart',[]);
let wish=read('vk_wishlist',[]);
const toast=m=>{const t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)};

async function loadFxRates(){
 const stamp=Number(localStorage.getItem('vk_fx_updated')||0);
 if(Date.now()-stamp<6*60*60*1000)return;
 try{
  const res=await fetch('https://open.er-api.com/v6/latest/BDT');
  if(!res.ok)throw new Error('rate service unavailable');
  const data=await res.json();
  if(data.result==='success'&&data.rates){
   const wanted=['BDT','USD','EUR','GBP','INR','AED','SAR'],rates={BDT:1};
   wanted.forEach(c=>{if(data.rates[c])rates[c]=data.rates[c]});
   localStorage.setItem('vk_fx_rates',JSON.stringify(rates));
   localStorage.setItem('vk_fx_updated',String(Date.now()));
   fxRates=rates;
   if(!sessionStorage.getItem('vk_fx_reloaded')){sessionStorage.setItem('vk_fx_reloaded','1');location.reload()}
  }
 }catch(e){console.warn('Using last saved exchange rates.',e)}
}
function initCurrency(){
 const select=document.getElementById('currencySelect');if(!select)return;
 select.value=selectedCurrency;
 select.addEventListener('change',()=>{selectedCurrency=select.value;localStorage.setItem('vk_currency',selectedCurrency);location.reload()});
}
function initBackToTop(){
 const b=document.getElementById('backToTop');if(!b)return;
 const check=()=>b.classList.toggle('visible',window.scrollY>420);
 window.addEventListener('scroll',check,{passive:true});check();
 b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}
function renderHomeShowcases(){
 const grid=document.getElementById('collectionGrid'),picks=document.getElementById('topPicks');
 if(!grid&&!picks)return;
 const shuffled=[...products].sort(()=>Math.random()-.5);
 if(grid){
  const chosen=shuffled.slice(0,Math.min(15,products.length));
  grid.innerHTML=chosen.map(p=>`<article class="product-card"><a href="product.html?id=${p.id}"><div class="product-visual"><img src="assets/${p.image}" alt="${p.name}" loading="lazy"></div></a><div class="product-meta"><span class="product-category">${p.category.toUpperCase()}</span><div class="product-name-row"><h3 class="product-name"><a href="product.html?id=${p.id}">${p.name}</a></h3><span class="product-price">${money(p.price)}</span></div><p class="product-note">${p.season} · ${p.type}</p><button class="filter-chip" data-add="${p.id}">ADD TO BAG +</button></div></article>`).join('');
 }
 if(picks){
  const featured=shuffled.slice(0,6);
  picks.innerHTML=featured.map((p,i)=>`<article class="top-pick-card ${i===0?'expanded':''}" tabindex="0"><img src="assets/${p.image}" alt="${p.name}" loading="lazy"><div class="top-pick-copy"><small>${p.category.toUpperCase()} · ${p.season}</small><h3>${p.name}</h3><p>${money(p.price)}</p><a href="product.html?id=${p.id}">VIEW KIT ↗</a></div></article>`).join('');
  picks.querySelectorAll('.top-pick-card').forEach(card=>card.addEventListener('click',()=>{if(innerWidth<=680){picks.querySelectorAll('.top-pick-card').forEach(x=>x.classList.remove('expanded'));card.classList.add('expanded')}}));
 }
}
function initSmartSearch(){
 const input=document.getElementById('headerSearch');if(!input)return;
 const wrap=input.closest('.header-search');if(!wrap)return;
 const box=document.createElement('div');box.className='search-suggestions';box.id='searchSuggestions';wrap.appendChild(box);
 let active=-1;
 const close=()=>{box.classList.remove('open');active=-1};
 const render=()=>{
  const q=input.value.trim().toLowerCase();if(!q){close();return}
  const matches=products.filter(p=>(p.name+' '+p.team+' '+p.category+' '+p.season+' '+p.type).toLowerCase().includes(q)).slice(0,7);
  box.innerHTML=matches.length?matches.map(p=>`<a class="search-suggestion" href="product.html?id=${p.id}"><img src="assets/${p.image}" alt=""><span><strong>${p.name}</strong><small>${p.team} · ${money(p.price)}</small></span></a>`).join(''):'<div class="search-suggestion"><span><strong>No matching kits found</strong><small>Try a club, country or season</small></span></div>';
  box.classList.add('open');
 };
 input.addEventListener('input',render);
 input.addEventListener('keydown',e=>{const items=[...box.querySelectorAll('a')];if(e.key==='Escape')close();if(e.key==='ArrowDown'){e.preventDefault();active=Math.min(active+1,items.length-1);items.forEach((x,i)=>x.classList.toggle('active',i===active))}if(e.key==='Enter'){if(active>=0&&items[active])location.href=items[active].href;else location.href='shop.html?search='+encodeURIComponent(input.value)}});
 document.addEventListener('click',e=>{if(!wrap.contains(e.target))close()});
}
const count=()=>cart.reduce((s,x)=>s+x.qty,0);
function updateCart(){
 const c=document.getElementById('cartCount'),dc=document.getElementById('drawerCount'),sub=document.getElementById('cartSubtotal'),items=document.getElementById('cartItems');
 if(c)c.textContent=count();if(dc)dc.textContent='('+count()+')';if(sub)sub.textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
 if(items){items.innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><div class="cart-thumb"><img src="${'assets/'+x.image}" alt=""></div><div><h4>${x.name}</h4><p>${x.size||'Size not selected'} · ${money(x.price)}</p><div class="qty-control"><button data-qty="${x.key}" data-delta="-1">−</button><span>${x.qty}</span><button data-qty="${x.key}" data-delta="1">+</button></div></div><button class="remove-item" data-remove="${x.key}">REMOVE</button></div>`).join(''):`<div class="empty-bag"><span>✳</span><h3>YOUR BAG IS EMPTY</h3><p>Find your next favourite shirt.</p><a class="btn btn-dark" href="index.html#shop">EXPLORE KITS ↗</a></div>`}
}
function add(id,size='M'){
 const p=products.find(x=>x.id===Number(id));if(!p)return;
 const key=p.id+'-'+size;let row=cart.find(x=>x.key===key);
 if(row)row.qty++;else cart.push({key,id:p.id,name:p.name,price:p.price,image:p.image,size,qty:1});
 write('vk_cart',cart);updateCart();toast('Added to your bag');
}
function renderGrid(target,items){
 const el=document.getElementById(target);if(!el)return;
 el.innerHTML=items.map(p=>`<article class="product-card"><a href="product.html?id=${p.id}"><div class="product-visual"><span class="product-tag">${p.tag}</span><img src="assets/${p.image.replaceAll('&','&amp;')}" alt="${p.name}" loading="lazy"></div></a><div class="product-meta"><span class="product-category">${p.category.toUpperCase()} / ${p.season}</span><div class="product-name-row"><h3 class="product-name"><a href="product.html?id=${p.id}">${p.name}</a></h3><span class="product-price">${money(p.price)}</span></div><p class="product-note">${p.type}</p><button class="filter-chip" data-add="${p.id}">ADD TO BAG +</button><button class="filter-chip" data-wish="${p.id}">${wish.includes(p.id)?'♥ SAVED':'♡ SAVE'}</button></div></article>`).join('');
}
function initProductGrid(){
 const grid=document.getElementById('productGrid');if(!grid)return;
 const category=grid.dataset.category||'All',era=grid.dataset.era||'';
 const search=document.getElementById('pageSearch'),sort=document.getElementById('sortSelect'),filter=document.getElementById('productFilter');
 const render=()=>{
  let list=products.filter(p=>(category==='All'||p.category===category)&&(!era||p.era===era));
  if(filter&&filter.value!=='All')list=list.filter(p=>p.type.toLowerCase().includes(filter.value.toLowerCase())||p.category===filter.value);
  if(search&&search.value)list=list.filter(p=>(p.name+' '+p.team+' '+p.season+' '+p.type).toLowerCase().includes(search.value.toLowerCase()));
  if(sort&&sort.value==='low')list.sort((a,b)=>a.price-b.price);if(sort&&sort.value==='high')list.sort((a,b)=>b.price-a.price);
  renderGrid('productGrid',list);const n=document.getElementById('shownCount');if(n)n.textContent=list.length;const no=document.getElementById('noResults');if(no)no.hidden=!!list.length;
 };
 [search,sort,filter].filter(Boolean).forEach(x=>x.addEventListener('input',render));render();
}
document.addEventListener('click',e=>{
 const a=e.target.closest('[data-add]');if(a){e.preventDefault();add(a.dataset.add,a.dataset.size||'M')}
 const w=e.target.closest('[data-wish]');if(w){const id=Number(w.dataset.wish);wish=wish.includes(id)?wish.filter(x=>x!==id):[...wish,id];write('vk_wishlist',wish);w.textContent=wish.includes(id)?'♥ SAVED':'♡ SAVE';toast(wish.includes(id)?'Saved to wishlist':'Removed from wishlist')}
 const q=e.target.closest('[data-qty]');if(q){const row=cart.find(x=>x.key===q.dataset.qty);if(row){row.qty+=Number(q.dataset.delta);if(row.qty<=0)cart=cart.filter(x=>x!==row);write('vk_cart',cart);updateCart()}}
 const r=e.target.closest('[data-remove]');if(r){cart=cart.filter(x=>x.key!==r.dataset.remove);write('vk_cart',cart);updateCart()}
});
const toggle=document.getElementById('cartToggle'),drawer=document.getElementById('cartDrawer'),overlay=document.getElementById('overlay');
function close(){drawer?.classList.remove('open');overlay?.classList.remove('open');drawer?.setAttribute('aria-hidden','true')}
if(toggle)toggle.onclick=()=>{drawer.classList.add('open');overlay.classList.add('open');drawer.setAttribute('aria-hidden','false')};
document.getElementById('cartClose')?.addEventListener('click',close);overlay?.addEventListener('click',close);
document.getElementById('menuToggle')?.addEventListener('click',()=>document.getElementById('mainNav')?.classList.toggle('open'));
const hs=document.getElementById('headerSearch');if(hs){hs.addEventListener('keydown',e=>{if(e.key==='Enter')location.href='index.html?search='+encodeURIComponent(hs.value)+'#shop'});hs.addEventListener('input',()=>{if(document.getElementById('pageSearch')){document.getElementById('pageSearch').value=hs.value;document.getElementById('pageSearch').dispatchEvent(new Event('input'))}})}
initCurrency();initBackToTop();initSmartSearch();renderHomeShowcases();loadFxRates();cart=cart.map(x=>{const p=products.find(y=>y.id===x.id);return p?{...x,price:p.price}:x});write('vk_cart',cart);updateCart();initProductGrid();
const params=new URLSearchParams(location.search);
if(params.get('search')&&document.getElementById('pageSearch')){document.getElementById('pageSearch').value=params.get('search');document.getElementById('pageSearch').dispatchEvent(new Event('input'))}
const eraParam=params.get('era');if(eraParam){const eg=document.getElementById('productGrid');if(eg)eg.dataset.era=eraParam;const et=document.getElementById('eraTitle');if(et)et.textContent=eraParam.toUpperCase()+' FOOTBALL SHIRTS';initProductGrid();}
const detail=document.getElementById('productDetail');
if(detail){
 const p=products.find(x=>x.id===Number(params.get('id')));
 if(!p){detail.innerHTML='<div class="content-narrow"><h2>Product not found</h2><a href="index.html#shop">Back to shop</a></div>'}
 else{
  document.title=p.name+' | Volley Kits';
  detail.innerHTML=`<div class="detail-image"><img src="assets/${p.image}" alt="${p.name}"></div><div class="detail-info"><span class="breadcrumb">${p.category.toUpperCase()} · ${p.season}</span><h1>${p.name}</h1><div class="detail-price">${money(p.price)}</div><p class="detail-desc">${p.description}</p><p class="detail-desc">Type: ${p.type}<br>Team: ${p.team}<br>Season: ${p.season}</p><label class="field-label">SELECT SIZE</label><div class="size-options">${p.sizes.map((s,i)=>`<button class="${i===1?'selected':''}" data-size-choice="${s}">${s}</button>`).join('')}</div><label class="field-label">SIZE GUIDE</label><a class="text-link" href="size-guide.html">VIEW SIZE GUIDE ↗</a><div class="detail-actions"><button class="btn btn-dark" id="detailAdd">ADD TO BAG ↗</button><button class="btn" style="border:1px solid var(--forest);background:transparent" data-wish="${p.id}">♡ WISHLIST</button></div><div class="notice">Please confirm the available size, product version and delivery details with Volley Kits before placing a real order. Displayed price is a sample.</div><h3>PRODUCT DETAILS</h3><p class="detail-desc">Product image and description are based on the assets supplied for this demo store. Actual fabric, fit, badge and customization details should be confirmed before publishing.</p></div>`;
  let selected=p.sizes[1]||p.sizes[0];detail.querySelectorAll('[data-size-choice]').forEach(b=>b.addEventListener('click',()=>{detail.querySelectorAll('[data-size-choice]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selected=b.dataset.sizeChoice}));detail.querySelector('#detailAdd').onclick=()=>add(p.id,selected);
 }
}
const checkout=document.getElementById('checkoutForm');
if(checkout){
 const list=read('vk_cart',[]),subtotal=list.reduce((s,x)=>s+x.price*x.qty,0);
 const sum=document.getElementById('checkoutSummary');if(sum)sum.innerHTML=list.map(x=>`<div class="summary-line"><span>${x.name} (${x.size}) × ${x.qty}</span><b>${money(x.price*x.qty)}</b></div>`).join('')+`<div class="summary-line"><span>Estimated delivery</span><b>৳80</b></div><div class="summary-line total"><span>Total</span><b>${money(subtotal+(list.length?80:0))}</b></div>`;
 checkout.addEventListener('submit',e=>{e.preventDefault();if(!list.length){toast('Your bag is empty');return}const data=Object.fromEntries(new FormData(checkout));const order={id:'VK'+Date.now().toString().slice(-7),date:new Date().toISOString(),status:'Order Placed',customer:data,items:list,total:subtotal+80};let orders=read('vk_orders',[]);orders.push(order);write('vk_orders',orders);write('vk_last_order',order);write('vk_cart',[]);location.href='order-success.html?id='+order.id});
}
const success=document.getElementById('orderSuccess');if(success){const o=read('vk_last_order',null);success.innerHTML=o?`<div class="content-narrow"><p class="eyebrow">THANK YOU FOR YOUR ORDER</p><h1 style="font:900 58px var(--display)">ORDER RECEIVED.</h1><p>Your demo order reference is <b>${o.id}</b>.</p><div class="notice">This is a front-end demonstration. No real order was sent to a store and no payment was collected. Contact the store owner to confirm availability and delivery.</div><a class="btn btn-dark" href="track-order.html?id=${o.id}">VIEW ORDER STATUS ↗</a></div>`:'<div class="content-narrow"><h2>No recent order found.</h2><a href="index.html">Return to store</a></div>'}
const track=document.getElementById('trackForm');if(track){track.addEventListener('submit',e=>{e.preventDefault();const id=new FormData(track).get('orderId').trim();const orders=read('vk_orders',[]),o=orders.find(x=>x.id.toLowerCase()===id.toLowerCase());const out=document.getElementById('trackResult');out.innerHTML=o?`<div class="notice"><b>${o.id}</b> · ${o.status}<br>Customer: ${o.customer.fullName}<br>Order total: ${money(o.total)}<br><br>Demo tracking only. This order is saved in this browser.</div>`:'<div class="notice">Order not found in this browser. Demo orders are stored locally on the device where they were created.</div>'})}
const contact=document.getElementById('contactForm');if(contact)contact.addEventListener('submit',e=>{e.preventDefault();toast('Thanks — connect a mail service to receive enquiries.');contact.reset()});
const newsletter=document.getElementById('newsletterForm');if(newsletter)newsletter.addEventListener('submit',e=>{e.preventDefault();toast('Thanks for joining the Volley Kits club!');newsletter.reset()});
const admin=document.getElementById('adminOrders');if(admin){const orders=read('vk_orders',[]);const ac=document.getElementById('adminOrderCount');if(ac)ac.textContent=orders.length;admin.innerHTML=orders.length?orders.map(o=>`<tr><td>${o.id}</td><td>${o.customer.fullName}</td><td>${o.customer.phone}</td><td>${money(o.total)}</td><td>${o.status}</td></tr>`).join(''):'<tr><td colspan="5">No demo orders stored in this browser yet.</td></tr>'}
const account=document.getElementById('accountForm');if(account){const saved=read('vk_customer',null);if(saved){account.fullName.value=saved.fullName||'';account.email.value=saved.email||'';account.phone.value=saved.phone||''}account.addEventListener('submit',e=>{e.preventDefault();write('vk_customer',Object.fromEntries(new FormData(account)));toast('Demo profile saved in this browser.')})}
})();


(()=>{
 const slides=[...document.querySelectorAll('.hero-slide')],dots=[...document.querySelectorAll('.slide-dots button')];
 if(!slides.length)return;let i=0,t;
 const show=n=>{i=(n+slides.length)%slides.length;slides.forEach((s,j)=>s.classList.toggle('is-active',j===i));dots.forEach((d,j)=>d.classList.toggle('active',j===i));const c=document.getElementById('slideCounter');if(c)c.textContent=`0${i+1} / 0${slides.length}`};
 const start=()=>{clearInterval(t);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)t=setInterval(()=>show(i+1),6000)};
 document.getElementById('slidePrev')?.addEventListener('click',()=>{show(i-1);start()});document.getElementById('slideNext')?.addEventListener('click',()=>{show(i+1);start()});dots.forEach((d,j)=>d.addEventListener('click',()=>{show(j);start()}));start();
})();
