import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoices.html',
  styleUrls: ['./invoices.css']
})
export class InvoicesComponent implements OnInit {
  invoices: any[] = [];
  loading = true;
  totalSpending = 0;
  thisMonth = 0;
  pendingPayments = 0;
  successMessage = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const msg = localStorage.getItem('paymentSuccessMessage');
    if (msg) {
      this.successMessage = msg;
      localStorage.removeItem('paymentSuccessMessage');
      setTimeout(() => this.successMessage = '', 1500);
    }
    this.loadInvoices();
    this.loadSpending();
  }

  loadInvoices(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.transactionUrl}/api/invoicereceipt/invoices`, { headers }).subscribe({
      next: async (data) => {
        const invoicesWithNames = await Promise.all(data.map(async invoice => {
          const farmerName = await this.getFarmerName(invoice.orderId, headers);
          return { ...invoice, status: 'Paid', farmerName };
        }));
        this.invoices = invoicesWithNames;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.loading = false;
      }
    });
  }

  async getFarmerName(orderId: number, headers: HttpHeaders): Promise<string> {
    try {
      const order = await this.http.get<any>(`${environment.orderUrl}/api/orders/${orderId}`, { headers }).toPromise();
      const farmerId = order.farmerId || order.FarmerId;
      if (farmerId) {
        const user = await this.http.get<any>(`${environment.apiUrl}/api/user/${farmerId}`, { headers }).toPromise();
        return `${user.firstName} ${user.lastName}`;
      }
      return 'Farmer';
    } catch {
      return 'Farmer';
    }
  }

  loadSpending(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(`${environment.transactionUrl}/api/transaction/dealer/${userId}/spending`, { headers }).subscribe({
      next: (data) => {
        this.totalSpending = data.totalSpent || 0;
      },
      error: (error) => {
        console.error('Error loading spending:', error);
      }
    });
  }

  getStatusClass(status: string) {
    return {
      'paid': status === 'Paid',
      'processing': status === 'Processing'
    };
  }

  downloadInvoice(invoice: any): void {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(46, 125, 50);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('CROP DEAL', 105, 15, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Invoice / Payment Receipt', 105, 25, { align: 'center' });

    // Invoice details
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Details', 20, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const details = [
      [`Invoice #:`, `${invoice.id}`],
      [`Order ID:`, `${invoice.orderId}`],
      [`Farmer:`, `${invoice.farmerName || 'N/A'}`],
      [`Date:`, `${new Date(invoice.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`],
      [`Status:`, `${invoice.status}`],
    ];

    let y = 62;
    details.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 70, y);
      y += 10;
    });

    // Amount box
    doc.setFillColor(232, 245, 233);
    doc.rect(20, y + 5, 170, 20, 'F');
    doc.setTextColor(27, 94, 32);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: \u20B9${invoice.totalAmount}`, 105, y + 18, { align: 'center' });

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your business with CropDeal!', 105, 280, { align: 'center' });

    doc.save(`Invoice_${invoice.id}.pdf`);
  }
}
