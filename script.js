// --- UNIFIED ENTERPRISE LIVE DATA ASSETS LAYER ---
// --- CENTRAL MASTER DATABASE ---
const servicesData = [
    { id: 1, name: "Deep Sofa Cleaning", category: "cleaning", price: 899, rating: 4.8, reviews: 142, duration: "2 hrs", img: "https://img.grouponcdn.com/deal/Q2k8Ap7nGLHq2XuuDkJQbX/Xc-1262x758/v1/t2001x1212.jpg", details: "Complete high-power vacuuming, mechanized wet shampooing, and anti-bacterial extraction." },
    { id: 2, name: "Full Home Deep Cleaning", category: "cleaning", price: 2999, rating: 4.9, reviews: 310, duration: "5 hrs", img: "https://www.nobrokerhood.com/blog/wp-content/uploads/2024/12/NoBrokerHood-Home-Cleaning-Services.jpg", details: "Intensive deep sanitation scrubbing of rooms and floor polishing." },
    { id: 3, name: "AC Service (Window/Split)", category: "repair", price: 499, rating: 4.7, reviews: 524, duration: "1 hr", img: "https://content.jdmagicbox.com/v2/comp/hyderabad/z5/040pxx40.xx40.240725095528.v4z5/catalogue/q8gwty5fnlpe8pp-p3xci33zw9.jpg", details: "High pressure jet pump filter wash cleaning and cooling checks." },
    { id: 4, name: "Washing Machine Repair", category: "repair", price: 349, rating: 4.6, reviews: 89, duration: "1.5 hrs", img: "https://5.imimg.com/data5/SELLER/Default/2022/2/LC/FE/OD/25289616/washing-machine-repairing-services-500x500.png", details: "Comprehensive operational breakdown diagnostics and circuit checks." },
    { id: 5, name: "Men's Haircut & Grooming", category: "salon", price: 399, rating: 4.8, reviews: 215, duration: "45 mins", img: "https://www.bubblesindia.com/wp-content/uploads/2019/03/Bubbles_Services_Banner_Mens_Grooming.jpg", details: "Custom haircuts engineered by background-verified expert stylists." },
    { id: 6, name: "Classic Facial & Skin Detox", category: "salon", price: 1199, rating: 4.9, reviews: 173, duration: "60 mins", img: "https://sashaclinics.com/wp-content/uploads/2024/08/different-kinds-of-facial-treatments-you-must-know-az-wilson-aesthetics.jpg", details: "Dermal deep pore cleansing skin exfoliation treatment logs." }
];

// Operational Runtime States
let cart = [];
let bookingsList = [
    { 
        id: "BK-9843", 
        date: "2026-05-20", 
        time: "12:00 PM - 03:00 PM", 
        address: "Flat 102, ABC Greens, Greater Noida",
        total: 499, 
        status: "Completed", 
        payment: "UPI",
        items: [{ name: "AC Service (Window/Split)", qty: 1 }] 
    }
];
let activeCoupon = null;
let authenticatedUser = null;
let currentCategory = 'all';
let currentBookingTab = 'active';

let customerReviews = [
    { name: "Rahul Sharma", rating: 5, text: "Excellent execution parameters. Sofa looks clean!" },
    { name: "Sneha Reddy", rating: 4, text: "Technician arrived timely, professional tools deployment." }
];

// Lifecycles Setup
window.onload = () => {
    renderServices(servicesData);
    setInitialDate();
    renderReviews();
};

function showToast(msg) {
    const con = document.getElementById('toast-container');
    if (!con) return;
    const t = document.createElement('div'); t.classList.add('toast'); t.innerText = msg;
    con.appendChild(t); setTimeout(() => t.remove(), 2500);
}

function showSection(id) {
    document.querySelectorAll('.page-section').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    
    document.getElementById(`${id}-section`).classList.remove('hidden');
    document.getElementById(`nav-${id}`).classList.add('active');
    if (id === 'bookings') renderBookings();
}

// --- RENDER COMPONENT GRID ---
function renderServices(data) {
    const grid = document.getElementById('services-grid'); if (!grid) return;
    grid.innerHTML = "";
    
    data.forEach(s => {
        const d = document.createElement('div'); d.classList.add('service-card');
        d.innerHTML = `
            <img class="card-img" src="${s.img}" alt="${s.name}" onclick="viewServiceDetails(${s.id})">
            <div class="card-content" onclick="viewServiceDetails(${s.id})">
                <span class="badge">${s.category.toUpperCase()}</span>
                <h4 style="margin-top:5px; font-weight:800; font-size:16px;">${s.name}</h4>
                <div class="meta-row"><span>⭐ ${s.rating}</span>|<span>⏱️ ${s.duration}</span></div>
                <div class="price-tag">₹${s.price}</div>
            </div>
            <div class="card-action">${getActionButtonHTML(s)}</div>
        `;
        grid.appendChild(d);
    });
}

