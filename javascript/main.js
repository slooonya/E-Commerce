import i18next, { updateContent } from "./i18n.js";
import { showCategoryProducts } from "./index.js";


// In-memory cache for fetch_data to avoid redundant network requests.
// Storing the Promise (not just the resolved value) so concurrent callers
// during a still-pending fetch all share the same in-flight request.
const fetch_cache = new Map();
const PRODUCTS_API_URL = "https://dummyjson.com/products?limit=0";

// loading page
window.addEventListener("load", () => {
  const savedLang = localStorage.getItem('lang') || 'en';
  i18next.changeLanguage(savedLang).then(() => {
    updateContent();

    language__name.textContent = savedLang === "ru" ? "Русский" : "English";

    document.dispatchEvent(new CustomEvent("languageChanged"));
  });

  document.querySelector("main").style.display = "block";
  document.querySelector(".loader").style.display = "none";
});

// scroll to top
let scroll__top__btn = document.querySelector(".scroll__top__btn");
window.addEventListener("scroll", () => {
if(scrollY >= 500) {
  scroll__top__btn.classList.add("displayed");
} else{
  scroll__top__btn.classList.remove("displayed");
}
});

// Language switch
const language__container = document.querySelector(".language__container");
const language__options = document.querySelector(".language__options");
const language__name = document.querySelector(".language__name");
const language__icon = document.querySelector(".language__container i");

function selectLanguage(item) {
  const lang = item.dataset.lang;
  localStorage.setItem('lang', lang);

  language__name.textContent = item.textContent;
  language__options.classList.remove("listed");
  language__container.setAttribute("aria-expanded", "false");

  i18next.changeLanguage(lang).then(() => {
    updateContent();
    renderCategories();
    rerenderCart();

    document.dispatchEvent(
      new CustomEvent("languageChanged")
    );
  });

  closeLanguageDropdown();
  language__container.focus();
}

language__container.addEventListener("click", () => {
    if (!language__options.classList.contains("listed")) {
        language__options.classList.add("listed");
        language__container.setAttribute("aria-expanded", "true");
        language__icon.className = "fa-solid fa-chevron-up mx-1";
    } else {
        closeLanguageDropdown();
    }
});

language__container.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    language__container.click();
  }
});

document.querySelectorAll(".language__item").forEach(item => {
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    selectLanguage(item);
  });

  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      selectLanguage(item);
    }
  });
});

// when tabbed through all the options -> close the dropdown to prevent it from covering content
language__options.addEventListener("focusout", () => {
  setTimeout(() => {
    if (!language__options.contains(document.activeElement)) {
      language__options.classList.remove("listed");
    }
  }, 0);
});

function closeLanguageDropdown() {
  language__options.classList.remove("listed");
  language__container.setAttribute("aria-expanded", "false");
  language__icon.className = "fa-solid fa-chevron-down mx-1";
}

// Currency convert
const currency__container = document.querySelector(".currency__container");
const currency__name = document.querySelector(".currency__name");
const currency__logo = document.querySelector(".currency__logo");
const currency__list__ico = document.querySelector(".currency__container i");

const currencies__data = [];

if(localStorage.getItem("currency")) {
  let the__currency__data = JSON.parse(localStorage.getItem("currency"));
  currency__name.setAttribute("the-rate", the__currency__data.rate);
  currency__name.setAttribute("the-currency", the__currency__data.name);
  currency__name.textContent = the__currency__data.name;

  currency__logo.src = `https://flagcdn.com/w40/${the__currency__data.name.slice(0, the__currency__data.name.length - 1).toLowerCase()}.png`;
  currency__logo.alt = the__currency__data.name;
} else {
  let usd = {
    name: "USD",
    rate: 1.0
  }

localStorage.setItem("currency", JSON.stringify(usd));
}

// API key comes from javascript/config.js so it's not buried in the
// app code. If no key is set, just stay on USD.
const currency_api_key = (window.APP_CONFIG && window.APP_CONFIG.CURRENCY_API_KEY) || "";

