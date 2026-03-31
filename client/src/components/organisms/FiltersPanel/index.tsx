"use client";

import { Filter } from "lucide-react";
import clsx from "clsx";
import Field from "@/components/atoms/Field";
import styles from "@/components/organisms/FiltersPanel/FiltersPanel.module.scss";

type FiltersPanelProps = {
  selectedShopId: string;
  shops: { id: string; name: string; rating: number }[];
  ratingRange: string;
  sortBy: string;
  categoryIds: string[];
  categories: { id: string; name: string }[];
  onChange: (next: {
    selectedShopId?: string;
    ratingRange?: string;
    sortBy?: string;
    categoryIds?: string[];
  }) => void;
};

export function FiltersPanel({
  selectedShopId,
  shops,
  ratingRange,
  sortBy,
  categoryIds,
  categories,
  onChange,
}: FiltersPanelProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.head}>
        <div className={styles.title}>
          <Filter size={18} />
          <strong>Filters</strong>
        </div>
        <button
          type="button"
          className={styles.chipBtn}
          onClick={() =>
            onChange({
              selectedShopId: "",
              ratingRange: "",
              sortBy: "NAME_ASC",
              categoryIds: [],
            })
          }
        >
          Reset
        </button>
      </div>
      <Field
        as="select"
        label="Shop"
        value={selectedShopId}
        onChange={(e) => onChange({ selectedShopId: e.target.value })}
        options={[
          { value: "", label: "All Shops" },
          ...shops.map((shop) => ({
            value: shop.id,
            label: `${shop.name} (${shop.rating.toFixed(1)})`,
          })),
        ]}
      />
      <Field
        as="select"
        label="Rating"
        value={ratingRange}
        onChange={(e) => onChange({ ratingRange: e.target.value })}
        options={[
          { value: "", label: "All Ratings" },
          { value: "4-5", label: "4.0 - 5.0 ⭐" },
          { value: "3-4", label: "3.0 - 4.0 ⭐" },
          { value: "2-3", label: "2.0 - 3.0 ⭐" },
        ]}
      />
      <Field
        as="select"
        label="Sort By"
        value={sortBy}
        onChange={(e) => onChange({ sortBy: e.target.value })}
        options={[
          { value: "NAME_ASC", label: "Name (A-Z)" },
          { value: "PRICE_ASC", label: "Price (Low to High)" },
          { value: "PRICE_DESC", label: "Price (High to Low)" },
        ]}
      />
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Categories</legend>
        <div className={styles.categories}>
          {categories.map((category) => (
            <label key={category.id} className={clsx(styles.checkbox)}>
              <Field
                type="checkbox"
                checked={categoryIds.includes(category.id)}
                onChange={(e) =>
                  onChange({
                    categoryIds: e.target.checked
                      ? [...categoryIds, category.id]
                      : categoryIds.filter((id) => id !== category.id),
                  })
                }
              />
              {category.name}
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
