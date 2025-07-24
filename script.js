// Product Data
const products = [
  {
    id: 1,
    name: "Men's Jacket",
    price: 49.99,
    image: "https://picsum.photos/200/250?random=1",
    description: "Stylish men's jacket for all seasons.",
    category: "men"
  },
  {
    id: 2,
    name: "Women's Dress",
    price: 39.99,
    image: "https://picsum.photos/200/250?random=2",
    description: "Elegant women's dress for any occasion.",
    category: "women"
  },
  {
    id: 3,
    name: "Kids' T-shirt",
    price: 14.99,
    image: "https://picsum.photos/200/250?random=3",
    description: "Comfortable t-shirt for kids.",
    category: "kids"
  },
  {
    id: 4,
    name: "Men's Jeans",
    price: 34.99,
    image: "https://picsum.photos/200/250?random=4",
    description: "Classic fit men's jeans.",
    category: "men"
  },
  {
    id: 5,
    name: "Women's Blouse",
    price: 29.99,
    image: "https://picsum.photos/200/250?random=5",
    description: "Chic women's blouse for work or play.",
    category: "women"
  },
  {
    id: 6,
    name: "Kids' Shorts",
    price: 12.99,
    image: "https://picsum.photos/200/250?random=6",
    description: "Cool shorts for active kids.",
    category: "kids"
  }
];

// Cart Logic
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  alert('Added to cart!');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

function renderCart() {
  const cartBody = document.getElementById('cart-body');
  if (!cartBody) return;
  if (cart.length === 0) {
    cartBody.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  let html = '<ul>';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    html += `<li>
      <img src="${item.image}" alt="${item.name}" style="width:40px;vertical-align:middle;margin-right:8px;">
      ${item.name} x ${item.qty} - $${(item.price * item.qty).toFixed(2)}
      <button onclick="removeFromCart(${item.id})" style="margin-left:10px;">Remove</button>
    </li>`;
  });
  html += `</ul><p><strong>Total: $${total.toFixed(2)}</strong></p>`;
  cartBody.innerHTML = html;
}

// Product Modal Logic
function showProductModal(productId) {
  const product = products.find(p => p.id === productId);
  const modal = document.getElementById('product-modal');
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <img src="${product.image}" alt="${product.name}" style="width:100%;border-radius:8px;">
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <p style="color:#d12d2d;font-weight:bold;">$${product.price}</p>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
  `;
  modal.classList.remove('hidden');
}

// Modal Close Logic
function setupModalClose() {
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.onclick = () => document.getElementById('product-modal').classList.add('hidden');
  });
  document.querySelectorAll('.close-cart').forEach(btn => {
    btn.onclick = () => document.getElementById('cart-modal').classList.add('hidden');
  });
  window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
      event.target.classList.add('hidden');
    }
  };
}

// Cart Modal Logic
function setupCartModal() {
  document.querySelectorAll('#cart-link').forEach(link => {
    link.onclick = (e) => {
      e.preventDefault();
      renderCart();
      document.getElementById('cart-modal').classList.remove('hidden');
    };
  });
}

// Render Products on products.html
function renderProductsPage() {
  const container = document.getElementById('products-container');
  if (!container) return;
  // Filter by category if present in URL
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  let filtered = products;
  if (category) {
    filtered = products.filter(p => p.category === category);
    document.querySelector('.product-listing h2').textContent = category.charAt(0).toUpperCase() + category.slice(1) + ' Products';
  }
  container.innerHTML = filtered.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button class="view-product" data-id="${product.id}">View</button>
    </div>
  `).join('');
  // Attach event listeners
  container.querySelectorAll('.view-product').forEach(btn => {
    btn.onclick = () => showProductModal(Number(btn.dataset.id));
  });
}

// Attach event listeners for featured products on index.html
function setupFeaturedProductButtons() {
  document.querySelectorAll('.view-product').forEach(btn => {
    btn.onclick = () => showProductModal(Number(btn.dataset.id));
  });
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  setupModalClose();
  setupCartModal();
  renderProductsPage();
  setupFeaturedProductButtons();
});