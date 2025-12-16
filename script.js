// Product Data
const PRODUCT = {
    id: 1,
    name: "Kunu Aya - 500ml",
    price: 2000
};

// WhatsApp Configuration
const WHATSAPP_NUMBER = "2349097009700"; // Your WhatsApp number

// Delivery Zones
const DELIVERY_ZONES = {
    central: {
        name: "Central Abuja",
        areas: ["Wuse", "Garki", "Asokoro", "Maitama", "Central Business District"],
        fee: 2000
    },
    near: {
        name: "Near Suburbs",
        areas: ["Gwarinpa", "Lugbe", "Kubwa", "Jabi", "Utako", "Wuye"],
        fee: 3000
    },
    far: {
        name: "Far Areas",
        areas: ["Kuje", "Nyanya", "Karshi", "Zuba", "Gwagwalada"],
        fee: 4000
    }
};

// Cart State
let cart = {
    quantity: 0,
    subtotal: 0,
    deliveryFee: 0,
    total: 0
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount();
});

// Quantity Controls
let currentQty = 1;

function increaseQty() {
    currentQty++;
    document.getElementById('quantity').textContent = currentQty;
}

function decreaseQty() {
    if (currentQty > 1) {
        currentQty--;
        document.getElementById('quantity').textContent = currentQty;
    }
}

// Add to Cart
function addToCart() {
    cart.quantity += currentQty;
    cart.subtotal = PRODUCT.price * cart.quantity;
    saveCart();
    updateCartCount();
    alert(`Added ${currentQty} bottle(s) to cart!`);
    currentQty = 1;
    document.getElementById('quantity').textContent = 1;
}

// Cart Functions
function updateCartCount() {
    document.getElementById('cartCount').textContent = cart.quantity;
}

