import type { FormSchema, OutputSchema } from "./Schema/formSchema";
import { FieldsetFactory } from "./Fieldset/FieldsetFactory";
import type { FieldsetFactoryProps } from "./Fieldset/FieldsetFactory";
import { FormProvider, useForm } from "react-hook-form";
import { resolver } from "./Schema/formSchema";

const API_MOCKDATA: Array<FieldsetFactoryProps & { id: number }> = [
  {
    id: 1,
    type: "TEXT",
    payload: {
      name: "username",
      label: "ユーザー名"
    }
  },
  {
    id: 2,
    type: "TEXTAREA",
    payload: {
      name: "memo",
      label: "備考"
    }
  },
  {
    id: 3,
    type: "NUMBER",
    payload: {
      name: "age",
      label: "年齢"
    }
  },
  {
    id: 4,
    type: "SELECTBOX",
    payload: {
      name: "country",
      label: "国籍",
      options: [
        {
          value: "japan",
          label: "日本"
        },
        {
          value: "usa",
          label: "アメリカ"
        },
        {
          value: "uk",
          label: "イギリス"
        }
      ]
    }
  },
  {
    id: 5,
    type: "SINGLE_CHECKBOX",
    payload: {
      name: "firstvisit",
      label: "初来訪"
    }
  }
];

const getInitialValue = (
  type: FieldsetFactoryProps["type"]
): FormSchema[string] => {
  switch (type) {
    case "TEXT":
      return {
        type,
        payload: ""
      };
    case "TEXTAREA":
      return {
        type,
        payload: ""
      };
    case "NUMBER":
      return {
        type,
        payload: null
      };
    case "SELECTBOX":
      return {
        type: "SELECT",
        payload: ""
      };
    case "SINGLE_CHECKBOX":
      return {
        type,
        payload: false
      };
  }
};

export const Form = () => {
  const initialValue = API_MOCKDATA.reduce<FormSchema>(
    (acc, cur) => ({
      ...acc,
      [cur.payload.name]: getInitialValue(cur.type)
    }),
    {}
  );
  const methods = useForm<FormSchema>({
    resolver,
    defaultValues: initialValue
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(
          (data) => console.log("success", data),
          (data) => {
            console.log("value", methods.getValues());
            console.log("error", data);
          }
        )}
      >
        {API_MOCKDATA.map((props) => (
          <FieldsetFactory key={props.id} {...props} />
        ))}
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  );
};
