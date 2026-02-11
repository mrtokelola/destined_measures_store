import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { QuantityPicker } from "react-qty-picker";

const StyledContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const ModalImage = styled.img`
  width: 100%;
  max-width: 200px;
  margin: 0 auto 1rem;
  display: block;
  border-radius: 8px;
`;

const AddToCart = styled.button`
  margin-top: 1rem;
  width: 100%;
  height: 50px;
  background-color: white;
  border: 1px solid #dfdfdf;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const Price = styled.p`
  margin-bottom: 0.5rem;
`;

const PickerLabel = styled.p`
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const PickerWrap = styled.div`
  margin-top: 0.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 3rem;
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
`;

const StyledSelect = styled(Select)`
  margin-bottom: 1rem;
`;

const CloseButton = styled(IconButton)`
  position: absolute !important;
  right: 8px;
  top: 8px;
  color: darkgrey;
`;

const GET_CLOTHING = gql`
  query GetClothing($id: ID!) {
    clothing(id: $id) {
      id
      name
      price
      category
      imageUrl
      inStock
      color
      variants {
        size
        quantity
      }
    }
  }
`;

function ProductsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_CLOTHING, {
    variables: { id },
    skip: !id,
  });

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return <StyledContainer>Loading...</StyledContainer>;
  }

  if (error) {
    return <StyledContainer>Error: {error.message}</StyledContainer>;
  }

  if (!data?.clothing) {
    return <StyledContainer>Product not found</StyledContainer>;
  }

  const item = data.clothing;
  const variants = item.variants || [];
  const allSizesSoldOut = variants.length > 0 && variants.every((v) => v.quantity === 0);

  const handleSizeChange = (event) => {
    const value = event.target.value;
    setSelectedSize(value);

    const variant = variants.find((v) => v.size === value);
    if (variant && variant.quantity > 0) {
      setQuantity(1);
    } else {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    let cart = [];

    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          cart = parsed;
        }
      }
    } catch (err) {
      console.error("Failed to read cart from localStorage", err);
      cart = [];
    }

    const index = cart.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.size === selectedSize
    );

    if (index !== -1) {
      const updated = [...cart];
      updated[index] = {
        ...updated[index],
        quantity: updated[index].quantity + quantity,
      };
      cart = updated;
    } else {
      const newItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        color: item.color,
        category: item.category,
        size: selectedSize,
        quantity,
      };

      cart = [...cart, newItem];
    }

    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to save cart to localStorage", err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleGoToCart = () => {
    setIsModalOpen(false);
    navigate("/cart");
  };

  const handleContinueShopping = () => {
    setIsModalOpen(false);
    navigate("/products");
  };

  return (
    <StyledContainer>
      <Grid>
        <div>
          <Img src={item.imageUrl} alt={item.name} />
        </div>

        <div>
          <h2>{item.name}</h2>
          <p>
            <strong>Category:</strong> {item.category}
          </p>
          <p>
            <strong>Color:</strong> {item.color}
          </p>
          <Price>
            <strong>Price:</strong> ${item.price.toFixed(2)}
          </Price>

          <FormControl fullWidth>
            <InputLabel id="size-select-label">Size</InputLabel>
            <StyledSelect
              labelId="size-select-label"
              id="size-select"
              label="Size"
              value={selectedSize}
              onChange={handleSizeChange}
            >
              {variants.map((variant) => {
                const isOutOfStock = variant.quantity === 0;

                return (
                  <MenuItem
                    key={variant.size}
                    value={variant.size}
                    disabled={isOutOfStock}
                    sx={isOutOfStock ? { color: "grey" } : undefined}
                  >
                    {variant.size}
                  </MenuItem>
                );
              })}
            </StyledSelect>

            <PickerWrap>
              <PickerLabel>Quantity</PickerLabel>
              <QuantityPicker
                value={quantity}
                min={1}
                onChange={(value) => setQuantity(value)}
              />
            </PickerWrap>

            <AddToCart
              type="button"
              onClick={handleAddToCart}
              disabled={allSizesSoldOut}
            >
              {allSizesSoldOut ? "Sold out" : "Add to cart"}
            </AddToCart>
          </FormControl>
        </div>
      </Grid>
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="xs">
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Added to cart
          <CloseButton aria-label="close" onClick={handleCloseModal}>
            ×
          </CloseButton>
        </DialogTitle>
        <DialogContent dividers>
          <ModalImage src={item.imageUrl} alt={item.name} />
          <Typography variant="body1" gutterBottom align="center">
            <strong>{item.name}</strong> has been added to your cart.
          </Typography>
          <Typography variant="body2" align="center">
            Size: {selectedSize || "—"}
            <br />
            Quantity: {quantity}
          </Typography>
        </DialogContent>
        <ButtonContainer>
          <Button onClick={handleContinueShopping}>Continue shopping</Button>
          <Button onClick={handleGoToCart}>Go to cart</Button>
        </ButtonContainer>
      </Dialog>
    </StyledContainer>
  );
}

export default ProductsDetail;