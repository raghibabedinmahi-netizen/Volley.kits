# Volley Kits — Complete Front-end Store Demo

A multi-page football jersey storefront using the original uploaded Volley Kits design direction and the jersey image assets supplied in the ZIP.

## Open the website
1. Extract the ZIP.
2. Open `index.html` in Chrome, Edge or Firefox.
3. If your browser restricts local features, run a local static server (for example VS Code Live Server).

## Pages included
- `index.html` — homepage, slideshow, football eras, collections, latest arrivals and brand story
- `shop.html` — all products with search, category filter and sorting
- `club.html` / `national.html` — seasonal club and national collections
- `retro-club.html` / `retro-national.html` — separate retro collections
- `era.html?era=90s` — decade collection pages (70s, 80s, 90s, 00s, 10s, 20s)
- `product.html?id=1` — product details, size selection, wishlist and add to bag
- `checkout.html` / `order-success.html` — demo checkout flow
- `track-order.html` — lookup demo orders saved in the same browser
- `account.html` — local demo customer profile
- `admin.html` — local demo order overview
- `size-guide.html`, `contact.html`, `policies.html`

## Included interactions
- Responsive navigation with Retro hover submenu
- Search, product filters, price sorting
- Product detail pages and size selection
- Shopping bag saved in browser localStorage
- Wishlist saved in browser localStorage
- Demo checkout creates a local order reference
- Demo order tracking and customer profile
- Admin overview for local demo orders

## Important — not production-ready backend
This ZIP is a static front-end demo. It does NOT include secure customer authentication, a shared database, server-side inventory, real order submission, payment processing, email delivery, or protected admin access. Demo cart, orders and profile data are stored only in the current browser. Payment options shown are placeholders. Prices are sample BDT amounts. Confirm product authenticity, versions, sizes, stock and prices before publishing. Replace draft policy text and placeholder social links with real business information.


## Volley Kits refresh
- Brand palette: #15370D, #728E6D, #E5CD82, #FFF2B4.
- Retro product prices are set to BDT 1,100; seasonal product prices are set to BDT 1,000.
- Homepage includes expandable Top Picks, randomized 10–15 item The Collection, Football Eras, dark Why Always Us, newsletter and support links.
- Header includes a currency selector. Exchange rates are fetched from the public ExchangeRate-API endpoint and cached locally; offline mode uses the last saved rate.
- This remains a front-end demo. Real payment processing, customer messaging and verified service promises require business integrations and confirmation.
