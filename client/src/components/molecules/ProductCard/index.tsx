"use client";

import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import Button from "@/components/atoms/Buttons";
import styles from "@/components/molecules/ProductCard/ProductCard.module.scss";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  imageUrl?: string | null;
  categoryName: string;
  onAdd: () => void;
  loading?: boolean;
};

export function ProductCard({
  name,
  price,
  originalPrice,
  discountPercent,
  imageUrl,
  categoryName,
  onAdd,
  loading = false,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  if (loading) {
    return (
      <article className={styles.card}>
        <div className={clsx(styles.skeleton, styles.skeletonImage)} />
        <div className={styles.skeletonContent}>
          <div className={clsx(styles.skeleton, styles.skeletonTextSm)} />
          <div className={clsx(styles.skeleton, styles.skeletonTextLg)} />
        </div>
        <div className={styles.skeletonFooter}>
          <div className={clsx(styles.skeleton, styles.skeletonPrice)} />
          <div className={clsx(styles.skeleton, styles.skeletonButton)} />
        </div>
      </article>
    );
  }

  const hasImage = Boolean(imageUrl) && !imageError;

  return (
    <article className={styles.card}>
      <div className={styles.image}>
        {hasImage ? (
          <Image
            src={imageUrl ?? ""}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.imagePlaceholder} aria-label="Product placeholder">
            <ImageIcon size={20} />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <p className={styles.category}>{categoryName}</p>
        <h3 className={styles.title}>{name}</h3>
        <div className={styles.footer}>
          <div className={styles.priceWrap}>
            {typeof originalPrice === "number" && originalPrice > price ? (
              <>
                <p className={styles.originalPrice}>${originalPrice.toFixed(2)}</p>
                <p className={styles.price}>${price.toFixed(2)}</p>
              </>
            ) : (
              <p className={styles.price}>${price.toFixed(2)}</p>
            )}
            {typeof discountPercent === "number" && discountPercent > 0 ? (
              <span className={styles.discountBadge}>-{discountPercent}%</span>
            ) : null}
          </div>
          <Button className={styles.addButton} onClick={onAdd}>
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}