if (currency_api_key) {
  fetch_data(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${encodeURIComponent(currency_api_key)}`)
    .then(res => {  

      for(let i in res.rates) {
        if(['EUR', 'USD', 'GBP', 'EGP'].includes(i)) {
            let cur = {
                name: i,
                rate: res.rates[i],
                logo__src: `https://flagcdn.com/w40/${i.slice(0, i.length - 1).toLowerCase()}.png`
            }
            currencies__data.push(cur);
        }
      }

      let currency__options = document.createElement("ul");
      currency__options.classList.add("currency__options", "list-unstyled", "p-1");

      // when tabbed through all the options -> close the dropdown to prevent it from covering content
      currency__options.addEventListener("focusout", () => {
        setTimeout(() => {
          if (!currency__options.contains(document.activeElement)) {
            currency__options.classList.remove("listed");
          }
        }, 0);
      });

      currencies__data.forEach((ele) => {
        let currency = document.createElement("li"),
            currency__option__logo = document.createElement("img"),
            currency__option__name = document.createElement("span");

        currency.tabIndex = 0;
        currency.setAttribute("role", "option");
        
        currency__option__logo.src = ele.logo__src;
        currency__option__logo.alt = ele.name;

        currency__option__name.textContent = ele.name;
        currency__option__name.setAttribute("the-currency", ele.name);
        currency__option__name.setAttribute("the-rate", ele.rate);

        currency__container.append(currency__options);
        currency.append(currency__option__logo, currency__option__name);
        currency__options.append(currency);
        
        document.querySelector(".cart__items__preview").classList.remove("listed__cart");
      });

      function toggleCurrencyDropdown() {
        if (!currency__options.classList.contains("listed")) {
            currency__options.classList.add("listed");
            currency__container.setAttribute("aria-expanded", "true");
            currency__list__ico.className = "fa-solid fa-chevron-up mx-1";
        } else {
            currency__options.classList.remove("listed");
            currency__container.setAttribute("aria-expanded", "false");
            currency__list__ico.className = "fa-solid fa-chevron-down mx-1";
        }
      }

      currency__container.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleCurrencyDropdown();
      });

      currency__container.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          toggleCurrencyDropdown();
        }
      });

      let currencies__items = document.querySelectorAll(".currency__options li");

      function selectCurrency(item) {
        currency__options.classList.remove("listed");
        currency__container.setAttribute("aria-expanded", "false");
        currency__list__ico.className = "fa-solid fa-chevron-down mx-1";

        currency__logo.src = item.children[0].getAttribute("src");
        currency__logo.alt = item.children[1].textContent;

        currency__name.textContent = item.children[1].textContent;
        currency__name.setAttribute("the-currency", item.children[1].textContent);
        currency__name.setAttribute("the-rate", item.children[1].getAttribute("the-rate"));

        let currency__obj__in__localStorage = {
          name: currency__name.getAttribute("the-currency"),
          rate: currency__name.getAttribute("the-rate")
        };
        
        localStorage.setItem("currency",  JSON.stringify(currency__obj__in__localStorage));

        // change product currency
        let product__prices = document.querySelectorAll(".product__price");
        let current__currency = JSON.parse(localStorage.getItem("currency"));

        product__prices.forEach(ele => {
          let price = +ele.getAttribute("price-USD");
          ele.textContent = (price * current__currency.rate).toFixed(2) + " " + current__currency.name;
        });

        currency__container.focus();
      }

      currencies__items.forEach(ele => {
        ele.addEventListener("click", (e) => {
            e.stopPropagation();
            selectCurrency(ele);
        });

        ele.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            selectCurrency(ele);
          }
        });
      });
  });
}

window.addEventListener("load", () => {
  let currency__options__items = document.querySelectorAll(".currency__options li");

  currency__options__items.forEach(ele => {
    ele.addEventListener("click", () => {
      let products__price = document.querySelectorAll(".product__price"),
      theCurrency = JSON.parse(localStorage.getItem("currency"));
      
      products__price.forEach(ele => {
        let the_price_USD = parseInt(ele.getAttribute("price-USD"));
          let the_new_price = (the_price_USD * +theCurrency.rate).toFixed(2);
            
          ele.textContent = the_new_price + " " + theCurrency.name;
      });
    });
  });
});

