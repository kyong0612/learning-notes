import { useFormContext, useController } from "react-hook-form";
import type { FormSchema } from "../Schema/formSchema";
import { BaseFieldSet } from "./BaseFieldset";

export type TextFieldSetProps = BaseFieldSet;

export const TextFieldSet: React.FC<TextFieldSetProps> = ({ label, name }) => {
  const { control } = useFormContext<FormSchema<"TEXT">>();
  const { field } = useController({
    control,
    name
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    field.onChange({
      type: "TEXT",
      payload: e.target.value
    });
  };

  return (
    <fieldset>
      <legend>{label}</legend>
      <input value={field.value.payload} onChange={handleChange} />
    </fieldset>
  );
};
