import {
  useForm,
  getFormProps,
  getInputProps,
  getTextareaProps,
} from '@conform-to/react';
import { parseWithZod, getZodConstraint } from '@conform-to/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, redirect, useActionData } from '@remix-run/react';
import { z } from 'zod';
import { sendMessage } from './handler';

const schema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Email is invalid'),
  message: z
    .string({ required_error: 'Message is required' })
    .min(10, 'Message is too short')
    .max(100, 'Message is too long'),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const message = await sendMessage(submission.value);

  if (!message.sent) {
    return submission.reply({
      formErrors: ['Failed to send the message. Please try again later.'],
    });
  }

  return redirect('/success');
}

export default function ContactUs() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <Form method="post" {...getFormProps(form)}>
      <div>
        <label htmlFor={fields.email.id}>Email</label>
        <input {...getInputProps(fields.email, { type: 'email' })} />
        <div id={fields.email.errorId}>{fields.email.errors}</div>
      </div>
      <div>
        <label htmlFor={fields.message.id}>Message</label>
        <textarea {...getTextareaProps(fields.message)} />
        <div id={fields.message.errorId}>{fields.message.errors}</div>
      </div>
      <button>Send</button>
    </Form>
  );
}
