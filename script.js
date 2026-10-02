/* =====================================================
   GLOW & GRACE COSMETICS - script.js

   What this file does:
   1. Builds the product cards automatically from products.js
   2. WhatsApp ordering (product, price, quantity, total)
   3. Quantity validation (quantity can never be less than 1)
   4. Mobile menu open/close
   5. Keeps the phone/WhatsApp links in sync with the shop number

   NOTE: products.js must be loaded BEFORE this file in index.html.
   ===================================================== */


/* =====================================================
   >>> SHOPKEEPER'S WHATSAPP NUMBER - CHANGE ONLY THIS <<<

   Write the number in international format:
   - Start with 92 (Pakistan country code)
   - Do NOT use + , spaces, dashes, or a leading 0
   - Example: for 0300 1234567 write "923001234567"
   ===================================================== */
const SHOP_WHATSAPP_NUMBER = "923434113012";

// Folder where product pictures are saved
const PRODUCT_IMAGE_FOLDER = "images/products/";


/* =====================================================
   1. BUILD PRODUCT CARDS FROM products.js
   ===================================================== */

// The empty box in index.html where the cards will be placed
const productList = document.querySelector("#product-list");

// The products that are shown on the page (filled by renderProducts)
let visibleProducts = [];

// Creates the HTML for ONE product card.
// This is the single "card template" - every product uses it.
function createProductCard(product) {
  const imagePath = encodeURI(PRODUCT_IMAGE_FOLDER + product.image);

  return `
    <article class="product-card" data-category="${makeSlug(product.category)}" data-product-id="${product.id}">
      <img class="product-card__image" src="${escapeHtml(imagePath)}" alt="${escapeHtml(product.name)}" width="300" height="300" loading="lazy">
      <div class="product-card__body">
        <h3 class="product-card__name">${escapeHtml(product.name)}</h3>
        <p class="product-card__price">Rs. ${formatPrice(product.price)}</p>
        <p class="product-card__description">${escapeHtml(product.description || "")}</p>

        <div class="quantity">
          <label class="quantity__label" for="qty-${product.id}">Quantity</label>
          <input class="quantity__input" type="number" id="qty-${product.id}" name="quantity" value="1" min="1" max="20">
        </div>

        <button class="button button--whatsapp" type="button" data-product-id="${product.id}">
          Order on WhatsApp
        </button>
      </div>
    </article>
  `;
}

// Puts all the cards on the page
function renderProducts() {
  if (!productList) {
    return;
  }

  // If the list is empty, show a friendly message
  if (typeof products === "undefined" || products.length === 0) {
    productList.innerHTML = "<p>New products are coming soon.</p>";
    return;
  }

  // Keep only products that have a name, a numeric price and a unique id
  visibleProducts = getValidProducts();

  // Make one card for each product and join them together
  productList.innerHTML = visibleProducts.map(createProductCard).join("");

  // If a picture is missing, show a simple pink picture with the product name
  productList.querySelectorAll(".product-card__image").forEach(function (image) {
    image.addEventListener("error", function () {
      image.src = makePlaceholderImage(image.alt);
    }, { once: true });
  });
}

// Checks the list in products.js and skips any product that would break
// the page or the WhatsApp message. Problems are shown in the browser
// console (press F12 > Console).
function getValidProducts() {
  const usedIds = [];

  return products.filter(function (product) {
    const hasName = typeof product.name === "string" && product.name.trim() !== "";
    const hasPrice = typeof product.price === "number" && product.price > 0;
    const hasUniqueId = product.id !== undefined && !usedIds.includes(product.id);

    if (!hasName || !hasPrice || !hasUniqueId) {
      console.warn("products.js: this product was skipped. It needs a name, a price written as a plain number (like 1500), and an id that no other product uses:", product);
      return false;
    }

    usedIds.push(product.id);
    return true;
  });
}

// Small pink picture (used only when the real picture file is not found)
function makePlaceholderImage(name) {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">' +
    '<rect width="100%" height="100%" fill="#f4d3df"/>' +
    '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" ' +
    'font-family="Georgia, serif" font-size="32" fill="#4a1d3f">' + escapeHtml(name) + '</text>' +
    '</svg>';

  return "data:image/svg+xml," + encodeURIComponent(svg);
}

// Turns "Lip Products" into "lip-products" (used for data-category)
function makeSlug(text) {
  return String(text || "").toLowerCase().trim().replace(/\s+/g, "-");
}

// Stops special characters in product text from breaking the page
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Turns 1850 into "1,850" so prices look nice
function formatPrice(amount) {
  return Number(amount).toLocaleString("en-US");
}

// Build the cards now (this must run BEFORE the ordering code below)
renderProducts();


/* =====================================================
   2. WHATSAPP ORDERING
   ===================================================== */

// Find all "Order on WhatsApp" buttons (they now exist on the page)
const orderButtons = document.querySelectorAll(".button--whatsapp");

// Add a click action to each button
orderButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    handleOrder(button);
  });
});

