import type { ProductSortOption } from "@/types/products.types";

interface ProductQueryInput {
  search?: string;
  category?: string;
  sort?: string;
  page?: string;
}

const PRODUCTS_PER_PAGE = 8;

const allowedSortValues: ProductSortOption[] = [
  "newest",
  "price-low-to-high",
  "price-high-to-low",
  "name-a-to-z",
];

export function buildProductQuery({
  search,
  category,
  sort,
  page,
}: ProductQueryInput) {
  const query = new URLSearchParams();

  const normalizedSearch = search?.trim();

  if (normalizedSearch) {
    query.set("search", normalizedSearch);
  }

  if (
    category &&
    isValidObjectId(category)
  ) {
    query.set("categoryId", category);
  }

  query.set(
    "sort",
    normalizeProductSort(sort)
  );

  query.set(
    "page",
    normalizeProductPage(page)
  );

  query.set(
    "limit",
    String(PRODUCTS_PER_PAGE)
  );

  return query;
}

export function normalizeProductSort(
  sort?: string
): ProductSortOption {
  if (
    sort &&
    allowedSortValues.includes(
      sort as ProductSortOption
    )
  ) {
    return sort as ProductSortOption;
  }

  return "newest";
}

function normalizeProductPage(
  page?: string
) {
  const pageNumber = Number(page);

  if (
    Number.isInteger(pageNumber) &&
    pageNumber > 0
  ) {
    return String(pageNumber);
  }

  return "1";
}

function isValidObjectId(
  value: string
) {
  return /^[0-9a-fA-F]{24}$/.test(
    value
  );
}
