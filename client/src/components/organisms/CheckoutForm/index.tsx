"use client";

import { useState } from "react";
import { z } from "zod";
import Field from "@/components/atoms/Field";
import Button from "@/components/atoms/Buttons";
import {
  formatAddressInput,
  formatEmailInput,
  formatPhoneInput,
} from "@/shared/utils/inputFormatters";
import styles from "@/components/organisms/CheckoutForm/CheckoutForm.module.scss";

const schema = z.object({
  email: z.string().email(),
  phone: z.string().min(8),
  address: z.string().min(5),
});

type FormValues = z.infer<typeof schema>;

type CheckoutFormProps = {
  loading: boolean;
  initialValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
};

export function CheckoutForm({
  loading,
  initialValues,
  onSubmit,
}: CheckoutFormProps) {
  const [values, setValues] = useState<FormValues>({
    email: formatEmailInput(initialValues?.email ?? ""),
    phone: formatPhoneInput(initialValues?.phone ?? ""),
    address: formatAddressInput(initialValues?.address ?? ""),
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const update = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        phone: fieldErrors.phone?.[0],
        address: fieldErrors.address?.[0],
      });
      return;
    }
    setErrors({});
    await onSubmit(parsed.data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.title}>Delivery Details</h3>
      <Field
        label="Email"
        placeholder="your@email.com"
        type="email"
        error={errors.email}
        value={values.email}
        onChange={(e) => update("email", formatEmailInput(e.target.value))}
      />
      <Field
        label="Phone"
        placeholder="+44 20 7946 0958"
        inputMode="tel"
        error={errors.phone}
        value={values.phone}
        onChange={(e) => update("phone", formatPhoneInput(e.target.value))}
      />
      <Field
        label="Delivery Address"
        placeholder="123 Main St, City, State, ZIP"
        error={errors.address}
        value={values.address}
        onChange={(e) => update("address", formatAddressInput(e.target.value))}
      />
      <Button className={styles.submitBtn} type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Place Order"}
      </Button>
    </form>
  );
}