// set categories
const categories__btn = document.querySelector(".categories__btn");
const categories = new Set();
export const all_products = new Set();
export const categories__logos = [
{
  name: "smartphones",
  label: "Smartphones",
  src: "images/samrtphones.jpg"
},
{
  name: "laptops",
  label: "Laptops",
  src: "images/laptops.jpg"
},
{
  name: "mens-watches",
  label: "Watches",
  src: "images/watches.webp"
},
{
  name: "mens-shoes",
  label: "Shoes",
  src: "images/shoes.png"
},
{
  name: "fragrances",
  label: "Fragrances",
  src: "images/Fragrances.jpg"
},
{
  name: "skin-care",
  label: "Skin Care",
  src: "images/skincare.jpg"
},
{
  name: "mens-shirts",
  label: "Men's Shirts",
  src: "images/mens-shirts.webp"
},
{
  name: "womens-dresses",
  label: "Women's Dresses",
  src: "images/womens-dresses.webp"
},
{
  name: "womens-jewellery",
  label: "Jewelery",
  src: "images/jewelry.webp",
},
{
  name: "groceries",
  label: "Groceries",
  src: "images/Groceries.jpg"
},
{
  name: "home-decoration",
  label: "Home Decoration",
  src: "images/Home-Decoration.png",
}
];

function category_matches(product__category, selected__category) {
  return product__category == selected__category;
}

function category_data(category) {
  return categories__logos.find(ele => ele.name == category) || null;
}

fetch_data("all_products.json").then(res => {
  res.forEach((ele, i) => {set_products_obj(ele, i)});
  renderCategories();
});

export function renderCategories() {
  const container = document.querySelector(".categories__container");
  let oldDropdownMenuOptions = container.querySelector(".categories__options");

  if (oldDropdownMenuOptions) oldDropdownMenuOptions.remove();

  let categories__options = document.createElement("ul");
  categories__options.className = "categories__options p-2 list-unstyled";

  container.append(categories__options);

  categories.forEach((ele) => {
    let category = document.createElement("li");
    category.className = "category p-2";
    category.setAttribute("category", ele);
    category.setAttribute("label", category_data(ele) ? category_data(ele).label : ele);

    let category__logo = document.createElement("img");
    category__logo.classList.add("mx-2");

    categories__logos.forEach(el => {
      if(el.name == ele) {
        category__logo.src = el.src;
        category__logo.alt = `${i18next.t(el.name)} ${i18next.t("category")}`;
      }
    });

    let category__link = document.createElement("a");
    category__link.classList.add("text-decoration-none");
    category__link.href = `#products__section`;
    category__link.textContent = i18next.t(ele);
    
    category.prepend(category__logo);
    category.append(category__link);

    category.addEventListener("click", () => {
      categories__options.classList.remove("listed");
      showCategoryProducts(ele);
    });

    categories__options.append(category);
  });

  // when tabbed through all the options -> close the dropdown to prevent it from covering content
  categories__options.addEventListener("focusout", () => {
    setTimeout(() => {
      if (!categories__options.contains(document.activeElement)) {
        categories__options.classList.remove("listed");
      }
    }, 0);
  });
}

const categories__container = document.querySelector(".categories__container");

categories__btn.onclick = function() {
  const dropdownMenu = categories__container.querySelector(".categories__options");

  if (!dropdownMenu) return;
  dropdownMenu.classList.toggle("listed");
}

// product preview
export function display_product_preview() {
  let products = document.querySelectorAll(".product");

  products.forEach(ele => {
    ele.addEventListener("click", () => {
        // display the container 
        document.body.classList.add("overlay");
        // render product
        render_preview(ele);
    });
  });
}

// cart items
const cart__items = new Set();
let saved__cart__items = localStorage.getItem("cart-items");
let cart__ico = document.querySelector(".cart__ico");

if(saved__cart__items) {
  JSON.parse(saved__cart__items).forEach(ele => {cart__items.add(ele)});
}

