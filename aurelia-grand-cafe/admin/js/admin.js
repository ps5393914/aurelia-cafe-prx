const API_URL = 'http://localhost:5000/api';
let adminToken = localStorage.getItem('adminToken') || null;

document.addEventListener('DOMContentLoaded', () => {
  if (adminToken) {
    document.getElementById('loginOverlay').style.display = 'none';
    loadDashboardData();
  }
});

async function adminLogin() {
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (res.ok && data.role === 'admin') {
      adminToken = data.token;
      localStorage.setItem('adminToken', adminToken);
      document.getElementById('loginOverlay').style.display = 'none';
      loadDashboardData();
    } else {
      alert('Access Denied. Invalid credentials or not an admin.');
    }
  } catch (error) {
    console.error(error);
  }
}

function adminLogout() {
  localStorage.removeItem('adminToken');
  location.reload();
}

function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  
  document.getElementById(`${sectionId}Section`).style.display = 'block';
  event.target.classList.add('active');
  
  document.getElementById('sectionTitle').innerText = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
  
  if (sectionId === 'orders') fetchOrders();
  if (sectionId === 'menu') fetchMenu();
  if (sectionId === 'reservations') fetchReservations();
}

async function authFetch(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken}`,
    ...options.headers
  };
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    adminLogout();
  }
  return response;
}

async function loadDashboardData() {
  // Try to load orders to calculate stats
  fetchOrders(true);
  fetchReservations(true);
}

async function fetchOrders(updateStats = false) {
  try {
    const res = await authFetch(`${API_URL}/orders`);
    const orders = await res.json();
    
    if (updateStats) {
      document.getElementById('statOrders').innerText = orders.length;
      const totalRev = orders.reduce((acc, o) => acc + o.totalPrice, 0);
      document.getElementById('statRevenue').innerText = `₹${totalRev.toFixed(2)}`;
    }
    
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td>${o._id.substring(18)}</td>
        <td>${o.customerInfo.name}</td>
        <td>₹${o.totalPrice}</td>
        <td>
          <select onchange="updateOrderStatus('${o._id}', this.value)" style="background:#333; color:white;">
            <option ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option ${o.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
            <option ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td><button class="btn btn-small">View</button></td>
      </tr>
    `).join('');
  } catch (error) {
    console.error(error);
  }
}

async function updateOrderStatus(id, status) {
  await authFetch(`${API_URL}/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
  alert('Order status updated');
}

async function fetchMenu() {
  try {
    const res = await fetch(`${API_URL}/menu`);
    const menu = await res.json();
    
    const tbody = document.getElementById('menuTableBody');
    tbody.innerHTML = menu.map(m => `
      <tr>
        <td><img src="${m.image}" width="50" style="border-radius:4px;"></td>
        <td>${m.name}</td>
        <td>₹${m.price}</td>
        <td>${m.category}</td>
        <td>
          <button class="btn btn-small" style="background:#dc3545; color:white;" onclick="deleteMenuItem('${m._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error(error);
  }
}

async function addMenuItem() {
  const data = {
    name: document.getElementById('mName').value,
    description: document.getElementById('mDesc').value,
    price: document.getElementById('mPrice').value,
    category: document.getElementById('mCat').value,
    image: document.getElementById('mImg').value,
    isVeg: document.getElementById('mVeg').checked
  };

  try {
    const res = await authFetch(`${API_URL}/menu`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res.ok) {
      alert('Item added');
      document.getElementById('addMenuForm').style.display = 'none';
      fetchMenu();
    }
  } catch (error) {
    console.error(error);
  }
}

async function deleteMenuItem(id) {
  if (!confirm('Are you sure?')) return;
  await authFetch(`${API_URL}/menu/${id}`, { method: 'DELETE' });
  fetchMenu();
}

async function fetchReservations(updateStats = false) {
  try {
    const res = await authFetch(`${API_URL}/reservations`);
    const resvs = await res.json();
    
    if (updateStats) {
      document.getElementById('statReservations').innerText = resvs.length;
    }
    
    const tbody = document.getElementById('reservationsTableBody');
    tbody.innerHTML = resvs.map(r => `
      <tr>
        <td>${r.name}</td>
        <td>${r.date} ${r.time}</td>
        <td>${r.guests}</td>
        <td>
          <select onchange="updateReservationStatus('${r._id}', this.value)" style="background:#333; color:white;">
            <option ${r.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option ${r.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option ${r.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>${r.phone}</td>
      </tr>
    `).join('');
  } catch (error) {
    console.error(error);
  }
}

async function updateReservationStatus(id, status) {
  await authFetch(`${API_URL}/reservations/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}
