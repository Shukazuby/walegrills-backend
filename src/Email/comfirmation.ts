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
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #4e3d36;
          background-color: #f4f1ed;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 30px;
          background-color: #fffaf5;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid #e3d9cf;
        }

        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0d6ca;
        }

        .header h1 {
          margin: 0;
          font-size: 28px;
          color: #8b5e3c;
        }

        .tagline {
          font-size: 14px;
          color: #a78b73;
        }

        h4 {
          color: #7a5743;
          margin-top: 24px;
        }

        ul {
          padding-left: 20px;
        }

        li {
          margin-bottom: 8px;
        }

        .button {
          display: inline-block;
          background-color: #8b5e3c;
          color: #fff;
          padding: 12px 24px;
          text-decoration: none;
          font-weight: bold;
          border-radius: 8px;
          margin-top: 20px;
          text-align: center;
        }

        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0d6ca;
          font-size: 14px;
          color: #7a5743;
        }

        .footer p {
          margin: 4px 0;
        }

        .contact {
          margin-top: 10px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Wale Grills</h1>
          <div class="tagline">Every Occassion. Anywhere.</div>
        </div>

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
          <li><strong>No. of Guests:</strong> ${payload.guests}</li>
          <li><strong>Service Time:</strong> ${payload.servicetime}</li>
          <li><strong>Serving Time:</strong> ${payload.servingtime}</li>
          <li><strong>Staff Required:</strong> ${payload.staffrequired}</li>
          <li><strong>Event Type:</strong> ${payload.type}</li>
          <li><strong>Event Style:</strong> ${payload.eventStyle}</li>
          <li><strong>Venue:</strong> ${payload.address}</li>
          <li><strong>Cutlery:</strong> £${payload.cutlery}</li>
          <li><strong>Cutlery Items:</strong> £${payload.cutleryItems}</li>
          <li><strong>Dietary Restriction:</strong> £${payload.dietaryres}</li>
          <li><strong>Deposit Paid:</strong> £${payload.deposit}</li>
          <li><strong>Balance Due:</strong> £${payload.balance}</li>
          <li><strong>Payment Deadline:</strong> ${payload.paymentDeadline}</li>

        </ul>

        <h4>Your Selected Items:</h4>
        <ul>
          ${itemListHtml}
        </ul>

        <p>
          To complete your booking, please pay the remaining balance by clicking the button below:
        </p>

        <a href="${payload.balancePaymentLink}" class="button">Pay Your Balance Now</a>

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
          <br />
            Best regards,<br />
            <strong>Zuby</strong><br />
            Wale Grills
          </p>

          <p class="contact">Phone: +44 7951 952265</p>
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
      <title>Payment Confirmation</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #4e3d36;
          background-color: #f4f1ed;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 30px;
          background-color: #fffaf5;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid #e3d9cf;
        }

        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0d6ca;
        }

        .header h1 {
          margin: 0;
          font-size: 28px;
          color: #8b5e3c;
        }

        .tagline {
          font-size: 14px;
          color: #a78b73;
        }

        h4 {
          color: #7a5743;
          margin-top: 24px;
        }

        ul {
          padding-left: 20px;
        }

        li {
          margin-bottom: 8px;
        }

        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0d6ca;
          font-size: 14px;
          color: #7a5743;
        }

        .footer p {
          margin: 4px 0;
        }

        .contact {
          margin-top: 10px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Wale Grills</h1>
          <div class="tagline">Every Occassion. Anywhere.</div>
        </div>

        <p>Dear ${payload.firstName},</p>

        <p>
          We are delighted to confirm that we have received your full payment of
          <strong>£${payload.deposit}</strong> for your upcoming event on
          <strong>${payload.eventDate}</strong>.
        </p>

        <p>
          Thank you so much for your prompt payment and for choosing <strong>Wale Grills</strong>
          to cater your special occasion. We truly appreciate your trust in our service.
        </p>

        <h4>Event Summary:</h4>
        <ul>
          <li><strong>Event Date:</strong> ${payload.eventDate}</li>
          <li><strong>No. of Guests:</strong> ${payload.guests}</li>
          <li><strong>Service Time:</strong> ${payload.servicetime}</li>
          <li><strong>Serving Time:</strong> ${payload.servingtime}</li>
          <li><strong>Staff Required:</strong> ${payload.staffrequired}</li>
          <li><strong>Event Type:</strong> ${payload.type}</li>
          <li><strong>Event Style:</strong> ${payload.eventStyle}</li>
          <li><strong>Venue:</strong> ${payload.address}</li>
          <li><strong>Cutlery:</strong> £${payload.cutlery}</li>
          <li><strong>Cutlery Items:</strong> £${payload.cutleryItems}</li>
          <li><strong>Dietary Restriction:</strong> £${payload.dietaryres}</li>
          <li><strong>Total Paid:</strong> £${payload.deposit}</li>
        </ul>

        <h4>Your Selected Items:</h4>
        <ul>
          ${itemListHtml}
        </ul>

        <p>
          Our team is excited to serve you and ensure a flavorful and memorable experience.
          If there are any last-minute adjustments or special instructions, please let us know at least one week in advance.
        </p>

        <div class="footer">
          <p>
            Once again, thank you for your business. We look forward to grilling up something amazing for you!
          </p>

          <p>
          <br />
            Warm regards,<br />
            <strong>Zuby</strong><br />
            Wale Grills
          </p>

          <p class="contact">Phone: +44 7951 952265</p>
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

  // const body = `
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <meta charset="UTF-8" />
  //         <title>Payment Reminder</title>
  //         <style>
  //           body {
  //             font-family: Arial, sans-serif;
  //             color: #333;
  //             line-height: 1.6;
  //           }
  //           .container {
  //             max-width: 600px;
  //             margin: 0 auto;
  //             padding: 20px;
  //             border: 1px solid #eee;
  //             background-color: #fafafa;
  //           }
  //           .footer {
  //             margin-top: 30px;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="container">
  //           <p>Dear ${payload.firstName},</p>

  //           <p>
  //             This is a friendly reminder that the remaining balance for your event on
  //             <strong>${payload.eventDate}</strong> is due by <strong>today</strong>.
  //           </p>

  //           <h4>Payment Summary:</h4>
  //           <ul>
  //             <li><strong>Event Date:</strong> ${payload.eventDate}</li>
  //             <li><strong>Deposit Paid:</strong> £${payload.deposit}</li>
  //             <li><strong>Balance Due:</strong> £${payload.balance}</li>
  //             <li><strong>Payment Deadline:</strong> ${payload.paymentDeadline}</li>
  //           </ul>

  //           <h4>Your selected items:</h4>
  //           <ul>
  //             ${itemListHtml}
  //           </ul>

  //           <p>
  //             Please ensure your payment is completed on or before the due date to avoid any issues with your booking.
  //           </p>

  //           <div class="footer">
  //             <p>
  //               If you have any questions or need assistance, feel free to reach out.
  //             </p>

  //             <p>
  //               Best regards,<br />
  //               <strong>Zuby</strong><br />
  //               Wale Grills
  //             </p>
  //           </div>
  //         </div>
  //       </body>
  //     </html>
  //   `;

  const body = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Balance Payment Reminder</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #4e3d36;
          background-color: #f4f1ed;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 30px;
          background-color: #fffaf5;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid #e3d9cf;
        }

        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0d6ca;
        }

        .header h1 {
          margin: 0;
          font-size: 28px;
          color: #8b5e3c;
        }

        .tagline {
          font-size: 14px;
          color: #a78b73;
        }

        h4 {
          color: #7a5743;
          margin-top: 24px;
        }

        ul {
          padding-left: 20px;
        }

        li {
          margin-bottom: 8px;
        }

        .button {
          display: inline-block;
          background-color: #8b5e3c;
          color: #fff;
          padding: 12px 24px;
          text-decoration: none;
          font-weight: bold;
          border-radius: 8px;
          margin-top: 20px;
          text-align: center;
        }

        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0d6ca;
          font-size: 14px;
          color: #7a5743;
        }

        .footer p {
          margin: 4px 0;
        }

        .contact {
          margin-top: 10px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Wale Grills</h1>
          <div class="tagline">Every Occassion. Anywhere.</div>
        </div>

        <p>Dear ${payload.firstName},</p>

        <p>
          Thank you for your recent booking with us! We had earlier received your <strong>40% deposit</strong> of
          <strong>£${payload.deposit}</strong> for your event on <strong>${payload.eventDate}</strong>.
        </p>

        <p>
          To complete your booking, the remaining balance of <strong>£${payload.balance}</strong> is due by
          <strong>${payload.deadline}</strong>.
        </p>

        <h4>Event Summary:</h4>
        <ul>
          <li><strong>Event Date:</strong> ${payload.eventDate}</li>
          <li><strong>No. of Guests:</strong> ${payload.guests}</li>
          <li><strong>Service Time:</strong> ${payload.servicetime}</li>
          <li><strong>Serving Time:</strong> ${payload.servingtime}</li>
          <li><strong>Staff Required:</strong> ${payload.staffrequired}</li>
          <li><strong>Event Type:</strong> ${payload.type}</li>
          <li><strong>Event Style:</strong> ${payload.eventStyle}</li>
          <li><strong>Venue:</strong> ${payload.address}</li>
          <li><strong>Cutlery:</strong> £${payload.cutlery}</li>
          <li><strong>Cutlery Items:</strong> £${payload.cutleryItems}</li>
          <li><strong>Dietary Restriction:</strong> £${payload.dietaryres}</li>
          <li><strong>Deposit Paid:</strong> £${payload.deposit}</li>
          <li><strong>Balance Due:</strong> £${payload.balance}</li>
          <li><strong>Payment Deadline:</strong> ${payload.paymentDeadline}</li>
        </ul>

        <p>
          To make your final payment, please click the link below:
        </p>

        <a href="${payload.balancePaymentLink}" class="button">Pay Your Balance Now</a>

        <p>
          If you have any questions or require assistance with the payment, feel free to reach out to us.
        </p>

        <div class="footer">
          <p>
            Thank you once again for choosing <strong>Wale Grills</strong>. We look forward to serving you and
            making your event memorable.
          </p>

          <p>
          <br />
            Best regards,<br />
            <strong>Zuby</strong><br />
            Wale Grills
          </p>

          <p class="contact">Phone: +44 7951 952265</p>
        </div>
      </div>
    </body>
  </html>
`;

  await sendEmail(body, payload.subject, payload.recepient);
}

export async function confirmBookingBalance(payload) {
 const body =
 `
 <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Balance Payment Confirmation</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f1ed;
        margin: 0;
        padding: 0;
        color: #4e3d36;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        padding: 30px;
        background-color: #fffaf5;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid #e3d9cf;
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #e0d6ca;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        color: #8b5e3c;
      }
      .tagline {
        font-size: 14px;
        color: #a78b73;
      }
      .footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #e0d6ca;
        font-size: 14px;
        color: #7a5743;
      }
      .footer p {
        margin: 4px 0;
      }
      .contact {
        margin-top: 10px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Wale Grills</h1>
        <div class="tagline">Every Occasion. Anywhere.</div>
      </div>

      <p>Dear ${payload.name},</p>

      <p>
        We’re excited to let you know that we have received your balance payment of
        <strong>£${payload.eventDate}</strong> for your event on <strong>${payload.eventDate}</strong>.
      </p>

      <p>
        Your booking is now fully confirmed, and we're looking forward to making your event
        deliciously unforgettable.
      </p>

      <div class="footer">
        <p>Thank you once again for choosing Wale Grills.</p>
        <br />
        <p>Warm regards,<br /><strong>Zuby</strong><br />Wale Grills</p>
        <p class="contact">Phone: +44 7951 952265</p>
      </div>
    </div>
  </body>
</html>

 `
    
  await sendEmail(body, payload.subject, payload.recepient);
}

export async function confirmFoodBox(payload) {
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
        <title>Meal Plan Confirmation</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #4e3d36;
            background-color: #f4f1ed;
            margin: 0;
            padding: 0;
          }
  
          .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 30px;
            background-color: #fffaf5;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            border: 1px solid #e3d9cf;
          }
  
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #e0d6ca;
          }
  
          .header h1 {
            margin: 0;
            font-size: 28px;
            color: #8b5e3c;
          }
  
          .tagline {
            font-size: 14px;
            color: #a78b73;
          }
  
          h4 {
            color: #7a5743;
            margin-top: 24px;
          }
  
          ul {
            padding-left: 20px;
          }
  
          li {
            margin-bottom: 8px;
          }
  
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0d6ca;
            font-size: 14px;
            color: #7a5743;
          }
  
          .footer p {
            margin: 4px 0;
          }
  
          .contact {
            margin-top: 10px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Wale Grills</h1>
            <div class="tagline">Every Occasion. Anywhere.</div>
          </div>
  
          <p>Dear ${payload.firstName},</p>
  
          <p>
            Thank you for purchasing our meal plan! We’ve successfully received your meal options
            and our team is already preparing everything with care and attention to flavor.
          </p>
  
          <p>
            Your food box is scheduled for delivery on <strong>${payload.deliveryDate}</strong>.
            Please ensure someone is available to receive it at your preferred address (${payload.address}).
          </p>
  
          <h4>Your Selected Meals:</h4>
          <ul>
            ${itemListHtml}
          </ul>
  
          <p>
            If you have any changes or questions, don’t hesitate to reach out at least 4 days before the delivery date!
          </p>
  
          <div class="footer">
            <p>
              Thank you once again for choosing Wale Grills. We can’t wait for you to enjoy your meals!
            </p>
  
            <p>
            <br />
              Best regards,<br />
              <strong>Zuby</strong><br />
              Wale Grills
            </p>
  
            <p class="contact">Phone: +44 7951 952265</p>
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

export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  const suffix =
    day === 1 || day === 21 || day === 31 ? 'st' :
    day === 2 || day === 22 ? 'nd' :
    day === 3 || day === 23 ? 'rd' : 'th';

  return `${day}${suffix} ${month} ${year}`;
}

