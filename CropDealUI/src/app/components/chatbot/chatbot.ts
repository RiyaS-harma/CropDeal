import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Message {
  text: string;
  isUser: boolean;
  time: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css']
})
export class ChatbotComponent {
  isOpen = false;
  message = '';
  messages: Message[] = [
    { text: 'Hi! I\'m Novo. Your AI Assistant. How can I help you today?', isUser: false, time: this.getTime() }
  ];
  loading = false;

  constructor(private http: HttpClient) {}

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    if (!this.message.trim() || this.loading) return;

    const userMessage = this.message.trim();
    this.messages.push({ text: userMessage, isUser: true, time: this.getTime() });
    this.message = '';
    this.loading = true;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post<any>(`${environment.apiUrl}/api/chat`, { message: userMessage }, { headers }).subscribe({
      next: (res) => {
        this.messages.push({ text: res.response, isUser: false, time: this.getTime() });
        this.loading = false;
      },
      error: (err) => {
        const errorMsg = err.status === 500 && err.error?.message?.includes('429')
          ? 'Too many requests. Please wait a moment and try again.'
          : 'Sorry, I could not process your request. Please try again.';
        this.messages.push({ text: errorMsg, isUser: false, time: this.getTime() });
        this.loading = false;
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  getTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
