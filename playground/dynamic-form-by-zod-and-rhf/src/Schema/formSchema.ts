import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { fieldsetSchema } from "./fieldsetSchema";

const formSchema = z.record(fieldsetSchema).transform((value) =>
  Object.entries(value).map(([key, value]) => {
    console.log("transform", key, value);
    // 以下でsubmitしたい値に変換する
    switch (value.type) {
      case "TEXT":
        return value;
      case "TEXTAREA":
        return value;
      case "NUMBER":
        return value;
      case "SELECT":
        return value;
      case "SINGLE_CHECKBOX":
        return value;
    }
  })
);

type InputSchema = z.input<typeof formSchema>;
export type OutputSchema = z.output<typeof formSchema>;

export type FormSchema<
  T extends InputSchema[string]["type"] = InputSchema[string]["type"],
  U extends InputSchema[string] = InputSchema[string]
> = Record<string, Extract<U, { type: T }>>;

export const resolver = zodResolver(formSchema);
