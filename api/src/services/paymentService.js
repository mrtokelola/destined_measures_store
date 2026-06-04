import stripe from "../lib/stripe.js";
// Sends the order amount to Stripe and returns a Payment Intent.
export async function createPaymentIntent(amountInCents) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });

  return paymentIntent;
}