cart_items_num();

cart__ico.onclick = function() {
  let cart__items__preview = document.querySelector(".cart__items__preview"),
      localStorage__data = JSON.parse(localStorage.getItem("cart-items"));

  if(localStorage__data && localStorage__data.length >= 1) {
    display_cart_preview();
  } else{
    display_empty_cart_state();
  }
}

// Keep this behavior isolated to avoid interfering with teammates' cart logic:
// when cart preview is open, clicking outside closes it.
document.addEventListener("click", (event) => {
  const cart__items__preview = document.querySelector(".cart__items__preview");

  if(!cart__items__preview || !cart__items__preview.classList.contains("listed__cart")) {
    return;
  }

  const clicked__inside__preview = cart__items__preview.contains(event.target);
  const clicked__cart__trigger = event.target.closest(".cart");

  if(!clicked__inside__preview && !clicked__cart__trigger) {
    cart__items__preview.classList.remove("listed__cart");
  }
});

// Allow quick keyboard dismissal without changing existing cart flow.
document.addEventListener("keydown", (event) => {
  if(event.key !== "Escape") {
    return;
  }

  const cart__items__preview = document.querySelector(".cart__items__preview");
  cart__items__preview?.classList.remove("listed__cart");
});

// ==== Global function ====
export function fetch_data(url) {
  const request_url = url === "all_products.json" ? PRODUCTS_API_URL : url;

  if (fetch_cache.has(request_url)) {
    return fetch_cache.get(request_url);
  }

  const req = fetch(request_url)
    .then(res => res.json())
    .then(data => {
      if (request_url === PRODUCTS_API_URL && Array.isArray(data.products)) {
        return data.products;
      }

      return data;
    });

  fetch_cache.set(request_url, req);
  return req;
}

function set_products_obj(element, index) {
  all_products.add(element);
  element.id = index;

  if(category_data(element.category)) {
    categories.add(element.category);
  }
}

export function change_currency() {
  let currencies__items = document.querySelectorAll(".currency__options li");
  
  currencies__items.forEach(ele => {
      ele.addEventListener("click", () => {
          let product__prices = document.querySelectorAll(".product__price");
          let current__currency = JSON.parse(localStorage.getItem("currency"));

          product__prices.forEach(ele => {
              let price = +ele.getAttribute("price-USD");
              ele.textContent = (price * current__currency.rate).toFixed(2) + " " + current__currency.name;
          });
      });
  });
}

