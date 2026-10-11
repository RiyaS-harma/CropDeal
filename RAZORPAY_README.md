# 💳 Razorpay Payment Gateway Integration

## 🎯 Overview

Razorpay payment gateway has been successfully integrated into the CropDeal platform. This integration allows dealers to make secure online payments for crop orders using various payment methods including Credit/Debit Cards, UPI, Net Banking, and Wallets.

---

## ✨ Features

- ✅ Secure payment processing via Razorpay
- ✅ Multiple payment methods (Cards, UPI, Net Banking, Wallets)
- ✅ Payment signature verification for security
- ✅ Automatic order completion on successful payment
- ✅ Invoice generation for dealers
- ✅ Receipt generation for farmers
- ✅ Transaction history tracking
- ✅ Test mode for development
- ✅ Seamless checkout experience

---

## 🚀 Quick Start

### Prerequisites
- Razorpay account (free signup at https://razorpay.com/)
- .NET 10.0 SDK
- Node.js and npm
- SQL Server

### Step 1: Get Razorpay Credentials (5 min)

1. Go to https://razorpay.com/ and sign up
2. Navigate to **Settings → API Keys**
3. Click **Generate Test Keys**
4. Copy your **Key ID** and **Key Secret**

### Step 2: Configure Backend (2 min)

Edit `CropDeal.TransactionService\appsettings.json`:

```json
{
  "Razorpay": {
    "KeyId": "rzp_test_YOUR_KEY_ID_HERE",
    "KeySecret": "YOUR_KEY_SECRET_HERE"
  }
}
```

### Step 3: Restore Packages (1 min)

```bash
cd CropDeal.TransactionService
dotnet restore
```

### Step 4: Start Services (1 min)

```bash
# Start all backend services
START_ALL_SERVICES.bat

# Start frontend (in new terminal)
cd CropDealUI
npm start
```

### Step 5: Test Payment (5 min)

1. Open browser: http://localhost:4200
2. Login as **Dealer**
3. Browse marketplace and add items to cart
4. Create an order
5. Navigate to payment page
6. Select **"Razorpay (Recommended)"**
7. Click **"Pay Now"**
8. Use test card: **4111 1111 1111 1111**
9. CVV: **123**, Expiry: **12/25**, OTP: **1234**
10. Complete payment ✅

---

## 📋 API Endpoints

### 1. Create Razorpay Order

Creates a Razorpay order for payment processing.

```http
POST /api/transaction/create-order
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "orderId": 123
}
```

**Response:**
```json
{
  "orderId": "order_MNqzXYZ123",
  "amount": 5000.00,
  "currency": "INR",
  "keyId": "rzp_test_XXXXX"
}
```

### 2. Verify Payment

Verifies payment signature and processes the transaction.

```http
POST /api/transaction/verify-payment
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "orderId": 123,
  "razorpayOrderId": "order_MNqzXYZ123",
  "razorpayPaymentId": "pay_ABC456",
  "razorpaySignature": "signature_hash"
}
```

**Response:**
```json
{
  "message": "Payment verified and processed successfully",
  "transaction": {
    "id": 1,
    "transactionId": "pay_ABC456",
    "orderId": 123,
    "amount": 5000.00,
    "paymentMethod": "Razorpay",
    "status": 2
  }
}
```

---

## 🔄 Payment Flow

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌──────────┐
│ Dealer  │      │ Frontend │      │ Backend │      │ Razorpay │
└────┬────┘      └────┬─────┘      └────┬────┘      └────┬─────┘
     │                │                  │                │
     │ Click Pay Now  │                  │                │
     ├───────────────>│                  │                │
     │                │ Create Order     │                │
     │                ├─────────────────>│                │
     │                │                  │ Create Order   │
     │                │                  ├───────────────>│
     │                │                  │ Order ID       │
     │                │                  │<───────────────┤
     │                │ Order Details    │                │
     │                │<─────────────────┤                │
     │ Razorpay Modal │                  │                │
     │<───────────────┤                  │                │
     │                │                  │                │
     │ Enter Card     │                  │                │
     ├───────────────>│                  │                │
     │                │ Process Payment  │                │
     │                ├─────────────────────────────────>│
     │                │                  │                │
     │ Payment Success│                  │                │
     │<───────────────┤                  │                │
     │                │ Verify Payment   │                │
     │                ├─────────────────>│                │
     │                │                  │ Verify Sig     │
     │                │                  ├───────────────>│
     │                │                  │ Valid          │
     │                │                  │<───────────────┤
     │                │                  │                │
     │                │                  │ Update Order   │
     │                │                  │ Create Invoice │
     │                │                  │ Create Receipt │
     │                │                  │                │
     │                │ Success          │                │
     │                │<─────────────────┤                │
     │ Redirect       │                  │                │
     │<───────────────┤                  │                │
```

---

## 🧪 Testing

### Test Card Details

| Card Number         | CVV | Expiry      | OTP  | Result  |
|---------------------|-----|-------------|------|---------|
| 4111 1111 1111 1111 | Any | Any future  | 1234 | Success |
| 4012 8888 8888 1881 | Any | Any future  | 1234 | Success |
| 5555 5555 5555 4444 | Any | Any future  | 1234 | Success |

### Test UPI IDs
- `success@razorpay` - Success
- `failure@razorpay` - Failure

### Testing Checklist

- [ ] Create Razorpay order endpoint works
- [ ] Payment modal opens correctly
- [ ] Test card payment succeeds
- [ ] Payment verification works
- [ ] Order status updates to "Completed"
- [ ] Invoice is generated for dealer
- [ ] Receipt is generated for farmer
- [ ] Transaction is recorded in database
- [ ] Error handling works for failed payments

---

## 🔒 Security

### Implemented Security Measures

1. **Payment Signature Verification**
   - HMAC SHA256 signature verification
   - Prevents payment tampering

2. **Server-Side Validation**
   - All payments verified on backend
   - No client-side trust

3. **JWT Authentication**
   - Secure API endpoints
   - Role-based authorization

4. **No Sensitive Data Storage**
   - Card details never stored
   - Only transaction IDs saved

5. **HTTPS Ready**
   - Configured for secure communication

---

## 📁 Project Structure

```
CropDeal.TransactionService/
├── Controllers/
│   └── TransactionController.cs          (Razorpay endpoints added)
├── Services/
│   ├── Interfaces/
│   │   ├── ITransactionService.cs        (Updated)
│   │   └── IRazorpayService.cs           (New)
│   └── Implementations/
│       ├── TransactionService.cs         (Updated)
│       └── RazorpayService.cs            (New)
├── Models/
│   └── DTOs/
│       └── RazorpayDTOs.cs               (New)
├── Repositories/
│   ├── Interfaces/
│   │   └── ITransactionRepository.cs     (Updated)
│   └── Implementations/
│       └── TransactionRepository.cs      (Updated)
├── appsettings.json                      (Razorpay config added)
└── Program.cs                            (Service registered)

CropDealUI/
├── src/
│   ├── index.html                        (Razorpay script added)
│   └── app/
│       └── components/
│           └── payment/
│               ├── payment.ts            (Razorpay integration)
│               └── payment.html          (UI updated)
```

---

## 🐛 Troubleshooting

### Issue: "Invalid API Key"
**Solution:** Check Razorpay credentials in `appsettings.json`. Ensure no extra spaces.

### Issue: "Razorpay is not defined"
**Solution:** Verify Razorpay script is loaded in `index.html`. Check browser console.

### Issue: "Payment signature verification failed"
**Solution:** Ensure Key Secret is correct in `appsettings.json`.

### Issue: Order not completing
**Solution:** 
- Check TransactionService is running on port 5290
- Verify JWT token is valid
- Ensure OrderService is accessible

### Issue: Payment modal not opening
**Solution:**
- Clear browser cache
- Check browser console for errors
- Verify Razorpay script loaded successfully

---

## 📚 Documentation Files

- `RAZORPAY_INTEGRATION_GUIDE.md` - Detailed integration guide
- `RAZORPAY_QUICKSTART.txt` - Quick reference card
- `RAZORPAY_SUMMARY.md` - Summary of changes
- `TODO_RAZORPAY_SETUP.txt` - Setup checklist
- `test-razorpay.ps1` - PowerShell test script

---

## 🔄 Migration to Production

When ready for production:

1. **Get Live Keys**
   - Generate live API keys from Razorpay dashboard
   - Keys will start with `rzp_live_`

2. **Update Configuration**
   - Use environment variables or User Secrets
   - Never commit live keys to repository

3. **Enable HTTPS**
   - Configure SSL certificates
   - Update all URLs to HTTPS

4. **Setup Webhooks**
   - Configure Razorpay webhooks for payment notifications
   - Handle payment failures and refunds

5. **Enable Logging**
   - Log all payment transactions
   - Monitor for suspicious activity

6. **Test Thoroughly**
   - Test with small amounts first
   - Verify all payment methods work

---

## 📞 Support & Resources

- **Razorpay Documentation:** https://razorpay.com/docs/
- **Razorpay Support:** https://razorpay.com/support/
- **Test Cards:** https://razorpay.com/docs/payments/payments/test-card-details/
- **API Reference:** https://razorpay.com/docs/api/

---

## ✅ Checklist

- [x] Backend integration complete
- [x] Frontend integration complete
- [x] Payment signature verification implemented
- [x] Test mode configured
- [x] Documentation created
- [ ] Razorpay credentials configured (YOU NEED TO DO THIS)
- [ ] Packages restored
- [ ] Integration tested
- [ ] Production keys configured (for production)
- [ ] Webhooks setup (optional)

---

## 🎉 Success!

Once you add your Razorpay credentials, the integration is complete and ready to accept payments!

**Next Steps:**
1. Read `TODO_RAZORPAY_SETUP.txt` for immediate action items
2. Get your Razorpay test credentials
3. Update `appsettings.json`
4. Run `dotnet restore`
5. Test the payment flow

Happy coding! 🚀
