export type ButtonProps = {
  onClick?: (() => void) | Array<() => void>;
  classNames?: Record<string, string>;
  children?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  style?: React.CSSProperties;
  active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
