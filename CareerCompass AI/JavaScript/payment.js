// --- Payment Configuration ---
const CONFIG = {
    upiId: "6363988040@upi", // REPLACE THIS with your actual UPI ID (PhonePe/GPay/Paytm)
    merchantName: "CareerCompassAI",
    minPrice: 999 // The absolute minimum price allowed (Safety check)
};
const PAYMENT_CONFIG = {
    upiId: "shashankkatti32@okicici",
    merchantName: "CareerCompass",
    // Adding Bank Transfer Details
    bankDetails: {
        accountName: "Shashank Katti",
        accountNumber: "XXXXXXXXXX376401", // Replace with your real number
        ifscCode: "KARBXXXXXXX",       // Replace with your real IFSC
        bankName: "KBL Bank"
    }
};
function openPaymentModal(requestedAmount) {
    const modal = document.getElementById('payment-modal');
    const qrImage = document.getElementById('upi-qr-code');
    const priceDisplay = document.getElementById('display-price');

    // 1. Minimum Price Enforcement
    let finalAmount = requestedAmount;
    if (requestedAmount < CONFIG.minPrice) {
        finalAmount = CONFIG.minPrice;
    }

    // 2. Generate UPI URL 
    // Format: upi://pay?pa=VPA&pn=NAME&am=AMOUNT&cu=CURRENCY
    const upiUrl = `upi://pay?pa=${CONFIG.upiId}&pn=${encodeURIComponent(CONFIG.merchantName)}&am=${finalAmount}&cu=INR`;
    
    // 3. Generate QR Image using a Free API (QRServer)
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

    // 4. Update UI
    qrImage.src = qrApiUrl;
    priceDisplay.innerText = `₹${finalAmount}`;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function confirmPayment() {
    // In a real startup, you'd use a Webhook to verify this. 
    // For MVP, we use a manual verification message.
    alert("Transaction Received! Please allow 5-10 minutes for our AI to verify the transaction ID and activate your Pro features.");
    closePaymentModal();
}