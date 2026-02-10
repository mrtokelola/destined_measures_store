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
    mutation CreatePaymentIntent($amount: Int!) {
        createPaymentIntent(amount: $amount) {
            clientSecret
        }
    }
`;

const DECREASE_INVENTORY = gql`
  mutation DecreaseInventory($productId: ID!, $size: String!, $quantity: Int!) {
    decreaseInventory(productId: $productId, size: $size, quantity: $quantity) {
      size
      quantity
    }
  }
`;

function CheckoutForm({
  amountInCents = 5000,
  billingDetails,
  buttonLabel = "Place Order",
  onPaymentSuccess,
  cartItem,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT);
  const [decreaseInventory] = useMutation(DECREASE_INVENTORY);

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
      const { data } = await createPaymentIntent({
        variables: { amount: amountInCents },
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
        if (cartItem && cartItem.productId && cartItem.size) {
          const quantityToDecrease = Number(cartItem.quantity) || 0;

          if (quantityToDecrease > 0) {
            try {
              const invResult = await decreaseInventory({
                variables: {
                  productId: cartItem.productId,
                  size: cartItem.size,
                  quantity: quantityToDecrease,
                },
              });

            } catch (invErr) {
              console.error("Inventory update failed:");
            }
          }
        }

        setSuccessMessage("Payment successful!");
        if (typeof onPaymentSuccess === "function") {
          onPaymentSuccess(paymentIntent);
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

  const isSubmitDisabled = !stripe || !elements || isProcessing || !email;

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
        disabled={isSubmitDisabled}
        onClick={handlePayment}
      >
        {isProcessing ? "Processing..." : buttonLabel}
      </SubmitButton>
    </div>
  );
}

export default CheckoutForm;