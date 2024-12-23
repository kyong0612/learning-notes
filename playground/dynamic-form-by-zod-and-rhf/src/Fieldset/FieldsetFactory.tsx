import { NumberFieldset } from "./NumberFieldset";
import { SelectFieldSet } from "./SelectFieldset";
import { TextFieldSet } from "./TextFieldset";
import { TextareaFieldset } from "./TextareaFieldset";
import { SingleCheckboxFieldSet } from "./SingleCheckboxFieldset";
import type { NumberFieldsetProps } from "./NumberFieldset";
import type { SelectFieldSetProps } from "./SelectFieldset";
import type { TextFieldSetProps } from "./TextFieldset";
import type { TextareaFieldsetProps } from "./TextareaFieldset";
import type { SingleCheckboxFieldSetProps } from "./SingleCheckboxFieldset";

export type FieldsetFactoryProps =
  | {
      type: "TEXT";
      payload: TextFieldSetProps;
    }
  | {
      type: "TEXTAREA";
      payload: TextareaFieldsetProps;
    }
  | {
      type: "NUMBER";
      payload: NumberFieldsetProps;
    }
  | {
      type: "SELECTBOX";
      payload: SelectFieldSetProps;
    }
  | {
      type: "SINGLE_CHECKBOX";
      payload: SingleCheckboxFieldSetProps;
    };

export const FieldsetFactory: React.FC<FieldsetFactoryProps> = (props) => {
  switch (props.type) {
    case "TEXT":
      return <TextFieldSet {...props.payload} />;
    case "TEXTAREA":
      return <TextareaFieldset {...props.payload} />;
    case "NUMBER":
      return <NumberFieldset {...props.payload} />;
    case "SELECTBOX":
      return <SelectFieldSet {...props.payload} />;
    case "SINGLE_CHECKBOX":
      return <SingleCheckboxFieldSet {...props.payload} />;
    default:
      return null;
  }
};
