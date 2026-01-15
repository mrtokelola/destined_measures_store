export async function getClothingById(id, Clothing) {
  return Clothing.findById(id);
}


export async function listClothes(Clothing, { page = 1, limit = 6, sort, filter }) {

  const queryFilter = {};

  const filterInput = filter ?? {};

  if (filterInput.category) queryFilter.category = filterInput.category;
  if (filterInput.color) queryFilter.color = filterInput.color;

  const minPrice = typeof filterInput.minPrice === "number" ? filterInput.minPrice : typeof filterInput.priceMin === "number" ? filterInput.priceMin : null;
  const maxPrice = typeof filterInput.maxPrice === "number" ? filterInput.maxPrice : typeof filterInput.priceMax === "number" ? filterInput.priceMax : null;

  if (minPrice !== null || maxPrice !== null) {
    queryFilter.price = {};

    if (minPrice !== null) {
      queryFilter.price.$gte = minPrice;
    }

    if (maxPrice !== null) {
      queryFilter.price.$lte = maxPrice;
    }
  }

  const totalCount = await Clothing.countDocuments(queryFilter);
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const safePage = Math.min(Math.max(1, page), totalPages);
  const skip = (safePage - 1) * limit;

  let items = await Clothing.find(queryFilter).skip(skip).limit(limit);

  return {
    items,
    totalCount,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export async function getClothesFilters(Clothing) {
  const clothes = await Clothing.find({}, "category color price");
  const categories = [...new Set(clothes.map(item => item.category).filter(Boolean))].sort();
  const colors = [...new Set(clothes.map(item => item.color).filter(Boolean))].sort();
  const prices = clothes.map(item => Number(item.price)).filter(Number.isFinite);

  return {
    categories,
    colors,
    minPrice: prices.length ? Math.min(...prices) : null,
    maxPrice: prices.length ? Math.max(...prices) : null,
  };
}
