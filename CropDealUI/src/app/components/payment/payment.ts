import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class PaymentComponent implements OnInit {
  orderId: number | null = null;
  order: any = null;
  paymentMethod = 'Razorpay';
  loading = true;
  successMessage: string = '';
  errorMessage: string = '';
  private transactionApiUrl = `${environment.transactionUrl}/api/transaction`;
  private orderApiUrl = `${environment.orderUrl}/api/orders`;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] ? +params['orderId'] : null;
      if (this.orderId) {
        this.loadOrder();
      } else {
        this.loading = false;
      }
    });
  }

  loadOrder(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`${this.orderApiUrl}/${this.orderId}`, { headers }).subscribe({
      next: (data) => {
        this.order = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.loading = false;
      }
    });
  }

  processPayment(): void {
    if (!this.orderId) return;
    
    if (this.paymentMethod === 'Razorpay') {
      this.initiateRazorpayPayment();
    } else {
      this.processOtherPayment();
    }
  }

  initiateRazorpayPayment(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Create Razorpay order
    this.http.post(`${this.transactionApiUrl}/create-order`, { orderId: this.orderId }, { headers }).subscribe({
      next: (response: any) => {
        this.openRazorpayCheckout(response);
      },
      error: (error) => {
        console.error('Error creating Razorpay order:', error);
        this.errorMessage = 'Failed to initiate payment. Please try again.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  openRazorpayCheckout(razorpayOrder: any): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const options = {
      key: razorpayOrder.keyId,
      amount: razorpayOrder.amount * 100,
      currency: razorpayOrder.currency,
      name: 'CropDeal',
      description: `Payment for Order #${this.orderId}`,
      order_id: razorpayOrder.orderId,
      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      },
      theme: {
        color: '#10b981'
      },
      handler: (response: any) => {
        this.verifyPayment(response);
      },
      modal: {
        ondismiss: () => {
          console.log('Payment cancelled');
        }
      }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  }

  verifyPayment(razorpayResponse: any): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const payload = {
      orderId: this.orderId,
      razorpayOrderId: razorpayResponse.razorpay_order_id,
      razorpayPaymentId: razorpayResponse.razorpay_payment_id,
      razorpaySignature: razorpayResponse.razorpay_signature
    };

    this.http.post(`${this.transactionApiUrl}/verify-payment`, payload, { headers }).subscribe({
      next: () => {
        localStorage.setItem('paymentSuccessMessage', 'Payment successful! Invoice has been generated.');
        this.router.navigate(['/dealer/invoices']);
      },
      error: (error) => {
        console.error('Payment verification failed:', error);
        this.errorMessage = error?.error?.message || error?.error || 'Payment verification failed. Please contact support.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  processOtherPayment(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${this.transactionApiUrl}?orderId=${this.orderId}&paymentMethod=${encodeURIComponent(this.paymentMethod)}`, {}, { headers }).subscribe({
      next: (response: any) => {
        console.log('Payment response:', response);
        localStorage.setItem('paymentSuccessMessage', 'Payment successful! Invoice has been generated.');
        this.router.navigate(['/dealer/invoices']);
      },
      error: (error) => {
        console.error('Payment error:', error);
        this.errorMessage = error?.error?.message || error?.error || 'Payment failed. Make sure order is confirmed by farmer.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }
}
