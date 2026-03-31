"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

export function useScrollControl() {
  const router = useRouter();

  const replaceWithoutScroll = useCallback(
    (href: string) => {
      router.replace(href, { scroll: false });
    },
    [router],
  );

  const smoothScrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return {
    replaceWithoutScroll,
    smoothScrollTop,
  };
}
