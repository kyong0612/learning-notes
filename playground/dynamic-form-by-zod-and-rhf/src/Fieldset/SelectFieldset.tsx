import { useController, useFormContext } from "react-hook-form";
import type { FormSchema } from "../Schema/formSchema";
import { BaseFieldSet } from "./BaseFieldset";

export type Option = {
  value: string;
  label: string;
};

export type SelectFieldSetProps = BaseFieldSet & {
  options: Option[];
};

export const SelectFieldSet: React.FC<SelectFieldSetProps> = ({
  name,
  label,
  options
}) => {
  const { control } = useFormContext<FormSchema<"SELECT">>();
  const { field } = useController({ control, name });

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    field.onChange({
      type: "SELECT",
      payload: e.target.value
    });
  };

  return (
    <fieldset>
      <legend>{label}</legend>
      <select onChange={handleChange} value={field.value?.payload}>
        <option value="" />
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </fieldset>
  );
};