function render_preview(element) {
  let product__preview = document.querySelector(".product__preview");

  display_loading_spinner(product__preview);

  fetch_data("all_products.json").then(res => {
    let product__id = +element.getAttribute("product-id"),
        product__obj = [...all_products][product__id];

    product__preview.innerHTML = `
    <button class="product__details__close p2" type="button" data-i18n-aria="${i18next.t('closePreviewLabel')}">
      <i class="fa-solid fa-xmark p-2"></i>
    </button>

    <div class="product__images">
        <div class="main__image__container p-3"></div>

        <div class="product__images__pagination mt-3">
            <div class="images__pagination__container px-2"></div>
              <button class="images__pagination__control previous d-flex justify-content-center align-items-center" 
                      type="button" data-i18n-aria="${i18next.t('previousImageLabel')}">
                <i class="fa-solid fa-angle-left"></i>
              </button>

            <button class="images__pagination__control next d-flex justify-content-center align-items-center" 
                    type="button" data-i18n-aria="${i18next.t('nextImageLabel')}">
              <i class="fa-solid fa-angle-right"></i>
            </button>
        </div>
    </div>

    <div class="product__details p-2">
        <h2 class="py-1">${escape_html(product__obj.title)}</h2><hr class="m-0">
        <div class="product__description mb-4 mt-3">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam sint itaque saepe beatae, facilis dolorem ipsa ut, accusantium temporibus minima nisi ex porro vel deserunt quae autem voluptates eum ipsam Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam sint itaque saepe beatae</div>

        <div>
            <div class="product__details__price">
                <span class="the__current__price">
                    <span class="currency__value" product-price="${(product__obj.price * JSON.parse(localStorage.getItem("currency")).rate).toFixed(2)}">
                    ${(product__obj.price * JSON.parse(localStorage.getItem("currency")).rate).toFixed(2)}</span>
                    <span class="currency__name">${escape_html(JSON.parse(localStorage.getItem("currency")).name)}</span>
                </span>
                <del class="the__old__price mx-2"></del>
            </div>

            <p class="availability mb-4">
                ${i18next.t("availability")} : <span>${escape_html(product_stock())}</span>
            </p>

        </div>

        <div class="product__sale mt-5">
        <button class="add__to__cart py-2 px-3" product-id="${product__obj.id}">
            <i class="fa-solid fa-cart-shopping mx-2  text-decoration-none"></i>
            ${i18next.t("addToCart")}
        </button>

      </div>

    </div>`;

    // elements functions
      // main image
      const main__image__container = document.querySelector(".main__image__container");
      let main__image = document.createElement("img");

      main__image.className = 'main__image';
      main__image.alt = i18next.t("productImageLabel");
      main__image.src = img_src(product__obj);
      main__image__container.append(main__image);
      // image zoom
      main__image__container.onmousemove = function(e) {
          let x = (e.clientX - main__image__container.offsetWidth) / main__image__container.offsetWidth * 100,
              y = (e.clientY - main__image__container.offsetHeight) / main__image__container.offsetHeight * 100;

          main__image.style.transform = `translate(${-x}%, ${-y}%) scale(2.4)`;
      }

      main__image__container.ontouchmove = function(e){
          let x = (e.clientX - main__image__container.offsetWidth) / main__image__container.offsetWidth * 100,
              y = (e.clientY - main__image__container.offsetHeight) / main__image__container.offsetHeight * 100;

          main__image.style.transform = `translate(${-x}%, ${-y}%) scale(2)`;
      }

      main__image__container.addEventListener("mouseleave", (e) => {
          main__image.style.transform = `translate(0, 0) scale(1)`;
      });

      // product images pagination
      const images__pagination__container = document.querySelector(".images__pagination__container");
      set_images_pagination();
      pagination_control();
      pagination_images_select();

      // close preview container
      let product__details__close = document.querySelector(".product__details__close");
      product__details__close.onclick = closePreview;
      product__preview.classList.remove("loading");

      product__preview.setAttribute("tabindex", "-1");

      setTimeout(() => {
        const closeBtn =
          product__preview.querySelector(".product__details__close");

        closeBtn?.focus();
        trapFocus(product__preview);
      }, 0);

      document.addEventListener("keydown", handlePreviewKeys);

      function closePreview() {
        document.body.classList.remove("overlay");
        document.removeEventListener("keydown", handlePreviewKeys);
        element?.focus();
      }

      function handlePreviewKeys(e) {
        if (e.key === "Escape") {
          closePreview();
        }
      }

      // images slider
      const images__pagination__container__images = document.querySelectorAll(".images__pagination__container img");
      const next = document.querySelector(".next");
      const previous = document.querySelector(".previous");

      if(next && previous) {

          next.onclick = function() {
            let active__image = document.querySelector(".active__image"),
                active__image__id = +active__image.getAttribute("image-id");

              images__pagination__container__images.forEach(ele => {
                images__pagination__container.scrollLeft += 20;

                if(+ele.getAttribute("image-id") == (active__image__id + 1)) {
                  images__pagination__container__images.forEach(ele => {ele.classList.remove("active__image")});
                  ele.classList.add("active__image");
                  main__image.src = ele.src;
                }
              });
          }

          previous.onclick = function() {
            let active__image = document.querySelector(".active__image"),
              active__image__id = +active__image.getAttribute("image-id");
              
            images__pagination__container__images.forEach(ele => {
              images__pagination__container.scrollLeft -= 20;

              if(+ele.getAttribute("image-id") == (active__image__id - 1)) {
                images__pagination__container__images.forEach(ele => {ele.classList.remove("active__image")});
                ele.classList.add("active__image");
                main__image.src = ele.src;
              }
            });
          }

      }

      // old price
      let the__old__price = document.querySelector(".the__old__price");
      the__old__price.textContent = product_price_before_discount();

      // add to cart
      let add__to__cart = document.querySelector(".add__to__cart");

      add__to__cart.onclick = function(e) {
        let item = +e.currentTarget.getAttribute("product-id");
        let update__items = new Set(localStorage.getItem("cart-items") ? JSON.parse(localStorage.getItem("cart-items")) : [...cart__items]);
        let already__in__cart = update__items.has(item);

        update__items.add(item);
        cart__items.clear();
        update__items.forEach(ele => cart__items.add(ele));
        localStorage.setItem("cart-items", JSON.stringify([...update__items]));

        cart_items_num();
        show_add_to_cart_feedback(e.currentTarget, already__in__cart);
      }


    // functions 
    function product_price_before_discount(){
        if(product__obj.discountPercentage) {
            let currency__value = +document.querySelector(".currency__value").textContent;
            let old__price = (currency__value / ((100 - product__obj.discountPercentage))) * 100;

            return old__price.toFixed(2)

        } else if (product__obj.old_price) {
          return product__obj.old_price
        } else {
          return "";
        }
    }
    
    function product_stock() {
        if (product__obj.stock) {
            return product__obj.stock;
        } else {
            return i18next.t('manyInStock', 'Many In Stock')
        }
    }

    function set_images_pagination() {
        if(Array.isArray(product__obj.images)) {
            product__obj.images.forEach((el, i) => {
              let btn = document.createElement("button");
              btn.type = "button";
              btn.className = "pagination__image";
              btn.setAttribute("image-id", i);
              btn.setAttribute("data-i18n-aria", `${i18next.t('selectImageLabel')} ${i + 1}`);

              let img = document.createElement("img");
              img.src = el;
              img.alt = i18next.t("productImageLabel");

              btn.append(img);
              images__pagination__container.append(btn);
            });
        } else{
          let pagination__img = document.createElement("img");
          pagination__img.className = "p-2 pagination__image";
          pagination__img.setAttribute("image-id", 0);
          pagination__img.src = product__obj.images;
          pagination__img.alt = i18next.t("paginationImageLabel");
          images__pagination__container.append(pagination__img);
        }
    }

    function pagination_control() {
        let images__pagination__container__images = document.querySelectorAll(".images__pagination__container img"),
          images__pagination__control = document.querySelectorAll(".images__pagination__control");
        
        if(images__pagination__container__images.length <= 2) {
          images__pagination__control.forEach(ele => ele.remove());
        }

    }

    function pagination_images_select() {
      let pagination__images = document.querySelectorAll(".pagination__image");
      pagination__images[0].classList.add("active__image");

      pagination__images.forEach(btn => {
        btn.onclick = function() {
          pagination__images.forEach(el => {el.classList.remove("active__image")});
          btn.classList.add("active__image");

          // change the main image
          main__image.src = btn.querySelector("img").src;
        }
      });
    }
  });

  // keep focus inside the preview container
  function trapFocus(container) {
    const selectors =
      'button, [href], input, [tabindex]:not([tabindex="-1"])';

    const focusables = container.querySelectorAll(selectors);

    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    container.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
}

export function display_loading_spinner(container) {
  container.innerHTML = "";
  container.classList.add("loading");
  container.innerHTML = `<section class="products__loader justify-content-center align-items-center">
    <div class="spinner-border text-primary spinner-border-sm"
    role="status">
    <span class="visually-hidden"></span>
    </div>
  </section>`;
}

function cart_items_num() {
  let cart__items__num = document.querySelector(".cart__items__num");
  if(localStorage.getItem("cart-items")) {
    cart__items__num.textContent = JSON.parse(localStorage.getItem("cart-items")).length
  }
}

function show_add_to_cart_feedback(buttonEl, already__in__cart) {
  const toast = document.createElement("div");
  toast.className = "cart__feedback__toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.textContent = already__in__cart ? i18next.t("alreadyInCart") : i18next.t("addedToCart");
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("cart__feedback__toast--visible");
  });

  const cartBadge = document.querySelector(".cart__items__num");
  if (cartBadge) {
    cartBadge.classList.remove("cart__items__num--bump");
    void cartBadge.offsetWidth;
    cartBadge.classList.add("cart__items__num--bump");
  }

  const originalHTML = buttonEl.innerHTML;
  buttonEl.setAttribute("aria-disabled", "true");
  buttonEl.classList.add("add__to__cart--disabled");
  buttonEl.classList.add("add__to__cart--added");
  buttonEl.innerHTML =
    `<i class="fa-solid fa-check mx-2" aria-hidden="true"></i>${already__in__cart ? i18next.t("alreadyAdded") : i18next.t("added")}`;

  buttonEl.focus();

  window.setTimeout(() => {
    toast.classList.remove("cart__feedback__toast--visible");
    window.setTimeout(() => toast.remove(), 320);
  }, 2400);

  window.setTimeout(() => {
    buttonEl.removeAttribute("aria-disabled");
    buttonEl.classList.remove("add__to__cart--disabled");
    buttonEl.classList.remove("add__to__cart--added");
    buttonEl.innerHTML = originalHTML;
  }, 1800);
}

