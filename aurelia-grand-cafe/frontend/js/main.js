const API_URL = 'http://localhost:5000/api';

// State
let menuItems = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let user = JSON.parse(localStorage.getItem('user')) || null;

// DOM Elements
const navbar = document.getElementById('navbar');
const menuGrid = document.getElementById('menuGrid');
const menuCategories = document.getElementById('menuCategories');
const cartBadge = document.getElementById('cartBadge');
const authBtn = document.getElementById('authBtn');

// Modals
const authModal = document.getElementById('authModal');
const cartModal = document.getElementById('cartModal');
const checkoutModal = document.getElementById('checkoutModal');

// Init
document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();
  fetchMenu();
  updateAuthUI();
  updateCartBadge();
  setupEventListeners();
});

// Scroll Effects
function initScrollEffects() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    reveals.forEach((reveal) => {
      const windowHeight = window.innerHeight;
      const elementTop = reveal.getBoundingClientRect().top;
      const elementVisible = 150;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  });
}

// Fetch Menu
async function fetchMenu() {
  try {
    const res = await fetch(`${API_URL}/menu`);
    if (!res.ok) throw new Error('Failed to fetch menu');
    menuItems = await res.json();
    
    // Check if empty, maybe seed data
    if (menuItems.length === 0) {
      menuGrid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No menu items available. Admin needs to add items.</p>';
      return;
    }

    const categories = ['All', ...new Set(menuItems.map(item => item.category))];
    renderCategories(categories);
    renderMenu(menuItems);
  } catch (error) {
    console.error(error);
    menuGrid.innerHTML = '<p class="text-center text-gold" style="grid-column: 1/-1;">Error loading menu. Is the backend running?</p>';
  }
}

function renderCategories(categories) {
  menuCategories.innerHTML = categories.map(cat => 
    `<button class="btn btn-outline cat-btn" data-category="${cat}" style="padding: 0.4rem 1rem; font-size: 0.9rem;">${cat}</button>`
  ).join('');

  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = e.target.dataset.category;
      if (cat === 'All') {
        renderMenu(menuItems);
      } else {
        renderMenu(menuItems.filter(item => item.category === cat));
      }
    });
  });
}

