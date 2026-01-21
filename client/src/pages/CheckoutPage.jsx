import React, { useState } from "react";
import styled from "styled-components";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";


const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 720px;
`;

const Divider = styled.div`
  margin-top: 1.5rem;
  border: none;
  border-top: 1px solid black;
  width: 100%;
`;

const StyledSelect = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  text-align: left;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FormGroup = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const DeliveryOptions = styled.div`
  margin-top: 1.5rem;
`;

const StripeInput = styled.div`
  padding: 0.6rem 0.75rem;
  border-radius: 4px;
  border: 1px solid lightgrey;
  background-color: #fff;

  .StripeElement {
    width: 100%;
  }
`;

const Label = styled.label`
  margin-bottom: 0.35rem;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.$hasError ? "red" : "lightgrey")};
  font-size: 0.9rem;
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.$hasError ? "red" : "lightgrey")};
  font-size: 0.9rem;
`;

const ErrorText = styled.span`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  margin-top: 0.5rem;
  align-self: flex-start;
  padding: 0.6rem 1.5rem;
  border-radius: 4px;
  border: none;
  background-color: #ab0000;
  color: white;
  font-weight: 500;
  cursor: pointer;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }
`;

function CheckoutPage() {
  const stripe = useStripe();
  const elements = useElements();

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    phone: "",
    city: "",
    state: "",
    zip: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("twoDay"); // default
  const [cardError, setCardError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formValues.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formValues.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formValues.address1.trim()) {
      newErrors.address1 = "Address line 1 is required";
    }

    if (!formValues.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const digits = formValues.phone.replace(/\D/g, "");
      if (digits.length < 10) {
        newErrors.phone = "Enter a valid phone number";
      }
    }

    if (!formValues.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formValues.state) {
      newErrors.state = "State is required";
    }

    if (!formValues.zip.trim()) {
      newErrors.zip = "ZIP code is required";
    } else if (!/^\d{5}$/.test(formValues.zip)) {
      newErrors.zip = "Enter a 5-digit ZIP code";
    }

    return newErrors;
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowDeliveryOptions(true);
      console.log("Address form is valid:", formValues);
    } else {
      setShowDeliveryOptions(false);
    }
  };

  const handlePaymentSubmit = async () => {
    setCardError("");

    if (!formValues.email.trim()) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is required for receipt",
      }));
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setCardError("Card input is not ready yet.");
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: `${formValues.firstName} ${formValues.lastName}`,
        email: formValues.email,
        phone: formValues.phone,
        address: {
          line1: formValues.address1,
          line2: formValues.address2,
          city: formValues.city,
          state: formValues.state,
          postal_code: formValues.zip,
        },
      },
    });

    if (error) {
      console.error(error);
      setCardError(error.message || "There was an issue with your card.");
    } else {
      console.log("Stripe PaymentMethod created:", paymentMethod);
      alert("PaymentMethod created — ready to send to backend.");
    }
  };

  return (
    <PageWrapper>
      <FormWrapper>
        <Title>Delivery Address</Title>

        <StyledForm onSubmit={handleAddressSubmit}>
          <FormRow>
            <FormGroup>
              <Label>First name*</Label>
              <Input
                id="inputFirstName"
                type="text"
                name="firstName"
                placeholder="First name"
                value={formValues.firstName}
                onChange={handleChange}
                $hasError={!!errors.firstName}
              />
              {errors.firstName && (
                <ErrorText>{errors.firstName}</ErrorText>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Last name*</Label>
              <Input
                id="inputLastName"
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formValues.lastName}
                onChange={handleChange}
                $hasError={!!errors.lastName}
              />
              {errors.lastName && (
                <ErrorText>{errors.lastName}</ErrorText>
              )}
            </FormGroup>
          </FormRow>

          {/* Address 1 */}
          <FormGroup>
            <Label>Address line 1*</Label>
            <Input
              id="inputAddress"
              type="text"
              name="address1"
              placeholder="1234 Main St"
              value={formValues.address1}
              onChange={handleChange}
              $hasError={!!errors.address1}
            />
            {errors.address1 && (
              <ErrorText>{errors.address1}</ErrorText>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Address line 2</Label>
            <Input
              id="inputAddress2"
              type="text"
              name="address2"
              placeholder="Address line 2 (Optional)"
              value={formValues.address2}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Phone number*</Label>
            <Input
              id="inputPhone"
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={formValues.phone}
              onChange={handleChange}
              $hasError={!!errors.phone}
            />
            {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label>City*</Label>
              <Input
                id="inputCity"
                type="text"
                name="city"
                value={formValues.city}
                onChange={handleChange}
                $hasError={!!errors.city}
              />
              {errors.city && <ErrorText>{errors.city}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>State*</Label>
              <Select
                id="inputState"
                name="state"
                value={formValues.state}
                onChange={handleChange}
                $hasError={!!errors.state}
              >
                <option value="">Choose...</option>
                <option>Alabama</option>
                <option>Alaska</option>
                <option>Arizona</option>
                <option>Arkansas</option>
                <option>California</option>
                <option>Colorado</option>
                <option>Connecticut</option>
                <option>Delaware</option>
                <option>Florida</option>
                <option>Georgia</option>
                <option>Hawaii</option>
                <option>Idaho</option>
                <option>Illinois</option>
                <option>Indiana</option>
                <option>Iowa</option>
                <option>Kansas</option>
                <option>Kentucky</option>
                <option>Louisiana</option>
                <option>Maine</option>
                <option>Maryland</option>
                <option>Massachusetts</option>
                <option>Michigan</option>
                <option>Minnesota</option>
                <option>Mississippi</option>
                <option>Missouri</option>
                <option>Montana</option>
                <option>Nebraska</option>
                <option>Nevada</option>
                <option>New Hampshire</option>
                <option>New Jersey</option>
                <option>New Mexico</option>
                <option>New York</option>
                <option>North Carolina</option>
                <option>North Dakota</option>
                <option>Ohio</option>
                <option>Oklahoma</option>
                <option>Oregon</option>
                <option>Pennsylvania</option>
                <option>Rhode Island</option>
                <option>South Carolina</option>
                <option>South Dakota</option>
                <option>Tennessee</option>
                <option>Texas</option>
                <option>Utah</option>
                <option>Vermont</option>
                <option>Virginia</option>
                <option>Washington</option>
                <option>West Virginia</option>
                <option>Wisconsin</option>
                <option>Wyoming</option>
              </Select>
              {errors.state && <ErrorText>{errors.state}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>Zip*</Label>
              <Input
                id="inputZip"
                type="text"
                name="zip"
                value={formValues.zip}
                onChange={handleChange}
                $hasError={!!errors.zip}
              />
              {errors.zip && <ErrorText>{errors.zip}</ErrorText>}
            </FormGroup>
          </FormRow>

          <SubmitButton type="submit">Save & Continue</SubmitButton>

          {showDeliveryOptions && (
            <>
              <Divider />

              <DeliveryOptions>
                <Title>Delivery Options</Title>

                <StyledSelect className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="deliveryOption"
                    id="deliveryStandard"
                    value="standard"
                    checked={deliveryOption === "standard"}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                  />
                  <label className="form-check-label">Standard delivery (Free)</label>
                </StyledSelect>

                <StyledSelect className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="deliveryOption"
                    id="deliveryTwoDay"
                    value="twoDay"
                    checked={deliveryOption === "twoDay"}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                  />
                  <label className="form-check-label">2–3 business days ($10.00)</label>
                </StyledSelect>

                <StyledSelect className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="deliveryOption"
                    id="deliveryOneDay"
                    value="oneDay"
                    checked={deliveryOption === "oneDay"}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                  />
                  <label className="form-check-label">1–2 business days ($15.00)</label>
                </StyledSelect>
              </DeliveryOptions>

              <Divider />
              <Title>Payment Method</Title>

              <FormGroup>
                <Label>Credit card number*</Label>
                <StripeInput>
                  <CardNumberElement />
                </StripeInput>
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label>Expiry*</Label>
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
                  value={formValues.email}
                  onChange={handleChange}
                  $hasError={!!errors.email}
                />
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </FormGroup>

              {cardError && <ErrorText>{cardError}</ErrorText>}

              <SubmitButton type="button" onClick={handlePaymentSubmit}>
                Place Order
              </SubmitButton>
            </>
          )}
        </StyledForm>
      </FormWrapper>
    </PageWrapper>
  );
}

export default CheckoutPage;