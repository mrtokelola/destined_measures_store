import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {Link, useParams} from "react-router-dom";
import styled from "styled-components";
import { FormControl, Select, InputLabel, MenuItem, } from "@mui/material";
import { QuantityPicker } from "react-qty-picker";

const StyledContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const AddToCart = styled.button`
  margin-top: 1rem;
  width: 100%;
  height: 50px;
  background-color: white;
  border: 1px solid #dfdfdf;
`;

const Price = styled.p`
  margin-bottom: .5rem;
`;

const PickerLabel = styled.p`
  text-transform: uppercase;
  margin-bottom: .5rem;
`;


const PickerWrap = styled.div`
  .quantity-picker {
    display: inline-flex;
    align-items: center;
    width: fit-content;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

  const { data, loading, error } = useQuery(GET_CLOTHING, {
    variables: { id },
    skip: !id,
  });

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

  return (
    <StyledContainer>
      <Grid>
        <div>
          <Img src={item.imageUrl} alt={item.name} />
        </div>

        <div>
          <h2>{item.name}</h2>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>color:</strong> {item.color}</p>
          <Price><strong>Price:</strong> ${item.price.toFixed(2)}</Price>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Size</InputLabel>
            <StyledSelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Size"
            >
              <MenuItem value={10}>Small</MenuItem>
              <MenuItem value={20}>Medium</MenuItem>
              <MenuItem value={30}>Large</MenuItem>
              <MenuItem value={30}>XL</MenuItem>
              <MenuItem value={30}>XXL</MenuItem>
            </StyledSelect>
            <PickerWrap>
              <PickerLabel>Quantity</PickerLabel>
              <QuantityPicker />
            </PickerWrap>
            <Link to={``}>
              <AddToCart>Add to cart</AddToCart>
            </Link>
          </FormControl>
        </div>
      </Grid>
    </StyledContainer>
  );
}

export default ProductsDetail;
