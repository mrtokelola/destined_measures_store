export async function getClothingById(id, Clothing) {
  return Clothing.findById(id);
}
export async function listClothes(Clothing, { page = 1, limit = 6, sort, filter }) {
  const categoryOrder = ["Hoodie", "Tee", "Shorts"];
  const queryFilter = { inStock: true };
  const filterInput = filter ?? {};

  if (filterInput.category) queryFilter.category = filterInput.category;
  if (filterInput.color) queryFilter.color = filterInput.color;

  const minPrice = typeof filterInput.minPrice === "number" ? filterInput.minPrice : null;
  const maxPrice = typeof filterInput.maxPrice === "number" ? filterInput.maxPrice : null;

  if (minPrice !== null || maxPrice !== null) {
    queryFilter.price = {};
    if (minPrice !== null) queryFilter.price.$gte = minPrice;
    if (maxPrice !== null) queryFilter.price.$lte = maxPrice;
  }

  const skip = (page - 1) * limit;
  const [allItems, totalCount] = await Promise.all([
    Clothing.find(queryFilter),
    Clothing.countDocuments(queryFilter),
  ]);

  let sortedItems = allItems;

  if (sort === "CATEGORY_ORDER") {
    sortedItems = [...allItems].sort((a, b) => {
      return (
        categoryOrder.indexOf(a.category) -
        categoryOrder.indexOf(b.category)
      );
    });
  }

  const items = sortedItems.slice(skip, skip + limit);
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

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
