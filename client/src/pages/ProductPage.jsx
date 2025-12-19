import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Title = styled.h1`
  text-align: center;
`;

const StyledDiv = styled.div`
  text-align: center;
`;

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 2rem;
`;

const ProductLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const PaginationBar = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 2rem 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  background: ${(p) => (p.$active ? "#111" : "white")};
  color: ${(p) => (p.$active ? "white" : "#111")};
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const GET_CLOTHES = gql`
  query GetClothes($page: Int!, $limit: Int!, $sort: ClothesSort) {
    clothes(page: $page, limit: $limit, sort: $sort) {
      items {
        id
        price
        category
        name
        imageUrl
      }
      page
      limit
      totalPages
      totalCount
      hasNextPage
      hasPrevPage
    }
  }
`;

function ProductPage() {
  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery(GET_CLOTHES, {
    variables: { page, limit: ITEMS_PER_PAGE, sort: "CATEGORY_ORDER" },
  });

  const clothes = data?.clothes?.items ?? [];
  const totalPages = data?.clothes?.totalPages ?? 1;
  const hasNextPage = data?.clothes?.hasNextPage ?? false;
  const hasPrevPage = data?.clothes?.hasPrevPage ?? false;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!clothes.length) return <p>No clothes found</p>;

  return (
    <>
      <Title>Products</Title>

      <StyledContainer>
        {clothes.map((item) => (
          <ProductLink key={item.id} to={`/products/${item.id}`}>
            <StyledDiv>
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ width: "500px", height: "auto", objectFit: "cover" }}
              />
              <p>{item.name}</p>
              <p>${Number(item.price).toFixed(2)}</p>
            </StyledDiv>
          </ProductLink>
        ))}
      </StyledContainer>

      <PaginationBar>
        <PageButton disabled={!hasPrevPage} onClick={() => setPage((p) => p - 1)}>
          Prev
        </PageButton>

        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          return (
            <PageButton
              key={pageNum}
              $active={pageNum === page}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </PageButton>
          );
        })}

        <PageButton disabled={!hasNextPage} onClick={() => setPage((p) => p + 1)}>
          Next
        </PageButton>
      </PaginationBar>
    </>
  );
}

export default ProductPage;