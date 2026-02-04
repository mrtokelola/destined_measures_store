import stripe from "../lib/stripe.js";

export async function createPaymentIntent(amountInCents) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });

  return paymentIntent;
}