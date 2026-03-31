export type AppLinkProps = {
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  classNames?: Record<string, string>;
  children?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  style?: React.CSSProperties;
  active?: boolean;
};
