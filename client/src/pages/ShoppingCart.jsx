import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";

const CartContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const CartTitle = styled.h1`
  margin-bottom: 1.5rem;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid lightgrey;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  font-size: 0.9rem;

  p {
    margin: 0.15rem 0;
  }
`;

const ItemPrice = styled.div`
  font-weight: bold;
`;

const EmptyState = styled.p`
  margin-top: 1rem;
`;

const Summary = styled.div`
  margin-top: 1.5rem;
  text-align: right;
  font-size: 1rem;

  strong {
    font-size: 1.1rem;
  }
`;

const ClearButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid darkgrey;
  background: white;
  cursor: pointer;
`;

function ShoppingCart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    }
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setItems([]);
  };

  return (
    <CartContainer>
      <CartTitle>Shopping Cart</CartTitle>

      {items.length === 0 ? (
        <EmptyState>Your cart is empty.</EmptyState>
      ) : (
        <>
          {items.map((item) => (
            <CartItem key={`${item.id}-${item.size}`}>
              <ItemImage src={item.imageUrl} alt={item.name} />
              <ItemInfo>
                <p>
                  <strong>{item.name}</strong>
                </p>
                <p>Size: {item.size}</p>
                <p>Color: {item.color}</p>
                <p>Quantity: {item.quantity}</p>
              </ItemInfo>
              <ItemPrice>
                ${(item.price * item.quantity).toFixed(2)}
              </ItemPrice>
            </CartItem>
          ))}

          <Summary>
            <p>
              Subtotal: <strong>${subtotal.toFixed(2)}</strong>
            </p>
            <ButtonContainer>
              <ClearButton onClick={handleClearCart}>Clear cart</ClearButton>
              <Link to={`/checkout`}>
                <ClearButton>Checkout</ClearButton>
              </Link>
            </ButtonContainer>
          </Summary>
        </>
      )}
    </CartContainer>
  );
}

export default ShoppingCart;