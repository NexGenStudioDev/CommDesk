import React, { ReactNode, FormEvent } from "react";
import { ZodSchema, ZodError, ZodIssue } from "zod";

interface FormProps<T> {
  schema: ZodSchema<T>;
  initialValues: T;
  onSubmit: (values: T) => void;
  children: (
    values: T,
    handleChange: (name: keyof T, value: any) => void,
    errors: Partial<Record<keyof T, string>>,
  ) => ReactNode;
  submitButton?: ReactNode;
  className?: string;
}

export function Form<T>({
  schema,
  initialValues,
  onSubmit,
  children,
  submitButton,
  className,
}: FormProps<T>) {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const parsed = schema.parse(values);
      setErrors({});
      onSubmit(parsed);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof T, string>> = {};
        err.issues.forEach((error: ZodIssue) => {
          if (error.path.length > 0) {
            fieldErrors[error.path[0] as keyof T] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children(values, handleChange, errors)}
      {submitButton || <button type="submit">Submit</button>}
    </form>
  );
}
