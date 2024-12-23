import { useController, useFormContext } from "react-hook-form";
import type { FormSchema } from "../Schema/formSchema";
import { BaseFieldSet } from "./BaseFieldset";

export type TextareaFieldsetProps = BaseFieldSet;

export const TextareaFieldset: React.FC<TextareaFieldsetProps> = ({
  label,
  name
}) => {
  const { control } = useFormContext<FormSchema<"TEXTAREA">>();
  const { field } = useController({ control, name });

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    field.onChange({
      type: "TEXTAREA",
      payload: e.target.value
    });
  };

  return (
    <fieldset>
      <legend>{label}</legend>
      <textarea value={field.value.payload} onChange={handleChange} />
    </fieldset>
  );
};
