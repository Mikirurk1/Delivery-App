"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useQuery } from "@apollo/client/react";
import { FiltersPanel } from "@/components/organisms/FiltersPanel";
import ShopTemplate from "@/components/templates/ShopTemplate";
import ProductGrid from "@/components/organisms/ProductGrid";
import {
  CATEGORIES_QUERY,
  PRODUCTS_QUERY,
  SHOPS_QUERY,
} from "@/shared/graphql/documents";
import { COUPONS } from "@/shared/data/coupons";
import { getUiErrorMessage } from "@/shared/errors/uiError";
import { useScrollControl } from "@/shared/hooks/useScrollControl";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { addItem } from "@/features/cart/cart.slice";
import { pushToast } from "@/shared/store/slices/notificationsSlice";
import {
  setCategoryIds,
  setPage,
  setRatingRange,
  setSelectedShopId,
  setSortBy,
} from "@/features/filters/filters.slice";
import Button from "@/components/atoms/Buttons";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import styles from "@/app/shops/page.module.scss";

export default function ShopsPage() {
  const dispatch = useAppDispatch();
  const { replaceWithoutScroll, smoothScrollTop } = useScrollControl();
  const pathname = usePathname();
  const { selectedShopId, sortBy, categoryIds, ratingRange, page } =
    useAppSelector((state) => state.filters);
  const activeCouponId = useAppSelector((state) => state.coupon.activeCouponId);
  const urlHydratedRef = useRef(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { ratingMin, ratingMax } = useMemo(
    () => parseRange(ratingRange),
    [ratingRange],
  );
  const shopsResult = useQuery(SHOPS_QUERY, {
    variables: { ratingMin, ratingMax },
  });
  const categoriesResult = useQuery(CATEGORIES_QUERY);
  const productsResult = useQuery(PRODUCTS_QUERY, {
    variables: {
      filters: {
        shopId: selectedShopId || undefined,
        categoryIds,
        sortBy,
        page,
        pageSize: 9,
      },
    },
  });
  const shops =
    (
      shopsResult.data as
        | { shops?: { id: string; name: string; rating: number }[] }
        | undefined
    )?.shops ?? [];
  const categories =
    (
      categoriesResult.data as
        | { categories?: { id: string; name: string }[] }
        | undefined
    )?.categories ?? [];
  const pageData = (
    productsResult.data as
      | {
          products?: {
            items: {
              id: string;
              name: string;
              price: number;
              imageUrl?: string | null;
              category: { id: string; name: string };
            }[];
            total: number;
            pageSize: number;
          };
        }
      | undefined
  )?.products;
  const activeCoupon = useMemo(
    () => COUPONS.find((coupon) => coupon.id === activeCouponId) ?? null,
    [activeCouponId],
  );
  const totalPages = pageData
    ? Math.max(1, Math.ceil(pageData.total / pageData.pageSize))
    : 1;
  const isLoading =
    shopsResult.loading || categoriesResult.loading || productsResult.loading;
  const hasError =
    shopsResult.error || categoriesResult.error || productsResult.error;
  const shopsErrorMessage = getUiErrorMessage(
    shopsResult.error ?? categoriesResult.error ?? productsResult.error,
    "Unable to load products. Please refresh the page and try again.",
  );

  useEffect(() => {
    if (!hasError || !shopsErrorMessage) return;
    dispatch(
      pushToast({
        kind: "error",
        title: "Data Loading Error",
        description: shopsErrorMessage,
      }),
    );
  }, [dispatch, hasError, shopsErrorMessage]);

  useEffect(() => {
    if (urlHydratedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const nextShop = params.get("shop") ?? "";
    const nextSort = params.get("sort") ?? "NAME_ASC";
    const nextRating = params.get("rating") ?? "";
    const nextPage = Number(params.get("page") ?? "1");
    const nextCategories = (params.get("categories") ?? "")
      .split(",")
      .filter(Boolean);

    dispatch(setSelectedShopId(nextShop));
    dispatch(setSortBy(nextSort));
    dispatch(setRatingRange(nextRating));
    dispatch(setCategoryIds(nextCategories));
    dispatch(setPage(Number.isFinite(nextPage) && nextPage > 0 ? nextPage : 1));
    urlHydratedRef.current = true;
  }, [dispatch]);

  useEffect(() => {
    if (!urlHydratedRef.current) return;
    const params = new URLSearchParams();
    if (selectedShopId) params.set("shop", selectedShopId);
    if (sortBy) params.set("sort", sortBy);
    if (ratingRange) params.set("rating", ratingRange);
    if (categoryIds.length > 0) params.set("categories", categoryIds.join(","));
    params.set("page", String(page));
    const query = params.toString();
    replaceWithoutScroll(query ? `${pathname}?${query}` : pathname);
  }, [
    categoryIds,
    page,
    pathname,
    ratingRange,
    replaceWithoutScroll,
    selectedShopId,
    sortBy,
  ]);

  const handlePageChange = (nextPage: number) => {
    dispatch(setPage(nextPage));
    smoothScrollTop();
  };

  const handleFiltersChange = (next: {
    selectedShopId?: string;
    ratingRange?: string;
    sortBy?: string;
    categoryIds?: string[];
  }) => {
    if (next.selectedShopId !== undefined)
      dispatch(setSelectedShopId(next.selectedShopId));
    if (next.ratingRange !== undefined)
      dispatch(setRatingRange(next.ratingRange));
    if (next.sortBy !== undefined) dispatch(setSortBy(next.sortBy));
    if (next.categoryIds !== undefined)
      dispatch(setCategoryIds(next.categoryIds));
    dispatch(setPage(1));
  };

  const paginationPages = getPaginationPages(page, totalPages);

  return (
    <ShopTemplate
      header={
        <div className={styles.pageHead}>
          <h2 className={styles.title}>Browse Restaurants</h2>
          <p className={styles.subtitle}>Discover delicious food from our partner restaurants</p>
        </div>
      }
      filters={
        <div className={styles.desktopFilters}>
          <FiltersPanel
            selectedShopId={selectedShopId}
            shops={shops}
            ratingRange={ratingRange}
            sortBy={sortBy}
            categoryIds={categoryIds}
            categories={categories}
            onChange={handleFiltersChange}
          />
        </div>
      }
      content={
        <>
          <div className={styles.mobileFilterTrigger}>
            <Button
              className={styles.mobileFiltersBtn}
              onClick={() => setMobileFiltersOpen(true)}
            >
              <Filter size={16} /> Filters & Sort
            </Button>
          </div>

          {mobileFiltersOpen ? (
            <>
              <button
                type="button"
                className={styles.mobileFiltersOverlay}
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters drawer"
              />
              <aside className={styles.mobileFiltersDrawer}>
                <div className={styles.mobileFiltersHead}>
                  <strong>Filters</strong>
                  <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={() => setMobileFiltersOpen(false)}
                    aria-label="Close filters"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className={styles.grid}>
                  <FiltersPanel
                    selectedShopId={selectedShopId}
                    shops={shops}
                    ratingRange={ratingRange}
                    sortBy={sortBy}
                    categoryIds={categoryIds}
                    categories={categories}
                    onChange={handleFiltersChange}
                  />
                </div>
              </aside>
            </>
          ) : null}

          <div className={styles.muted}>
            Showing {pageData?.items?.length ?? 0} of {pageData?.total ?? 0}{" "}
            products
          </div>
          <ProductGrid
            items={pageData?.items ?? []}
            loading={isLoading}
            error={Boolean(hasError)}
            errorMessage={shopsErrorMessage}
            activeCoupon={activeCoupon}
            onAdd={(product) =>
              dispatch(
                addItem({
                  productId: product.id,
                  productName: product.name,
                  productPrice: product.price,
                  categoryId: product.category.id,
                  categoryName: product.category.name,
                }),
              )
            }
          />

          {totalPages > 1 ? (
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.paginationIcon}
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {paginationPages.map((token, idx) =>
                token === "..." ? (
                  <span key={`dots-${idx}`} className={styles.paginationDots}>
                    ...
                  </span>
                ) : (
                  <button
                    key={token}
                    type="button"
                    className={clsx(styles.paginationPage, {
                      [styles.paginationPageActive]: token === page,
                    })}
                    onClick={() => handlePageChange(token)}
                  >
                    {token}
                  </button>
                ),
              )}

              <button
                type="button"
                className={styles.paginationIcon}
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          ) : null}
        </>
      }
    />
  );
}

function parseRange(range: string): { ratingMin?: number; ratingMax?: number } {
  if (!range) return {};
  const [min, max] = range.split("-").map(Number);
  return { ratingMin: min, ratingMax: max };
}

function getPaginationPages(
  currentPage: number,
  totalPages: number,
): Array<number | "..."> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  }

  const pages: Array<number | "..."> = [];
  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, currentPage + 1);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }

  for (let p = start; p <= end; p += 1) pages.push(p);

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return pages;
}
