"use client";

import clsx from "clsx";
import Image from "next/image";
import { Heart } from "lucide-react";
import styles from "@/components/organisms/AppFooter/AppFooter.module.scss";

export default function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className={clsx(styles.container, styles.footerInner)}>
        <div className={styles.footerTop}>
          <div className={styles.footerMade}>
            <span>Made with</span>
            <Heart size={14} />
            <span>by</span>
            <Image src="/mt.svg" alt="MT logo" width={52} height={18} />
          </div>
          <div className={styles.footerLinks}>
            <a href="#">Github</a>
          </div>
        </div>
        <div className={styles.footerCopy}>
          © 2026 Delivery App. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
