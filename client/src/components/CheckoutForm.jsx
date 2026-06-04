import React, { useState } from "react";
import styled from "styled-components";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const StripeInput = styled.div`
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid lightgrey;
  background-color: white;

  .StripeElement {
    width: 100%;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Label = styled.label`
  margin-bottom: 0.35rem;
  font-size: 1rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => (props.$hasError ? "red" : "lightgrey")};
  font-size: 1rem;
`;

const ErrorText = styled.span`
  color: red;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const SuccessText = styled.span`
  color: seagreen;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: block;
`;

const SubmitButton = styled.button`
  margin-top: 0.75rem;
  align-self: flex-start;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  background-color: ${(props) => (props.disabled ? "#888888" : "#ab0000")};
  color: white;
  font-weight: 500;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  width: 100%;
`;

const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($amount: Int!, $items: [OrderItemInput!]!) {
    createPaymentIntent(amount: $amount, items: $items) {
      clientSecret
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($customer: CustomerInput!, $items: [OrderItemInput!]!, $total: Float!) {
    createOrder(customer: $customer, items: $items, total: $total) {
      id
      total
      items {
        name
        size
        quantity
      }
    }
  }
`;

function CheckoutForm({
  amountInCents = 5000,
  billingDetails,
  buttonLabel = "Place Order",
  onPaymentSuccess,
  cartItems,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT);
  const [createOrder] = useMutation(CREATE_ORDER);

  const [email, setEmail] = useState(billingDetails?.email || "");
  const [emailError, setEmailError] = useState("");
  const [cardError, setCardError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setEmailError("");
    setCardError("");
    setGeneralError("");
    setSuccessMessage("");

    if (!email) {
      setEmailError("Email is required for receipt");
      return;
    }

    if (!stripe || !elements) {
      setGeneralError("Stripe has not loaded yet. Please wait a moment.");
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
      setGeneralError("Unable to find card element.");
      return;
    }

    setIsProcessing(true);

    try {
      const safeAmount = Math.round(Number(amountInCents) || 0);

      const orderItems = cartItems.map((item) => ({
        productId: item.id || item.productId,
        name: item.name,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      }))

      const { data } = await createPaymentIntent({
        variables: { amount: safeAmount, items: orderItems },
      });

      const clientSecret = data?.createPaymentIntent?.clientSecret;

      if (!clientSecret) {
        throw new Error("No clientSecret returned from server.");
      }

      const finalBillingDetails = { ...(billingDetails || {}), email };

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: finalBillingDetails,
          },
        }
      );

      if (error) {
        setCardError(error.message || "There was an issue with your card.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
          throw new Error("No cart items found.");
        }

        const orderItems = cartItems.map((item) => ({
          productId: item.id || item.productId || item._id,
          name: item.name,
          price: Number(item.price),
          size: item.size || item.selectedSize,
          color: item.color,
          quantity: Number(item.quantity),
        }));

        const hasBadItem = orderItems.some(
          (item) =>
            !item.productId ||
            !item.name ||
            !item.size ||
            !Number.isFinite(item.price) ||
            !Number.isFinite(item.quantity) ||
            item.quantity <= 0
        );

        if (hasBadItem) {
          console.warn("Bad order items:", orderItems);
          throw new Error("One or more cart items are missing required data.");
        }

        const customer = {
          name: finalBillingDetails.name || "Guest Customer",
          email,
        };

        const orderResult = await createOrder({
          variables: {
            customer,
            items: orderItems,
            total: safeAmount / 100,
          },
        });

        setSuccessMessage("Payment successful!");

        if (typeof onPaymentSuccess === "function") {
          onPaymentSuccess(paymentIntent, orderResult.data?.createOrder);
        }
      } else {
        setGeneralError("Payment did not complete. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setGeneralError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <FormGroup>
        <Label>Credit card number*</Label>
        <StripeInput>
          <CardNumberElement />
        </StripeInput>
      </FormGroup>

      <FormRow>
        <FormGroup>
          <Label>Expire*</Label>
          <StripeInput>
            <CardExpiryElement />
          </StripeInput>
        </FormGroup>

        <FormGroup>
          <Label>CVV*</Label>
          <StripeInput>
            <CardCvcElement />
          </StripeInput>
        </FormGroup>
      </FormRow>

      <FormGroup>
        <Label>Email*</Label>
        <Input
          id="paymentEmail"
          type="email"
          name="email"
          placeholder="Email for receipt"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) {
              setEmailError("");
            }
          }}
          $hasError={!!emailError}
        />
        {emailError && <ErrorText>{emailError}</ErrorText>}
      </FormGroup>

      {cardError && <ErrorText>{cardError}</ErrorText>}
      {generalError && <ErrorText>{generalError}</ErrorText>}
      {successMessage && <SuccessText>{successMessage}</SuccessText>}

      <SubmitButton
        type="button"
        disabled={!stripe || !elements || isProcessing}
        onClick={handlePayment}
      >
        {isProcessing ? "Processing..." : buttonLabel}
      </SubmitButton>
    </div>
  );
}

export default CheckoutForm;