export function display_cart_preview() {
  let cart__items__preview = document.querySelector(".cart__items__preview"),
      items__id = JSON.parse(localStorage.getItem("cart-items")),
      currency = JSON.parse(localStorage.getItem("currency"));

  // close preview when focus leaves it to prevent it from blocking content
  cart__items__preview.addEventListener("focusout", () => {
    setTimeout(() => {
      if (!cart__items__preview.contains(document.activeElement)) {
        cart__items__preview.classList.remove("listed__cart");
      }
    }, 0);
  });

  // display list
  cart__items__preview.classList.toggle("listed__cart");  

  // loading 
  cart__items__preview.classList.add("loading");
  cart__items__preview.innerHTML = `
    <div class="cart__loader justify-content-center align-items-center">
        <div class="spinner-border text-primary spinner-border-sm"
        role="status">
        <span class="visually-hidden">
          ${i18next.t("loading")}
        </span>
        </div>
    </div>`;

  fetch_data("all_products.json").then(res => {
    // reset content
    cart__items__preview.classList.remove("loading");
    cart__items__preview.innerHTML = `
    <div class="cart__items position-relative pb-3"></div>

    <div class="cart__summary position-relative pt-2">
      <div class="cart__summary__total pb-3">
        ${i18next.t("cartTotal")} <span class="mx-2"></span>
      </div>
      <button class="view__cart__btn py-2 px-3">
        <i href="#" class="fa-solid fa-cart-shopping mx-2 text-decoration-none"></i>
        ${i18next.t("orderNow")}
      </button>
    </div>`;

    let cart__items = document.querySelector(".cart__items");
    // render items 
    items__id.forEach(ele => {
      let item = [...all_products][+ele];
      let product__item = document.createElement("div");

      product__item.className = "cart__item position-relative my-3 pb-3";
      product__item.setAttribute("product-id", ele);

      product__item.innerHTML = `
        <button class="delete__btn position-absolute" type="button" data-i18n-aria="${i18next.t('deleteItemLabel')}">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="cart__item__img__container p-2">
          <img src="${escape_html(img_src(item))}" alt="product-image" product-id="${ele}">
        </div>

        <div class="cart__item__info">
          <h2>${escape_html(item.title)}</h2>

          <div class="cart__item__sale d-flex justify-content-between align-items-center mt-4">
            <div class="cart__item__price">${(currency.rate * item.price).toFixed(2)} ${escape_html(currency.name)}</div>

            <div class="product__count d-flex justify-content-between" max-quantity="10">

              <button class="increase__btn d-flex justify-content-center align-items-center py-1" 
                      type="button" data-i18n-aria="${i18next.t('increaseQuantityLabel')}">
                <i class="fa-solid fa-chevron-up"></i>
              </button>

              <span product-price=${(currency.rate * item.price).toFixed(2)} product-id=${item.id}>1</span>

              <button class="decrease__btn d-flex justify-content-center align-items-center py-1" 
                      type="button" data-i18n-aria="${i18next.t('decreaseQuantityLabel')}">
              <i class="fa-solid fa-chevron-down"></i></div>
            </button>
          </div>
        </div>
      </div>`

      cart__items.append(product__item);
    });

    // functions  
    // delete item
    let del__btn = document.querySelectorAll(".cart__item .delete__btn");
    cart__items = new Set(JSON.parse(localStorage.getItem("cart-items")));

    del__btn.forEach(ele => {
      ele.onclick = function() {
        let product__id = +ele.parentElement.getAttribute("product-id");

        // remove from local storage
        ele.parentElement.remove();
        cart__items.delete(product__id);
        localStorage.setItem("cart-items", JSON.stringify([...cart__items]));

        // update num of cart items
        cart_items_num();

        // no items 
        let product__items = document.querySelectorAll(".cart__item");
        if(product__items.length === 0) {
          cart__items__preview.classList.remove("listed__cart");
          cart__items = new Set();
          localStorage.setItem("cart-items", JSON.stringify([...cart__items]));
        } 

        // total price
        total_price()

        // prevent focus loss when deleting an item to stop the preview from closing
        const nextFocusable = cart__items__preview.querySelector("button");

        nextFocusable.focus();
      }
    });

    // product quantity
    let increase__btn = document.querySelectorAll(".increase__btn"),
        decrease__btn = document.querySelectorAll(".decrease__btn");
    
    increase__btn.forEach(ele => {
      let product__count__num = ele.nextElementSibling;
      ele.onclick = function() {
        if(+product__count__num.textContent < +ele.parentElement.getAttribute("max-quantity")){
          product__count__num.textContent++;
        }
        total_price();
      }
    });
    
    decrease__btn.forEach(ele => {
      let product__count__num = ele.previousElementSibling;
      ele.onclick = function() {
        if(+product__count__num.textContent > 1){
          product__count__num.textContent--;
        }
        total_price();
      }
    }); 

    // total price
    total_price();
  
    function total_price() {
      let product__count__num = document.querySelectorAll(".product__count span"),
          cart__summary__total = document.querySelector(".cart__summary__total span");
      const bill = [];

      product__count__num.forEach(ele => {
        let total__price = (ele.textContent * ele.getAttribute("product-price"))
        ele.setAttribute("total-price", total__price);
        bill.push(+ele.getAttribute("total-price"));
      });

      const total = bill.reduce((initial, ele) => {
        return initial + ele;
      }, 0);

      cart__summary__total.textContent = total.toFixed(2) + ` ${currency.name}`;
    }

    // open product preview
    let cart__item__img__container = document.querySelectorAll(".cart__item__img__container img");
    cart__item__img__container.forEach(ele => {
      ele.onclick = function(e) {
        cart__items__preview.classList.remove("listed__cart");
        // display the container 
        document.body.classList.add("overlay");
        // render product
        render_preview(e.currentTarget);
      }
    });
  });
}

function display_empty_cart_state() {
  const cart__items__preview = document.querySelector(".cart__items__preview");

  if(!cart__items__preview) {
    return;
  }

  cart__items__preview.classList.add("listed__cart");
  cart__items__preview.classList.remove("loading");
  cart__items__preview.innerHTML = `
    <div class="empty__cart__state">
      <i class="fa-solid fa-cart-shopping empty__cart__icon" aria-hidden="true"></i>
      <h3>Your cart is empty</h3>
      <p>Add products to your cart and come back here.</p>
      <button type="button" class="empty__cart__cta">Browse products</button>
    </div>
  `;

  const empty__cta = cart__items__preview.querySelector(".empty__cart__cta");
  empty__cta?.addEventListener("click", () => {
    cart__items__preview.classList.remove("listed__cart");
    location.href = "#products__section";
  });
}

function rerenderCart() {
  const cart = document.querySelector(".cart__items__preview");

  if (cart && cart.classList.contains("listed__cart")) {
      display_cart_preview();
  }
}
