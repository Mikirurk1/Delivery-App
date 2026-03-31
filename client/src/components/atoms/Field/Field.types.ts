type BaseFieldProps = {
  label?: string;
  error?: string;
  hint?: string;
  classNames?: {
    root?: string;
    label?: string;
    input?: string;
    error?: string;
    hint?: string;
    text?: string;
  };
  as?: "input" | "textarea" | "select";
};

type InputFieldProps = BaseFieldProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & {
    as?: "input";
    className?: string;
  };

type TextareaFieldProps = BaseFieldProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
    as: "textarea";
    className?: string;
  };

type SelectFieldProps = BaseFieldProps &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
    as: "select";
    className?: string;
  };

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type FieldProps = (InputFieldProps | TextareaFieldProps | SelectFieldProps) & {
  options?: SelectOption[];
};
