'use client';

import { Button, TextField } from '@/core/ui/zenbuddha/src';
import { useFormik } from 'formik';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { toFormikValidate } from 'zod-formik-adapter';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loginFormSchema = z.object({
    email: z.string(),
    password: z.string(),
  });

  type LoginRequestType = z.infer<typeof loginFormSchema>;

  const onSubmit = async (values: LoginRequestType) => {
    setIsLoading(true);
    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: '/admin/dashboard',
    })
      .then((response: any) => {
        if (response?.error) {
          toast.error('Login Failed! Please check your credentials.');
        } else {
          router.refresh();
          router.replace('/admin/dashboard');
          toast.success('Successfully logged in!');
        }
      })
      .catch((errorResponse) => {
        toast.error('Login Failed! Please check your credentials.');
      });
    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: toFormikValidate(loginFormSchema),
    onSubmit,
  });

  return (
    <form
      className="flex flex-col "
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit(e);
      }}
    >
      <div className="font-bold text-xl">Login to your account</div>
      <div className="text-sm mb-4">
        Sign in by entering the information below.
      </div>
      <TextField
        placeholder="Your email"
        id="email"
        type="email"
        label="Email"
        {...formik.getFieldProps('email')}
      />
      {!!formik.errors.email && (
        <div className="text-red-500">{formik.errors.email}</div>
      )}

      <TextField
        placeholder="•••••••••••"
        id="password"
        type="password"
        className="mt-2"
        label="Password"
        {...formik.getFieldProps('password')}
      />
      {!!formik.errors.password && (
        <div className="text-red-500">{formik.errors.password}</div>
      )}
      <Button
        text="Login"
        type="submit"
        kind="secondary"
        isLoading={isLoading}
        className="mt-4 font-bold"
      />
    </form>
  );
}
