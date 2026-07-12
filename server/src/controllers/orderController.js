const Order = require('../../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError, ValidationError } = require('../utils/AppError');
const transporter = require('../../config/email');
const logger = require('../utils/logger');

// Send order notification emails
// Send order notification emails
const sendOrderEmails = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const customerEmail = order.shippingAddress.email;

  const productRows = order.products
    .map(
      (p) =>
        `<tr>
          <td style="padding:12px;border-bottom:1px solid #eee;">${p.title}</td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:center;">${p.size || '-'}</td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:center;">${p.color || '-'}</td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:center;">${p.quantity}</td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;">PKR ${p.price.toLocaleString()}</td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;">PKR ${(p.price * p.quantity).toLocaleString()}</td>
        </tr>`
    )
    .join('');

  const createHtml = (recipientType) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
      </style>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f4f4;padding:40px 10px;">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:640px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);">
              
              <!-- Header Banner -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%); padding: 60px 40px;">
                  <h1 style="color:#ffffff;margin:0;font-family:'Playfair Display', serif;font-size:36px;letter-spacing:4px;text-transform:uppercase;">Luxe Vton</h1>
                  <div style="width:40px;height:2px;background-color:#d4af37;margin:20px auto;"></div>
                  <p style="color:#aaaaaa;margin:0;font-size:14px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">
                    ${recipientType === 'admin' ? 'New Business Order' : 'Order Confirmation'}
                  </p>
                </td>
              </tr>

              <!-- Greeting & Status -->
              <tr>
                <td style="padding:40px 40px 20px;">
                  <h2 style="margin:0 0 15px;font-size:24px;color:#1a1a1a;font-family:'Playfair Display', serif;">
                    ${recipientType === 'admin' ? 'Hello, Administrator' : `Thank You, ${order.shippingAddress.fullName.split(' ')[0]}`}
                  </h2>
                  <p style="margin:0;font-size:16px;line-height:1.6;color:#555555;">
                    ${recipientType === 'admin' 
                      ? `A new order <strong>#${order.orderNumber}</strong> has been placed on your store. Here are the details for processing.` 
                      : `Your order <strong>#${order.orderNumber}</strong> has been received and is currently being prepared for shipment. We'll notify you as soon as it's on its way!`}
                  </p>
                </td>
              </tr>

              <!-- Order Info Cards -->
              <tr>
                <td style="padding:20px 40px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td width="48%" valign="top" style="background-color:#f9f9f9;padding:20px;border-radius:8px;border:1px solid #eeeeee;">
                        <p style="margin:0 0 10px;font-size:12px;color:#999999;text-transform:uppercase;font-weight:600;letter-spacing:1px;">Order Details</p>
                        <p style="margin:5px 0;font-size:14px;color:#333333;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p style="margin:5px 0;font-size:14px;color:#333333;"><strong>Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                        <p style="margin:5px 0;font-size:14px;color:#333333;"><strong>Status:</strong> <span style="background-color:#e6f4ea;color:#1e7e34;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;text-transform:uppercase;">Processing</span></p>
                      </td>
                      <td width="4%">&nbsp;</td>
                      <td width="48%" valign="top" style="background-color:#f9f9f9;padding:20px;border-radius:8px;border:1px solid #eeeeee;">
                        <p style="margin:0 0 10px;font-size:12px;color:#999999;text-transform:uppercase;font-weight:600;letter-spacing:1px;">Shipping To</p>
                        <p style="margin:5px 0;font-size:14px;color:#333333;"><strong>${order.shippingAddress.fullName}</strong></p>
                        <p style="margin:2px 0;font-size:13px;color:#666666;line-height:1.4;">${order.shippingAddress.address}<br>${order.shippingAddress.city}, Pakistan</p>
                        <p style="margin:5px 0;font-size:13px;color:#666666;">${order.shippingAddress.phone}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Items Table -->
              <tr>
                <td style="padding:20px 40px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                    <thead>
                      <tr>
                        <th align="left" style="padding:15px 0;border-bottom:2px solid #1a1a1a;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#1a1a1a;">Product</th>
                        <th align="center" style="padding:15px 0;border-bottom:2px solid #1a1a1a;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#1a1a1a;">Qty</th>
                        <th align="right" style="padding:15px 0;border-bottom:2px solid #1a1a1a;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#1a1a1a;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${order.products.map(p => `
                        <tr>
                          <td style="padding:20px 0;border-bottom:1px solid #eeeeee;">
                            <p style="margin:0;font-size:15px;font-weight:600;color:#1a1a1a;">${p.title}</p>
                            <p style="margin:4px 0 0;font-size:13px;color:#888888;">Size: ${p.size || 'N/A'} | Color: ${p.color || 'N/A'}</p>
                          </td>
                          <td align="center" style="padding:20px 0;border-bottom:1px solid #eeeeee;font-size:15px;color:#555555;">${p.quantity}</td>
                          <td align="right" style="padding:20px 0;border-bottom:1px solid #eeeeee;font-size:15px;font-weight:600;color:#1a1a1a;">PKR ${ (p.price * p.quantity).toLocaleString() }</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Summary Section -->
              <tr>
                <td style="padding:20px 40px 40px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td width="60%">
                        ${order.notes ? `
                          <div style="background-color:#fffbea;padding:15px;border-radius:8px;border:1px solid #ffeeba;">
                            <p style="margin:0 0 5px;font-size:11px;color:#856404;text-transform:uppercase;font-weight:700;">Customer Notes</p>
                            <p style="margin:0;font-size:13px;color:#856404;line-height:1.4;">${order.notes}</p>
                          </div>
                        ` : '&nbsp;'}
                      </td>
                      <td width="40%" align="right">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td align="right" style="padding:5px 0;font-size:14px;color:#888888;">Subtotal</td>
                            <td align="right" style="padding:5px 0;font-size:14px;color:#333333;width:100px;">PKR ${order.totalPrice.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td align="right" style="padding:5px 0;font-size:14px;color:#888888;">Shipping</td>
                            <td align="right" style="padding:5px 0;font-size:14px;color:#1e7e34;font-weight:600;">FREE</td>
                          </tr>
                          <tr>
                            <td align="right" style="padding:15px 0 0;font-size:16px;color:#1a1a1a;font-weight:600;border-top:1px solid #eeeeee;">Grand Total</td>
                            <td align="right" style="padding:15px 0 0;font-size:22px;color:#1a1a1a;font-weight:700;border-top:1px solid #eeeeee;">PKR ${order.totalPrice.toLocaleString()}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="background-color:#f9f9f9;padding:40px;border-top:1px solid #eeeeee;">
                  <p style="margin:0;font-size:14px;color:#1a1a1a;font-weight:600;text-transform:uppercase;letter-spacing:2px;">Luxe Vton</p>
                  <p style="margin:10px 0 0;font-size:12px;color:#999999;">Modern Pakistani Fashion & Virtual Try-On</p>
                  <div style="margin:20px 0;">
                    <a href="#" style="text-decoration:none;display:inline-block;margin:0 10px;color:#1a1a1a;font-size:18px;">•</a>
                    <a href="#" style="text-decoration:none;display:inline-block;margin:0 10px;color:#1a1a1a;font-size:18px;">•</a>
                    <a href="#" style="text-decoration:none;display:inline-block;margin:0 10px;color:#1a1a1a;font-size:18px;">•</a>
                  </div>
                  <p style="margin:0;font-size:11px;color:#bbbbbb;line-height:1.6;">
                    © ${new Date().getFullYear()} Luxe Vton. All rights reserved.<br>
                    You are receiving this email because you placed an order on our store.
                  </p>
                </td>
              </tr>
            </table>
            
            <p style="margin:20px 0 0;font-size:11px;color:#aaaaaa;">
              If you have any questions, please contact our support team.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Send to Admin
  try {
    await transporter.sendMail({
      from: `"Luxe Vton" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `[NEW ORDER] #${order.orderNumber} - PKR ${order.totalPrice.toLocaleString()}`,
      html: createHtml('admin'),
    });
    logger.info(`Admin notification sent for #${order.orderNumber}`);
  } catch (err) {
    logger.error(`Admin email failed for #${order.orderNumber}:`, err);
  }

  // Send to Customer
  if (customerEmail) {
    try {
      await transporter.sendMail({
        from: `"Luxe Vton" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `Your Luxe Vton Order #${order.orderNumber} is Confirmed!`,
        html: createHtml('customer'),
      });
      logger.info(`Customer notification sent for #${order.orderNumber}`);
    } catch (err) {
      logger.error(`Customer email failed for #${order.orderNumber}:`, err);
    }
  }
};

// Guest checkout - create order
const createOrder = asyncHandler(async (req, res) => {
  const { products, totalPrice, shippingAddress, paymentMethod = 'cod', notes = '' } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    throw new ValidationError('No products in order');
  }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.email || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city) {
    throw new ValidationError('Please provide complete shipping details');
  }

  const order = await Order.create({
    products,
    totalPrice,
    shippingAddress,
    paymentMethod,
    notes,
    orderStatus: 'processing',
  });

  // Send email notifications to admin and customer (non-blocking)
  sendOrderEmails(order)
    .then(() => {
      Order.findByIdAndUpdate(order._id, { emailSent: true }).exec();
      logger.info(`Order emails sent for #${order.orderNumber}`);
    })
    .catch((err) => logger.error('Order notification emails failed:', err));

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    order: {
      orderNumber: order.orderNumber,
      totalPrice: order.totalPrice,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
    },
  });
});

// Get order by order number (for tracking)
const getOrderByNumber = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!order) {
    throw new NotFoundError('Order not found');
  }
  res.json({ success: true, order });
});

module.exports = { createOrder, getOrderByNumber };