// --- Unified Configuration ---
const CONFIG = {
    upiId: "shashankkatti32@okicici", 
    merchantName: "CareerCompass",
    bankDetails: {
        accountName: "Shashank Katti",
        accountNumber: "XXXXXXXXXX376401",
        ifscCode: "KARBXXXXXXX",
        bankName: "KBL Bank"
    }
};

/**
 * Opens the payment modal with dynamic plan details
 * @param {number} amount - The price (499, 1499, or 2499)
 * @param {string} planName - The name of the tier
 */
function openPaymentModal(amount, planName) {
    const modal = document.getElementById('payment-modal');
    const qrImage = document.getElementById('upi-qr-code');
    const priceDisplay = document.getElementById('display-price');
    
    // Add these IDs to your HTML elements in index.html/pricing.html
    const planDisplay = document.getElementById('selected-plan-name'); 
    const bankNameDisplay = document.getElementById('bank-acc-name');
    const bankNoDisplay = document.getElementById('bank-acc-no');
    const bankIfscDisplay = document.getElementById('bank-ifsc');

    // 1. Update Plan Details so user isn't confused
    if(planDisplay) planDisplay.innerText = planName;
    priceDisplay.innerText = `₹${amount}`;

    // 2. Update Bank Details for Manual Transfer
    if(bankNameDisplay) bankNameDisplay.innerText = CONFIG.bankDetails.accountName;
    if(bankNoDisplay) bankNoDisplay.innerText = CONFIG.bankDetails.accountNumber;
    if(bankIfscDisplay) bankIfscDisplay.innerText = CONFIG.bankDetails.ifscCode;

    // 3. Generate Dynamic UPI URL 
    const upiUrl = `upi://pay?pa=${CONFIG.upiId}&pn=${encodeURIComponent(CONFIG.merchantName)}&am=${amount}&cu=INR`;
    
    // 4. Generate QR Image
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

    // 5. Show Modal
    qrImage.src = qrApiUrl;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function confirmPayment() {
    const plan = document.getElementById('selected-plan-name').innerText;
    alert(`Request received for ${plan}! Please allow 5-10 minutes for verification. Your receipt will be sent to your registered email.`);
    closePaymentModal();
}