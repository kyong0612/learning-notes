import { useFormContext, useController } from "react-hook-form";
import type { FormSchema } from "../Schema/formSchema";
import { BaseFieldSet } from "./BaseFieldset";

export type SingleCheckboxFieldSetProps = BaseFieldSet;

export const SingleCheckboxFieldSet: React.FC<SingleCheckboxFieldSetProps> = ({
  label,
  name
}) => {
  const { control } = useFormContext<FormSchema<"SINGLE_CHECKBOX">>();
  const { field } = useController({
    control,
    name
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    field.onChange({
      type: "SINGLE_CHECKBOX",
      payload: e.target.checked
    });
  };

  return (
    <fieldset>
      <legend>{label}</legend>
      <label>
        <input
          type="checkbox"
          checked={field.value.payload}
          onChange={handleChange}
        />
        {label}
      </label>
    </fieldset>
  );
};