function getActionButtonHTML(s) {
    const exist = cart.find(i => i.id === s.id);
    if(exist) return `<div class="qty-counter"><button onclick="updateQty(${s.id}, -1)">-</button><span>${exist.qty}</span><button onclick="updateQty(${s.id}, 1)">+</button></div>`;
    return `<button class="add-to-cart-btn" onclick="addToCart(${s.id})">Add To Cart</button>`;
}

function filterCategory(c) { 
    currentCategory = c; 
    document.querySelectorAll('.categories-bar .cat-btn').forEach(b => b.classList.remove('active')); 
    event.target.classList.add('active'); 
    applyFilters(); 
}

function handleSearch() { applyFilters(); }

function applyFilters() {
    const query = document.getElementById('search-bar').value.toLowerCase().trim();
    let out = servicesData;
    if(currentCategory !== 'all') out = out.filter(i => i.category === currentCategory);
    if(query) out = out.filter(i => i.name.toLowerCase().includes(query));
    renderServices(out);
}

// --- REALTIME CART state CONTROLS ---
function toggleCart() { document.getElementById('cart-sidebar').classList.toggle('open'); }

function addToCart(id) {
    const match = servicesData.find(i => i.id === id);
    if(match && !cart.some(i => i.id === id)) {
        cart.push({ ...match, qty: 1 });
        showToast(`Added ${match.name} to cart.`);
    }
    updateCartUI(); applyFilters();
}

function updateQty(id, chg) {
    const idx = cart.findIndex(i => i.id === id);
    if(idx !== -1) {
        cart[idx].qty += chg;
        if(cart[idx].qty <= 0) cart.splice(idx, 1);
    }
    updateCartUI(); applyFilters();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.reduce((a,c) => a + c.qty, 0);
    const container = document.getElementById('cart-items-container'); if (!container) return;
    container.innerHTML = "";
    
    let baseTotal = cart.reduce((a,c) => a + (c.price * c.qty), 0);
    cart.forEach(i => {
        const r = document.createElement('div'); r.classList.add('cart-item-row');
        r.innerHTML = `<div><h4>${i.name}</h4><p>₹${i.price} x ${i.qty}</p></div>
                       <div class="qty-counter mini"><button onclick="updateQty(${i.id}, -1)">-</button><span>${i.qty}</span><button onclick="updateQty(${i.id}, 1)">+</button></div>`;
        container.appendChild(r);
    });
    
    if(activeCoupon && activeCoupon.code === "FIXERS200") baseTotal = Math.max(0, baseTotal - activeCoupon.value);
    document.getElementById('cart-total-amount').innerText = baseTotal;
    document.getElementById('checkout-total-amount').innerText = baseTotal;
}