function saveCart() {
    localStorage.setItem('kunuAyaCart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('kunuAyaCart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

function openCart() {
    if (cart.quantity === 0) {
        document.getElementById('cartContent').innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <p>Add some Kunu Aya to get started!</p>
            </div>
        `;
    } else {
        renderCart();
    }
    document.getElementById('cartModal').classList.add('active');
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
}

function updateCartQuantity(newQty) {
    if (newQty < 1) {
        if (confirm('Remove item from cart?')) {
            clearCart();
        }
        return;
    }
    cart.quantity = newQty;
    cart.subtotal = PRODUCT.price * cart.quantity;
    cart.total = cart.subtotal + cart.deliveryFee;
    saveCart();
    updateCartCount();
    renderCart();
}

function increaseCartQty() {
    updateCartQuantity(cart.quantity + 1);
}

function decreaseCartQty() {
    updateCartQuantity(cart.quantity - 1);
}

function clearCart() {
    cart = { quantity: 0, subtotal: 0, deliveryFee: 0, total: 0 };
    saveCart();
    updateCartCount();
    closeCart();
}

// WhatsApp Functions
function orderViaWhatsApp() {
    const deliveryZone = document.getElementById('deliveryZone')?.value;
    const deliveryAddress = document.getElementById('deliveryAddress')?.value;
    
    let message = `🛒 *Kunu Aya Order Request*\n\n`;
    message += `📦 *Order Details:*\n`;
    message += `${cart.quantity}x ${PRODUCT.name}\n`;
    message += `Subtotal: ₦${cart.subtotal.toLocaleString()}\n\n`;
    
    if (deliveryZone && deliveryAddress) {
        message += `📍 *Delivery Information:*\n`;
        message += `Area: ${DELIVERY_ZONES[deliveryZone].name}\n`;
        message += `Address: ${deliveryAddress}\n`;
        message += `Delivery Fee: ₦${DELIVERY_ZONES[deliveryZone].fee.toLocaleString()}\n\n`;
        message += `💰 *Estimated Total: ₦${(cart.subtotal + DELIVERY_ZONES[deliveryZone].fee).toLocaleString()}*\n\n`;
    } else {
        message += `📍 *Delivery:* Will provide details\n\n`;
    }
    
    if (cart.quantity >= 10) {
        message += `🎉 *Note:* This is a bulk order! Please let me know if there's a discount available.\n\n`;
    }
    
    message += `I'd like to discuss payment options (Bank Transfer/Cash on Delivery).`;
    
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function contactWhatsApp() {
    const message = `Hi! I have a question about Kunu Aya.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function renderCart() {
    // Check for bulk order
    const isBulkOrder = cart.quantity >= 10;
    const bulkAlert = isBulkOrder ? `
        <div class="bulk-alert">
            🎉 Bulk Order Detected! Contact us via WhatsApp for special discounts!
        </div>
    ` : '';
    
    const content = `
        ${bulkAlert}
        
        <div class="cart-items">
            <div class="cart-item">
                <div>
                    <strong>${PRODUCT.name}</strong>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
                        <button onclick="decreaseCartQty()" style="background: var(--yellow); color: var(--black); border: none; width: 30px; height: 30px; border-radius: 5px; cursor: pointer; font-weight: bold;">−</button>
                        <span style="font-weight: bold; min-width: 30px; text-align: center;">${cart.quantity}</span>
                        <button onclick="increaseCartQty()" style="background: var(--yellow); color: var(--black); border: none; width: 30px; height: 30px; border-radius: 5px; cursor: pointer; font-weight: bold;">+</button>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: bold;">₦${cart.subtotal.toLocaleString()}</div>
                    <button onclick="clearCart()" style="background: #ff4444; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 3px; cursor: pointer; font-size: 0.85rem; margin-top: 0.3rem;">Remove</button>
                </div>
            </div>
        </div>

        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>₦${cart.subtotal.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>Delivery Fee:</span>
                <span id="deliveryFeeDisplay">${cart.deliveryFee > 0 ? '₦' + cart.deliveryFee.toLocaleString() : 'Select location'}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span id="totalDisplay">₦${(cart.subtotal + cart.deliveryFee).toLocaleString()}</span>
            </div>
        </div>

        <form class="checkout-form" id="checkoutForm">
            <div class="form-group">
                <label for="customerName">Full Name *</label>
                <input type="text" id="customerName" required>
            </div>

            <div class="form-group">
                <label for="customerPhone">Phone Number *</label>
                <input type="tel" id="customerPhone" required pattern="[0-9]{11}">
            </div>

            <div class="form-group">
                <label for="customerEmail">Email *</label>
                <input type="email" id="customerEmail" required>
            </div>

            <div class="form-group">
                <label for="deliveryZone">Delivery Area *</label>
                <select id="deliveryZone" required onchange="updateDeliveryFee()">
                    <option value="">Select your area</option>
                    <option value="central">Central Abuja - ₦2,000 (${DELIVERY_ZONES.central.areas.join(', ')})</option>
                    <option value="near">Near Suburbs - ₦3,000 (${DELIVERY_ZONES.near.areas.join(', ')})</option>
                    <option value="far">Far Areas - ₦4,000 (${DELIVERY_ZONES.far.areas.join(', ')})</option>
                </select>
            </div>

            <div class="form-group">
                <label for="deliveryAddress">Detailed Delivery Address *</label>
                <textarea id="deliveryAddress" rows="3" required placeholder="House number, street name, landmark..."></textarea>
            </div>

            <div style="text-align: center; margin: 1rem 0; color: var(--gray); font-size: 0.9rem;">
                Choose your preferred payment method:
            </div>

            <div class="payment-options">
                <button type="button" class="payment-btn whatsapp" onclick="orderViaWhatsApp()">
                    <span class="payment-btn-icon">💬</span>
                    <span class="payment-btn-text">Order via WhatsApp</span>
                    <span style="font-size: 0.75rem;">(Negotiate/Bank Transfer/COD)</span>
                </button>
                
                <button type="submit" class="payment-btn flutterwave" id="checkoutBtn" ${cart.deliveryFee === 0 ? 'disabled' : ''}>
                    <span class="payment-btn-icon">💳</span>
                    <span class="payment-btn-text">Pay Online</span>
                    <span style="font-size: 0.75rem;">${cart.deliveryFee > 0 ? '₦' + (cart.subtotal + cart.deliveryFee).toLocaleString() : 'Select location first'}</span>
                </button>
            </div>
        </form>
    `;
    
    document.getElementById('cartContent').innerHTML = content;
    
    // Add form submit handler
    document.getElementById('checkoutForm').addEventListener('submit', processCheckout);
}

function updateDeliveryFee() {
    const zone = document.getElementById('deliveryZone').value;
    if (zone) {
        cart.deliveryFee = DELIVERY_ZONES[zone].fee;
        cart.total = cart.subtotal + cart.deliveryFee;
        document.getElementById('deliveryFeeDisplay').textContent = `₦${cart.deliveryFee.toLocaleString()}`;
        document.getElementById('totalDisplay').textContent = `₦${cart.total.toLocaleString()}`;
        
        // Update Flutterwave button
        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.disabled = false;
        checkoutBtn.querySelector('.payment-btn-text').nextElementSibling.textContent = `₦${cart.total.toLocaleString()}`;
        
        saveCart();
    }
}

function processCheckout(event) {
    event.preventDefault();

    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const email = document.getElementById('customerEmail').value;
    const zone = document.getElementById('deliveryZone').value;
    const address = document.getElementById('deliveryAddress').value;

    if (!zone) {
        alert('Please select a delivery area');
        return;
    }

    // Flutterwave Payment
    FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-XXXXX", // Replace with your Flutterwave public key
        tx_ref: "JAYTIGNUT-" + Date.now(),
        amount: cart.total,
        currency: "NGN",
        payment_options: "card,banktransfer,ussd",
        customer: {
            email: email,
            phone_number: phone,
            name: name,
        },
        customizations: {
            title: "Jay's TigerNut Juice",
            description: `${cart.quantity} bottle(s) - Delivery to ${DELIVERY_ZONES[zone].name}`,
            logo: "https://your-logo-url.com/logo.png",
        },
        callback: function (data) {
            if (data.status === "successful") {
                const order = {
                    orderId: data.transaction_id,
                    customer: { name, phone, email },
                    items: { quantity: cart.quantity, price: PRODUCT.price },
                    delivery: { 
                        zone: DELIVERY_ZONES[zone].name, 
                        address: address,
                        fee: cart.deliveryFee 
                    },
                    total: cart.total,
                    date: new Date().toISOString()
                };

                // Clear cart
                cart = { quantity: 0, subtotal: 0, deliveryFee: 0, total: 0 };
                saveCart();
                updateCartCount();
                closeCart();

                alert('Payment successful! Your order has been confirmed. We will contact you shortly for delivery.');
                
                console.log('Order to save:', order);
            }
        },
        onclose: function() {
            alert('Payment window closed');
        },
    });
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        closeCart();
    }
}