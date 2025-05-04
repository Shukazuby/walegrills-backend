import { sendEmail } from 'src/utils';

export async function confirmBookingEmail(payload) {
  const itemListHtml = payload?.itemsSelected
    .map((item) => {
      return `<li>${item?.productId?.name} - Quantity: ${item?.quantity}</li>`;
    })
    .join('');

  const body = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Booking Confirmation</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #eee;
                background-color: #fafafa;
              }
              .footer {
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <p>Dear ${payload.firstName},</p>
    
              <p>
                Thank you for choosing us to cater your event on
                <strong>${payload.eventDate}</strong>.<br />
                We are pleased to confirm your booking and acknowledge your deposit of
                <strong>£${payload.deposit}</strong>.
                Your remaining balance of <strong>£${payload.balance}</strong> is due 3 days
                before the event (by <strong>${payload.paymentDeadline}</strong>).
              </p>
    
              <h4>Event Details:</h4>
              <ul>
                <li><strong>Event Date:</strong> ${payload.eventDate}</li>
                <li><strong>Deposit Paid:</strong> £${payload.deposit}</li>
                <li><strong>Balance Due:</strong> £${payload.balance}</li>
                <li><strong>Payment Deadline:</strong> ${payload.paymentDeadline}</li>
              </ul>
    
              <h4>Your selected items:</h4>
              <ul>
                ${itemListHtml}
              </ul>
    
              <p>
                Should you have any additional requests or changes to your order,
                feel free to reach out to us at least one week in advance.
              </p>
    
              <div class="footer">
                <p>
                  Thank you once again for trusting us to make your event special. We
                  look forward to serving you!
                </p>
    
                <p>
                  Best regards,<br />
                  <strong>Zuby</strong><br />
                  Wale Grills
                  <br />
                </p>
              </div>
            </div>
          </body>
        </html>
      `;
  await sendEmail(body, payload.subject, payload.recepient);
}

export async function confirmFullPaymentBookingEmail(payload) {
  const itemListHtml = payload?.itemsSelected
    .map((item) => {
      return `<li>${item?.productId?.name} - Quantity: ${item?.quantity}</li>`;
    })
    .join('');

  const body = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Booking Confirmation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #eee;
              background-color: #fafafa;
            }
            .footer {
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p>Dear ${payload.firstName},</p>
  
            <p>
              Thank you for choosing us to cater your event on
              <strong>${payload.eventDate}</strong>.<br />
              We are pleased to confirm your booking and acknowledge your full payment of
              <strong>£${payload.deposit}</strong>.
            </p>
  
            <h4>Event Details:</h4>
            <ul>
              <li><strong>Event Date:</strong> ${payload.eventDate}</li>
              <li><strong>Amount Paid:</strong> £${payload.deposit}</li>
            </ul>
  
            <h4>Your selected items:</h4>
            <ul>
              ${itemListHtml}
            </ul>
  
            <p>
              Should you have any additional requests or changes to your order,
              feel free to reach out to us at least one week in advance.
            </p>
  
            <div class="footer">
              <p>
                Thank you once again for trusting us to make your event special. We
                look forward to serving you!
              </p>
  
              <p>
                Best regards,<br />
                <strong>Zuby</strong><br />
                Wale Grills
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

  await sendEmail(body, payload.subject, payload.recepient);
}

export async function PaymentReminderEmail(payload) {
  const itemListHtml = payload?.itemsSelected
    .map((item) => {
      return `<li>${item?.productId?.name} - Quantity: ${item?.quantity}</li>`;
    })
    .join('');

  const body = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Payment Reminder</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #eee;
              background-color: #fafafa;
            }
            .footer {
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p>Dear ${payload.firstName},</p>
  
            <p>
              This is a friendly reminder that the remaining balance for your event on
              <strong>${payload.eventDate}</strong> is due by <strong>today</strong>.
            </p>
  
            <h4>Payment Summary:</h4>
            <ul>
              <li><strong>Event Date:</strong> ${payload.eventDate}</li>
              <li><strong>Deposit Paid:</strong> £${payload.deposit}</li>
              <li><strong>Balance Due:</strong> £${payload.balance}</li>
              <li><strong>Payment Deadline:</strong> ${payload.paymentDeadline}</li>
            </ul>
  
            <h4>Your selected items:</h4>
            <ul>
              ${itemListHtml}
            </ul>
  
            <p>
              Please ensure your payment is completed on or before the due date to avoid any issues with your booking.
            </p>
  
            <div class="footer">
              <p>
                If you have any questions or need assistance, feel free to reach out.
              </p>
  
              <p>
                Best regards,<br />
                <strong>Zuby</strong><br />
                Wale Grills
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

  await sendEmail(body, payload.subject, payload.recepient);
}

export async function calculatePaymentDeadline(
  eventDateStr: string,
): Promise<string> {
  const eventDate = new Date(eventDateStr);
  const deadlineDate = new Date(eventDate);
  deadlineDate.setDate(eventDate.getDate() - 3);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return deadlineDate.toLocaleDateString('en-GB', options);
}
