import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';
import { toast } from 'react-toastify';

export const rtkQueryErrorLogger: Middleware =
  // eslint-disable-next-line no-unused-vars
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      if ((action.payload as any)?.status == 401) {
        toast.error('Unauthorized');
        signOut({ callbackUrl: '/login', redirect: true });
      }
    }

    return next(action);
  };
