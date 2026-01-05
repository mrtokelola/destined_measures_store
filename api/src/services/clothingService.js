export async function getClothingById(id, Clothing) {
  return Clothing.findById(id);
}

export async function listClothes( Clothing, { page = 1, limit = 6, sort }) {
  const skip = (page - 1) * limit;
  const categoryOrder = ["Hoodie", "Tee", "Shorts"];

  const [allItems, totalCount] = await Promise.all([
    Clothing.find(),
    Clothing.countDocuments(),
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
