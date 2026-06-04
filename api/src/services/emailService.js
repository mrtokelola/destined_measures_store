import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOrderReceiptEmail = async ({ order }) => {
  const TAX_RATE = 0.0625;

  const subtotal = order.items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;

    return sum + price * quantity;
  }, 0);

  const tax = subtotal * TAX_RATE;

  const shipping =
    order.deliveryOption === "twoDay"
      ? 10
      : order.deliveryOption === "oneDay"
        ? 15
        : 0;

  const total = subtotal + tax + shipping;

  const itemRows = order.items
    .map(
      (item) => `
        <li>
          ${item.name} - Size: ${item.size} - Qty: ${item.quantity} - $${Number(item.price).toFixed(2)}
        </li>
      `
    )
    .join("");

  const msg = {
    to: order.customer.email,
    from: process.env.FROM_EMAIL,
    subject: `Destined Measures Order Receipt #${order.id}`,
    html: `
      <h2>Thank you for your order!</h2>

      <p>Hello ${order.customer.name},</p>

      <p>Your payment was successful.</p>

      <h3>Order Summary</h3>

      <ul>
        ${itemRows}
      </ul>

      <h3>Price Breakdown</h3>

      <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>

      <p>
        <strong>Shipping:</strong>
        ${shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
      </p>

      <p><strong>Tax:</strong> $${tax.toFixed(2)}</p>

      <p><strong>Total:</strong> $${total.toFixed(2)}</p>

      <p>Thank you for shopping with Destined Measures.</p>
    `,
  };

  await sgMail.send(msg);
};