import * as z from "zod";

export const TextFieldsetSchema = z.object({
  type: z.literal("TEXT"),
  payload: z.string()
});
export const TextAreaFieldsetSchema = z.object({
  type: z.literal("TEXTAREA"),
  payload: z.string()
});
export const NumberFieldsetSchema = z.object({
  type: z.literal("NUMBER"),
  payload: z.number().nullable()
});
export const SelectFieldsetSchema = z.object({
  type: z.literal("SELECT"),
  payload: z.string()
});
export const SignleCheckboxFieldsetSchema = z.object({
  type: z.literal("SINGLE_CHECKBOX"),
  payload: z.boolean()
});

export const fieldsetSchema = z.discriminatedUnion("type", [
  TextFieldsetSchema,
  TextAreaFieldsetSchema,
  NumberFieldsetSchema,
  SelectFieldsetSchema,
  SignleCheckboxFieldsetSchema
]);
