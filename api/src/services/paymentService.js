import stripe from "../lib/stripe.js";

export async function createPaymentIntent(amountInCents) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,     // e.g. 5000 = $50.00
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });

  return paymentIntent;
}