// --- STANDARD USER AUTHENTICATION INTEGRITY ENGINE ---
function openAuthModal() { document.getElementById('auth-modal').classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function executeMockAuthLogin() {
    const email = document.getElementById('auth-email-input').value.trim();
    if(!email || !email.includes('@')) { showToast("Invalid email credentials entry formatting."); return; }
    
    authenticatedUser = { email: email, name: email.split('@')[0].toUpperCase() };
    updateAuthUIElements();
    closeModal('auth-modal');
    showToast(`Welcome session profile authorized: ${authenticatedUser.name}`);
}

function executeLogout() {
    authenticatedUser = null;
    updateAuthUIElements();
    showToast("Logged out successfully from baseline profiles context.");
}

function updateAuthUIElements() {
  const zone = document.getElementById('auth-zone');
    if(zone) {
        if(authenticatedUser) {
            zone.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:13px; font-weight:700; color:var(--primary);">👤 Hi, ${authenticatedUser.name}</span>
                    <button class="auth-trigger-btn" onclick="executeLogout()" style="padding:4px 10px; font-size:12px; background:#1f2937; color:white; border:none; border-radius:20px; cursor:pointer; font-weight:600;">Logout</button>
                </div>`;
        } else {
            zone.innerHTML = `<button class="auth-trigger-btn" onclick="openAuthModal()">Login / Register</button>`;
        }
    }
}

// --- STANDARD COUPON VERIFICATION ---
function applyCouponValidation() {
    const raw = document.getElementById('coupon-input-field').value.toUpperCase().trim();
    const msg = document.getElementById('coupon-status-msg');
    if(raw === "FIXERS200") {
        activeCoupon = { code: "FIXERS200", value: 200 };
        msg.style.color = "var(--success)"; msg.innerText = "Coupon Verified! Flat ₹200 Slashed.";
    } else {
        activeCoupon = null; msg.style.color = "red"; msg.innerText = "Invalid Discount Token Input.";
    }
    updateCartUI();
}

// --- STANDARD STEPPED CHECKOUT PIPELINE ROUTING ---
function openCheckout() {
    if(cart.length === 0) return;
    toggleCart(); nextCheckoutStep(1);
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function nextCheckoutStep(s) {
    if(s === 2 && !document.getElementById('address-line1').value.trim()) { showToast("Dispatch Location Details Required."); return; }
    if(s === 3 && !document.getElementById('booking-date').value) { showToast("Please select a target delivery timeline date."); return; }
    
    document.querySelectorAll('.checkout-step-content').forEach(c => c.classList.add('hidden'));
    document.getElementById(`checkout-step-${s}`).classList.remove('hidden');
    
    document.querySelectorAll('.step-indicator').forEach((dot, idx) => {
        if(idx + 1 <= s) dot.classList.add('active'); else dot.classList.remove('active');
    });
}

function prevCheckoutStep(s) {
    document.querySelectorAll('.checkout-step-content').forEach(c => c.classList.add('hidden'));
    document.getElementById(`checkout-step-${s}`).classList.remove('hidden');
}

function confirmFinalBooking() {
    const targetAddress = document.getElementById('address-line1').value;
    const finalDate = document.getElementById('booking-date').value;
    const finalTime = document.getElementById('booking-time').value;
    const totalCost = parseInt(document.getElementById('checkout-total-amount').innerText);
    const payMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    const uid = "BK-" + Math.floor(1000 + Math.random() * 9000);
    
    const newBookingObj = {
        id: uid, 
        date: finalDate, 
        time: finalTime,
        address: targetAddress, 
        total: totalCost, 
        status: "Accepted & Professional Assigned",
        payment: payMethod,
        items: [...cart]
    };
    
    bookingsList.unshift(newBookingObj);
    closeModal('checkout-modal');
    
    triggerDynamicInvoiceRendering(newBookingObj);
    
    cart = []; updateCartUI(); applyFilters();
}

// --- BOOKINGS TAB DASHBOARD MANAGER ---
function switchBookingTab(t) { 
    currentBookingTab = t; 
    document.querySelectorAll('.bookings-tabs .tab-btn').forEach(b => b.classList.remove('active')); 
    event.target.classList.add('active'); 
    renderBookings(); 
}

function renderBookings() {
    
    const node = document.getElementById('bookings-list'); if (!node) return;
    node.innerHTML = "";
    
    const filterSet = bookingsList.filter(b => currentBookingTab === 'active' ? b.status !== "Completed" : b.status === "Completed");
    if(filterSet.length === 0) { node.innerHTML = `<p style="padding:20px; color:var(--text-muted); text-align:center;">No history recorded.</p>`; return; }
    
    filterSet.forEach(b => {
        const item = document.createElement('div'); item.classList.add('booking-card-item');
        item.innerHTML = `
            <div class="booking-top-row" style="display:flex; justify-content:space-between;">
                <strong>Tracking Reference: ${b.id}</strong>
                <span class="status-pill tracking" style="background:#fef3c7; color:#92400e; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:700;">${b.status}</span>
            </div>
            <div style="margin-top:10px; font-size:14px; color:var(--text-muted);">
                <p><strong>Timeline Schedule Slot:</strong> ${b.date} | ${b.time}</p>
                <p><strong>Deployment Location:</strong> ${b.address}</p>
                <p><strong>Payment Mode:</strong> ${b.payment}</p>
                <div class="booking-items-summary" style="margin-top:8px; background:var(--bg-light); padding:10px; border-radius:6px;">
                    <strong>Booked Services:</strong><br>
                    ${b.items && b.items.length > 0 ? b.items.map(i => `• ${i.name} (x${i.qty})`).join('<br>') : 'Standard Home Care Service'}
                </div>
            </div>
            <div style="text-align:right; font-weight:bold; margin-top:10px; color:var(--primary);">Net Transaction Cost: ₹${b.total}</div>
        `;
        node.appendChild(item);
    });
}

// --- DYNAMIC RUNTIME EVALUATIONS FEEDBACK REVIEWS LOOP ---
function renderReviews() {
  const node = document.getElementById('dynamic-reviews-container'); if (!node) return;
    node.innerHTML = "";
    customerReviews.forEach((r, index) => {
        const d = document.createElement('div'); d.classList.add('review-node-item');
        d.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:start;">
                <h5>👤 ${r.name}</h5>
                <button onclick="deleteReview(${index})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:12px; font-weight:600;">Delete</button>
            </div>
            <div style="color:gold; font-size:12px; margin:2px 0;">${"★".repeat(r.rating)}</div>
            <p style="font-size:13px; color:var(--text-muted);">${r.text}</p>
        `;
        node.appendChild(d);
    });
}
function deleteReview(index) {
    customerReviews.splice(index, 1);
    renderReviews();
    showToast("Review deleted successfully.");
}

function openReviewSubmissionModal() { document.getElementById('review-write-modal').classList.remove('hidden'); }
function submitReviewRuntimeEntry() {
    const name = document.getElementById('rev-name-input').value.trim();
    const rate = parseInt(document.getElementById('rev-rating-input').value);
    const text = document.getElementById('rev-text-input').value.trim();
    if(!name || !text) return;
    
    customerReviews.unshift({ name: name, rating: rate, text: text });
    renderReviews(); closeModal('review-write-modal');
    showToast("Feedback structure posted successfully to active main loop.");
}

function setInitialDate() {
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const targetInput = document.getElementById('booking-date');
    if (targetInput) targetInput.value = tomorrow.toISOString().split('T')[0];
}

function viewServiceDetails(id) {
    const service = servicesData.find(s => s.id === id); if (!service) return;
    const body = document.getElementById('detail-modal-body'); if (!body) return;
    
    body.innerHTML = `
        <h2 style="font-size:24px; font-weight:800;">${service.name}</h2>
        <div class="modal-meta" style="margin: 10px 0; color:#6b7280; font-size:14px;"><span>Rating: ⭐ ${service.rating}</span> | <span>Duration: ${service.duration}</span></div>
        <img src="${service.img}" style="width:100%; height:200px; object-fit:cover; border-radius:12px; margin:15px 0;">
        <h3>Service Overview</h3><p style="color:#4b5563; line-height:1.6; font-size:14px;">${service.details}</p>
        <div class="modal-footer-row" style="margin-top:20px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:22px; font-weight:800;">₹${service.price}</span>
            <button class="primary-btn" onclick="addToCart(${service.id}); closeModal('detail-modal');">Add to Cart</button>
        </div>`;
    document.getElementById('detail-modal').classList.remove('hidden');
}
function triggerDynamicInvoiceRendering(order) {
    const targetNode = document.getElementById('invoice-modal-content-area');
    if (!targetNode) return;
    targetNode.innerHTML = `
        <div style="text-align:center; margin-bottom:20px;">
            <h2 style="color:var(--primary); margin-bottom:5px;">FRIENDLY FIXERS</h2>
            <p style="font-size:12px; color:var(--text-muted);">Official Digital Service Invoice</p>
        </div>
        <hr style="border:0; border-top:1px solid var(--border-color); margin:15px 0;">
        <p><strong>Booking ID:</strong> ${order.id}</p>
        <p><strong>Schedule Date & Slot:</strong> ${order.date} | ${order.time}</p>
        <p><strong>Service Location:</strong> ${order.address}</p>
        <p><strong>Payment Mode Selected:</strong> ${order.payment.toUpperCase()}</p>
        <h4 style="margin:20px 0 10px 0; border-bottom:1px solid var(--border-color); padding-bottom:5px;">Order Summary Ledger</h4>
        ${order.items.map(i => `<div style="display:flex; justify-content:space-between; font-size:14px; margin-bottom:6px;"><span>• ${i.name} (x${i.qty})</span><span>₹${i.price * i.qty}</span></div>`).join('')}
        <hr style="border:0; border-top:1px solid var(--border-color); margin:15px 0;">
        <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:16px;"><span>Net Payable Total:</span><span style="color:var(--primary);">₹${order.total}</span></div>
        <p style="font-size:11px; margin-top:25px; color:var(--text-muted); text-align:center;">Thank you for choosing FriendlyFixers! Safe & verified home care.</p>
    `;
    document.getElementById('invoice-modal').classList.remove('hidden');
}