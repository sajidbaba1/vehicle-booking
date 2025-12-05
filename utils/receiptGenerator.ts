import { Booking, User } from '../types';

export const generateReceipt = (booking: Booking, user: User) => {
  // In a real app, this would generate a PDF using a library like jsPDF or react-pdf
  // For this demo, we will create a structured HTML file and trigger a download
  
  const receiptContent = `
    <html>
      <head>
        <title>Receipt #${booking.id}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
          .header { border-bottom: 2px solid #C6A667; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
          .logo { font-size: 24px; font-weight: bold; color: #000; text-transform: uppercase; letter-spacing: 2px; }
          .invoice-title { font-size: 36px; color: #C6A667; font-weight: 300; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .meta-box h4 { margin: 0 0 5px 0; font-size: 10px; text-transform: uppercase; color: #999; letter-spacing: 1px; }
          .meta-box p { margin: 0; font-size: 14px; font-weight: 500; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th { text-align: left; border-bottom: 1px solid #eee; padding: 10px 0; font-size: 10px; text-transform: uppercase; color: #999; }
          .table td { border-bottom: 1px solid #eee; padding: 15px 0; font-size: 14px; }
          .total-section { display: flex; justify-content: flex-end; }
          .total-box { width: 250px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .total-row { display: flex; justify-content: space-between; border-top: 2px solid #000; padding-top: 15px; font-weight: bold; font-size: 18px; }
          .footer { margin-top: 60px; font-size: 10px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Prestige Motors</div>
          <div class="invoice-title">RECEIPT</div>
        </div>
        
        <div class="meta">
          <div class="meta-box">
            <h4>Billed To</h4>
            <p>${user.name}</p>
            <p>${user.email}</p>
          </div>
          <div class="meta-box">
            <h4>Booking Details</h4>
            <p>ID: #${booking.id}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="meta-box">
            <h4>Payment Method</h4>
            <p>Credit Card / Wallet</p>
            <p>Status: Paid</p>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Dates</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${booking.vehicleName}</strong><br>
                <span style="color: #666; font-size: 12px;">Prestige Rental Service</span>
              </td>
              <td>${booking.startDate} to ${booking.endDate}</td>
              <td style="text-align: right;">$${booking.totalPrice.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-box">
            <div class="row">
              <span>Subtotal</span>
              <span>$${(booking.totalPrice).toLocaleString()}</span>
            </div>
            <div class="row">
              <span>Tax (0%)</span>
              <span>$0.00</span>
            </div>
            <div class="total-row">
              <span>Total Paid</span>
              <span style="color: #C6A667;">$${booking.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing Prestige Motors. Drive safe.</p>
          <p>1200 Wilshire Blvd, Los Angeles, CA 90017 | 1 (800) PRESTIGE</p>
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([receiptContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Prestige_Receipt_${booking.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};