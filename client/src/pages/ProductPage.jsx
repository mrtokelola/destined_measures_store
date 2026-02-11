import React, { useMemo, useState } from "react";
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

const FiltersRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 2rem 0.25rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 180px;
`;

const FilterLabel = styled.label`
  font-size: 0.85rem;
`;

const Select = styled.select`
  padding: 0.55rem 0.75rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
`;

const ClearButton = styled.button`
  padding: 0.55rem 0.75rem;
  border: 1px solid #ddd;
  background: #111;
  color: white;
  cursor: pointer;
  height: fit-content;
  align-self: flex-end;
`;

const GET_CLOTHES = gql`
  query GetClothes(
    $page: Int!
    $limit: Int!
    $sort: ClothesSort
    $filter: ClothesFilterInput
  ) {
      clothes(page: $page, limit: $limit, sort: $sort, filter: $filter) {
        items {
          id
          price
          category
          color
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

const GET_CLOTHES_FACETS = gql`
  query GetClothesFilters {
    clothesFilters {
      categories
      colors
      minPrice
      maxPrice
    }
  }
`;

const PRICE_OPTIONS = [
  { value: "ALL", label: "All prices" },
  { value: "UNDER_50", label: "Under $50" },
  { value: "50_75", label: "$50 – $75" },
  { value: "75_PLUS", label: "$75+" },
];

function ProductPage() {
  const ITEMS_PER_PAGE = 6;

  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("ALL");
  const [color, setColor] = useState("ALL");
  const [priceRange, setPriceRange] = useState("ALL");

  const filterInput = useMemo(() => {
    const filterInput = {};

    if (category !== "ALL") filterInput.category = category;
    if (color !== "ALL") filterInput.color = color;

    if (priceRange === "UNDER_50") {
      filterInput.minPrice = 0;
      filterInput.maxPrice = 49.99;
    }

    if (priceRange === "50_75") {
      filterInput.minPrice = 50;
      filterInput.maxPrice = 75;
    }

    if (priceRange === "75_PLUS") {
      filterInput.minPrice = 75.01;
    }

    return filterInput;
  }, [category, color, priceRange]);

  const {
    data: clothesData,
    loading: clothesLoading,
    error: clothesError,
  } = useQuery(GET_CLOTHES, {
    variables: { page, limit: ITEMS_PER_PAGE, sort: "CATEGORY_ORDER", filter: filterInput },
    fetchPolicy: "network-only",
  });

  const {
    data: filtersData,
    loading: filtersLoading,
    error: filtersError,
  } = useQuery(GET_CLOTHES_FACETS);

  const clothes = clothesData?.clothes?.items ?? [];

  const categoryOptions = useMemo(() => {
    const categories = filtersData?.clothesFilters?.categories ?? [];
    return ["ALL", ...categories];
  }, [filtersData]);

  const colorOptions = useMemo(() => {
    const colors = filtersData?.clothesFilters?.colors ?? [];
    return ["ALL", ...colors];
  }, [filtersData]);

  const totalPages = clothesData?.clothes?.totalPages ?? 1;
  const hasNextPage = clothesData?.clothes?.hasNextPage ?? false;
  const hasPrevPage = clothesData?.clothes?.hasPrevPage ?? false;

  const resetFilters = () => {
    setCategory("ALL");
    setColor("ALL");
    setPriceRange("ALL");
    setPage(1);
  };

  const onChangeCategory = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const onChangeColor = (e) => {
    setColor(e.target.value);
    setPage(1);
  };

  const onChangePrice = (e) => {
    setPriceRange(e.target.value);
    setPage(1);
  };

  if (clothesLoading || filtersLoading) {
    return <p>Loading...</p>
  }

  if (clothesError) {
    return <p>Error: {clothesError.message}</p>;
  }

  if (filtersError) {
    return <p>Error: {filtersError.message}</p>;
  }

  return (
    <>
      <Title>Products</Title>

      <FiltersRow>
        <FilterGroup>
          <FilterLabel>Category</FilterLabel>
          <Select value={category} onChange={onChangeCategory}>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All categories" : c}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Price</FilterLabel>
          <Select value={priceRange} onChange={onChangePrice}>
            {PRICE_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Color</FilterLabel>
          <Select value={color} onChange={onChangeColor}>
            {colorOptions.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All colors" : c}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <ClearButton onClick={resetFilters}>Clear</ClearButton>
      </FiltersRow>

      {!clothes.length ? (
        <p style={{ textAlign: "center", paddingTop: "1rem" }}>
          No results for those filters.
        </p>
      ) : (
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
      )}

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

        <PageButton
          disabled={!hasNextPage}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </PageButton>
      </PaginationBar>
    </>
  );
}

export default ProductPage;