function renderMenu(items) {
  menuGrid.innerHTML = items.map(item => `
    <div class="menu-card animate-fade-in">
      <div class="menu-img-wrapper">
        <img src="${item.image}" alt="${item.name}" class="menu-img">
      </div>
      <div class="menu-details">
        <div class="menu-title-row">
          <h3 class="menu-title">${item.name} <span class="veg-indicator ${!item.isVeg ? 'non-veg-indicator' : ''}"></span></h3>
          <span class="menu-price">₹${item.price}</span>
        </div>
        <p class="menu-desc">${item.description}</p>
        <div class="menu-footer">
          <span style="color: #ffc107;"><i class="fa-solid fa-star"></i> ${item.rating}</span>
          <button class="btn btn-gold add-to-cart-btn" data-id="${item._id}" style="padding: 0.4rem 1rem; font-size: 0.8rem;">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      addToCart(id);
    });
  });
}

// Cart Logic
function addToCart(id) {
  const item = menuItems.find(i => i._id === id);
  const existingItem = cart.find(i => i.product === id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      product: item._id,
      name: item.name,
      image: item.image,
      price: item.price,
      qty: 1
    });
  }

  saveCart();
  alert(`${item.name} added to cart!`);
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  if (cartModal.classList.contains('active')) {
    renderCart();
  }
}

function updateCartBadge() {
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  cartBadge.innerText = totalQty;
}

function renderCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
    document.getElementById('cartSubtotal').innerText = '₹0';
    document.getElementById('cartTax').innerText = '₹0';
    document.getElementById('cartTotal').innerText = '₹0';
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; background: var(--color-black-light); padding: 0.5rem; border-radius: 4px;">
      <div style="display: flex; gap: 1rem; align-items: center;">
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: 4px; object-fit: cover;">
        <div>
          <h4 style="font-size: 1rem;">${item.name}</h4>
          <span class="text-gold">₹${item.price}</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <button class="btn btn-outline dec-btn" data-id="${item.product}" style="padding: 0.2rem 0.5rem;">-</button>
        <span>${item.qty}</span>
        <button class="btn btn-outline inc-btn" data-id="${item.product}" style="padding: 0.2rem 0.5rem;">+</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.inc-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const item = cart.find(i => i.product === id);
      item.qty += 1;
      saveCart();
    });
  });

  document.querySelectorAll('.dec-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const item = cart.find(i => i.product === id);
      if (item.qty > 1) {
        item.qty -= 1;
      } else {
        cart = cart.filter(i => i.product !== id);
      }
      saveCart();
    });
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  document.getElementById('cartSubtotal').innerText = `₹${subtotal.toFixed(2)}`;
  document.getElementById('cartTax').innerText = `₹${tax.toFixed(2)}`;
  document.getElementById('cartTotal').innerText = `₹${total.toFixed(2)}`;
}

// Event Listeners & Modals
function setupEventListeners() {
  // Cart
  document.getElementById('cartBtn').addEventListener('click', () => {
    renderCart();
    cartModal.classList.add('active');
  });
  document.getElementById('closeCart').addEventListener('click', () => {
    cartModal.classList.remove('active');
  });
  document.getElementById('clearCartBtn').addEventListener('click', () => {
    cart = [];
    saveCart();
  });
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) return alert('Cart is empty!');
    cartModal.classList.remove('active');
    
    if (!user) {
      alert('Please login to checkout.');
      authModal.classList.add('active');
      return;
    }
    checkoutModal.classList.add('active');
  });

  // Checkout Form
  document.getElementById('closeCheckout').addEventListener('click', () => {
    checkoutModal.classList.remove('active');
  });
  document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const address = document.getElementById('chkAddress').value;
    const paymentMethod = document.getElementById('chkPayment').value;

    const itemsPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const taxPrice = itemsPrice * 0.05;
    const shippingPrice = 0;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const orderData = {
      orderItems: cart,
      customerInfo: {
        name: user.name,
        email: user.email,
        phone: '9999999999', // Placeholder
        address: address
      },
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        alert('Order Placed Successfully! ORDER CONFIRMED');
        cart = [];
        saveCart();
        checkoutModal.classList.remove('active');
        document.getElementById('checkoutForm').reset();
      } else {
        alert('Failed to place order.');
      }
    } catch (error) {
      console.error(error);
    }
  });

  // Auth Modal Toggle
  let isLogin = true;
  document.getElementById('authToggleBtn').addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    document.getElementById('authTitle').innerText = isLogin ? 'Login' : 'Register';
    document.getElementById('authSubmitBtn').innerText = isLogin ? 'Login' : 'Register';
    document.getElementById('authToggleText').innerText = isLogin ? "Don't have an account?" : "Already have an account?";
    document.getElementById('authToggleBtn').innerText = isLogin ? 'Register' : 'Login';
    document.getElementById('nameGroup').style.display = isLogin ? 'none' : 'block';
    if (!isLogin) document.getElementById('authName').setAttribute('required', 'true');
    else document.getElementById('authName').removeAttribute('required');
  });

  // Auth Form Submit
  document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('authName').value;
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        user = data;
        updateAuthUI();
        authModal.classList.remove('active');
        alert(isLogin ? 'Logged in successfully' : 'Registered successfully');
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error(error);
    }
  });

  document.getElementById('authBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (user) {
      if (confirm('Do you want to logout?')) {
        localStorage.removeItem('user');
        user = null;
        updateAuthUI();
      }
    } else {
      authModal.classList.add('active');
    }
  });

  document.getElementById('closeAuth').addEventListener('click', () => {
    authModal.classList.remove('active');
  });

  // Reservation
  document.getElementById('reservationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('resName').value,
      email: document.getElementById('resEmail').value,
      phone: document.getElementById('resPhone').value,
      guests: document.getElementById('resGuests').value,
      date: document.getElementById('resDate').value,
      time: document.getElementById('resTime').value,
      specialRequest: document.getElementById('resSpecial').value
    };

    try {
      const res = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const msg = document.getElementById('resMessage');
        msg.innerText = 'Table reserved successfully! We look forward to serving you.';
        msg.style.display = 'block';
        document.getElementById('reservationForm').reset();
      }
    } catch (error) {
      console.error(error);
    }
  });
}

function updateAuthUI() {
  if (user) {
    authBtn.innerHTML = `<i class="fa-solid fa-user-check text-gold"></i>`;
    authBtn.title = `Logout (${user.name})`;
  } else {
    authBtn.innerHTML = `<i class="fa-regular fa-user"></i>`;
    authBtn.title = 'Login/Register';
  }
}
