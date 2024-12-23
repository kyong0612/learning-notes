import { useFormContext, useController } from "react-hook-form";
import type { FormSchema } from "../Schema/formSchema";
import type { BaseFieldSet } from "./BaseFieldset";

export type NumberFieldsetProps = BaseFieldSet;

export const NumberFieldset: React.FC<NumberFieldsetProps> = ({
  name,
  label
}) => {
  const { control } = useFormContext<FormSchema<"NUMBER">>();
  const { field } = useController({ control, name });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = parseInt(e.target.value, 10);
    field.onChange({
      type: "NUMBER",
      payload: Number.isNaN(value) ? null : value
    });
  };

  return (
    <fieldset>
      <legend>{label}</legend>
      <input
        type="number"
        value={field.value?.payload ?? ""}
        onChange={handleChange}
      />
    </fieldset>
  );
};