// This function runs when a customer clicks "Order on WhatsApp"
function handleOrder(button) {

  // Step 1: Find the product in products.js using the id stored on the button
  const productId = Number(button.dataset.productId);
  const product = visibleProducts.find(function (item) {
    return item.id === productId;
  });

  if (!product) {
    return;
  }

  // Step 2: Find the quantity box inside the same card
  const card = button.closest(".product-card");
  const quantityInput = card.querySelector(".quantity__input");

  // Step 3: Read and check the quantity
  const quantity = getValidQuantity(quantityInput);

  // If the quantity is not valid, stop here (the customer sees a message)
  if (quantity === null) {
    return;
  }

  // Step 4: Calculate the total price
  const totalPrice = product.price * quantity;

  // Safety check: never send a message with a broken price
  if (!Number.isFinite(totalPrice)) {
    return;
  }

  // Step 5: Create the WhatsApp message ("\n" means "new line")
  const message =
    "Hello! I would like to order:\n" +
    "Product: " + product.name + "\n" +
    "Price: Rs. " + formatPrice(product.price) + "\n" +
    "Quantity: " + quantity + "\n" +
    "Total: Rs. " + formatPrice(totalPrice) + "\n" +
    "Please confirm my order.";

  // Step 6: Open WhatsApp with the message already written
  openWhatsApp(message);
}

// Makes sure the quantity is a whole number, at least 1.
// Returns the quantity, or null if it is not valid.
function getValidQuantity(input) {
  const quantity = Number(input.value);
  const maxQuantity = Number(input.max) || 20; // uses the max in the HTML (20)

  // Not a number, empty, a decimal (like 1.5), or less than 1
  if (!Number.isInteger(quantity) || quantity < 1) {
    alert("Please choose a quantity of 1 or more.");
    input.value = 1;   // reset to 1
    input.focus();
    return null;
  }

  // Too many items
  if (quantity > maxQuantity) {
    alert("The maximum quantity is " + maxQuantity + ". Please choose a smaller number.");
    input.value = maxQuantity;
    input.focus();
    return null;
  }

  return quantity;
}

// Builds the WhatsApp link and opens it
function openWhatsApp(message) {

  // Safety check: warns you if the number has not been changed yet
  if (SHOP_WHATSAPP_NUMBER.includes("X")) {
    alert("The shop's WhatsApp number has not been set yet.\n\nOpen script.js and replace 923XXXXXXXXX with the real number.");
    return;
  }

  // encodeURIComponent makes the message safe to put inside a link
  const url = "https://wa.me/" + SHOP_WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);

  // Open WhatsApp in a new tab/app
  window.open(url, "_blank", "noopener");
}


/* =====================================================
   3. QUANTITY VALIDATION WHILE TYPING
   If a customer leaves the box empty or types 0 or a
   negative number, it is corrected back to 1.
   ===================================================== */
const quantityInputs = document.querySelectorAll(".quantity__input");

quantityInputs.forEach(function (input) {
  // "change" runs when the customer finishes typing and leaves the box
  input.addEventListener("change", function () {
    const value = Number(input.value);

    if (!Number.isInteger(value) || value < 1) {
      input.value = 1;
    }
  });
});


/* =====================================================
   4. MOBILE MENU
   Shows/hides the navigation on phones.
   The CSS reads aria-expanded="true" to open the menu.
   ===================================================== */
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

if (menuToggle && mainNav) {

  // Open or close the menu when the button is clicked
  menuToggle.addEventListener("click", function () {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  });

  // Close the menu when the Escape key is pressed
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      menuToggle.focus();
    }
  });

  // Close the menu after a customer taps a link
  const navLinks = mainNav.querySelectorAll(".main-nav__link");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    });
  });
}


/* =====================================================
   5. SHOP PHONE / WHATSAPP LINKS
   The contact section and footer links use the same number
   as SHOP_WHATSAPP_NUMBER at the top of this file, so you
   only ever change the number in ONE place.
   (Skipped while the number is still the 923XXXXXXXXX placeholder.)
   ===================================================== */
function updateShopContactLinks() {
  if (SHOP_WHATSAPP_NUMBER.includes("X")) {
    return;
  }

  // Shows 923001234567 as "+92 300 1234567" (non-breaking spaces keep it on one line)
  let displayNumber = "+" + SHOP_WHATSAPP_NUMBER;
  if (SHOP_WHATSAPP_NUMBER.startsWith("92") && SHOP_WHATSAPP_NUMBER.length === 12) {
    displayNumber = "+92\u00A0" + SHOP_WHATSAPP_NUMBER.slice(2, 5) + "\u00A0" + SHOP_WHATSAPP_NUMBER.slice(5);
  }

  document.querySelectorAll("[data-shop-number]").forEach(function (link) {
    if (link.dataset.shopNumber === "whatsapp") {
      link.href = "https://wa.me/" + SHOP_WHATSAPP_NUMBER;
    } else {
      link.href = "tel:+" + SHOP_WHATSAPP_NUMBER;
    }
    link.textContent = displayNumber;
  });
}

updateShopContactLinks();
