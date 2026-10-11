# Razorpay Integration Setup Guide

## Overview
Razorpay payment gateway has been integrated into the CropDeal Transaction Service and Angular frontend.

## Backend Setup

### 1. Install Razorpay Package
The Razorpay NuGet package has been added to `CropDeal.TransactionService.csproj`:
```bash
cd CropDeal.TransactionService
dotnet restore
```

### 2. Configure Razorpay Credentials
Update `appsettings.json` with your Razorpay credentials:

```json
{
  "Razorpay": {
    "KeyId": "YOUR_RAZORPAY_KEY_ID",
    "KeySecret": "YOUR_RAZORPAY_KEY_SECRET"
  }
}
```

**To get Razorpay credentials:**
1. Sign up at https://razorpay.com/
2. Go to Settings → API Keys
3. Generate Test/Live keys
4. Copy Key ID and Key Secret

### 3. New API Endpoints

#### Create Razorpay Order
```
POST /api/transaction/create-order
Authorization: Bearer {token}
Body: { "orderId": 123 }
Response: {
  "orderId": "order_xyz123",
  "amount": 1000.00,
  "currency": "INR",
  "keyId": "rzp_test_xxx"
}
```

#### Verify Payment
```
POST /api/transaction/verify-payment
Authorization: Bearer {token}
Body: {
  "orderId": 123,
  "razorpayOrderId": "order_xyz123",
  "razorpayPaymentId": "pay_abc456",
  "razorpaySignature": "signature_hash"
}
Response: {
  "message": "Payment verified and processed successfully",
  "transaction": { ... }
}
```

## Frontend Setup

### 1. Razorpay Checkout Script
The Razorpay checkout script has been added to `index.html`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 2. Payment Flow
1. User selects "Razorpay" as payment method
2. Click "Pay Now" button
3. Backend creates Razorpay order
4. Razorpay checkout modal opens
5. User completes payment
6. Payment response is verified on backend
7. Transaction is recorded and order is completed

### 3. Payment Component Features
- Razorpay is now the default payment method
- Seamless checkout experience
- Automatic payment verification
- Error handling and user feedback

## Testing

### Test Mode (Recommended for Development)
1. Use Razorpay Test API keys
2. Test card numbers:
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date
   - OTP: 1234

### Test Payment Flow
1. Login as Dealer
2. Add items to cart and create order
3. Navigate to payment page
4. Select "Razorpay" payment method
5. Click "Pay Now"
6. Complete payment in Razorpay modal
7. Verify transaction is recorded

## Security Features
- Payment signature verification using HMAC SHA256
- Secure token-based authentication
- Server-side payment validation
- No sensitive data stored in frontend

## Production Checklist
- [ ] Replace test keys with live Razorpay keys
- [ ] Move Razorpay credentials to environment variables/User Secrets
- [ ] Enable HTTPS for all API endpoints
- [ ] Set up Razorpay webhooks for payment notifications
- [ ] Implement proper error logging
- [ ] Add payment retry mechanism
- [ ] Configure Razorpay payment methods (UPI, Cards, NetBanking, etc.)

## Files Modified/Created

### Backend
- `CropDeal.TransactionService.csproj` - Added Razorpay package
- `appsettings.json` - Added Razorpay configuration
- `Services/Interfaces/IRazorpayService.cs` - New
- `Services/Implementations/RazorpayService.cs` - New
- `Models/DTOs/RazorpayDTOs.cs` - New
- `Controllers/TransactionController.cs` - Added Razorpay endpoints
- `Services/Interfaces/ITransactionService.cs` - Updated
- `Services/Implementations/TransactionService.cs` - Updated
- `Repositories/Interfaces/ITransactionRepository.cs` - Updated
- `Repositories/Implementations/TransactionRepository.cs` - Updated
- `Program.cs` - Registered Razorpay service

### Frontend
- `src/index.html` - Added Razorpay script
- `src/app/components/payment/payment.ts` - Integrated Razorpay checkout
- `src/app/components/payment/payment.html` - Added Razorpay option

## Support
For Razorpay documentation: https://razorpay.com/docs/
For integration issues: https://razorpay.com/support/
