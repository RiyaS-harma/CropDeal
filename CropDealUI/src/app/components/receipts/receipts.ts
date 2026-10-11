import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-receipts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receipts.html',
  styleUrls: ['./receipts.css']
})
export class ReceiptsComponent implements OnInit {
  receipts: any[] = [];
  loading = true;
  totalEarnings = 0;
  thisMonth = 0;
  pendingPayments = 0;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.loadReceipts(); this.loadEarnings(); }

  loadReceipts(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(`${environment.transactionUrl}/api/invoicereceipt/receipts`, { headers }).subscribe({
      next: (data) => { this.receipts = data.map(r => ({ ...r, status: 'Paid' })); this.loading = false; this.cdr.detectChanges(); },
      error: (error) => { console.error('Error loading receipts:', error); this.loading = false; this.cdr.detectChanges(); }
    });
  }

  loadEarnings(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>(`${environment.transactionUrl}/api/transaction/farmer/${userId}/earnings`, { headers }).subscribe({
      next: (data) => { this.totalEarnings = data.totalEarnings || 0; },
      error: (error) => { console.error('Error loading earnings:', error); }
    });
  }

  getStatusClass(status: string) { return { 'paid': status === 'Paid', 'processing': status === 'Processing' }; }

  downloadReceipt(receipt: any): void {
    const doc = new jsPDF();

    doc.setFillColor(46, 125, 50);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('CROP DEAL', 105, 15, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Payment Receipt', 105, 25, { align: 'center' });

    doc.setTextColor(33, 33, 33);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Receipt Details', 20, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const details = [
      ['Receipt #:', `${receipt.id}`],
      ['Order ID:', `${receipt.orderId}`],
      ['Date:', `${new Date(receipt.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`],
      ['Status:', `${receipt.status}`],
    ];

    let y = 62;
    details.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 70, y);
      y += 10;
    });

    doc.setFillColor(232, 245, 233);
    doc.rect(20, y + 5, 170, 20, 'F');
    doc.setTextColor(27, 94, 32);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: \u20B9${receipt.totalAmount}`, 105, y + 18, { align: 'center' });

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your business with CropDeal!', 105, 280, { align: 'center' });

    doc.save(`Receipt_${receipt.id}.pdf`);
  }
}
