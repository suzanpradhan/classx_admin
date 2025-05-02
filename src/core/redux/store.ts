import { baseApi, eventApi } from '@/core/api/apiQuery';
import { configureStore } from '@reduxjs/toolkit';
import { rtkQueryErrorLogger } from '../api/apiMiddleware';

export const store = configureStore({
  reducer: {
    eventApi: eventApi.reducer,
    baseApi: baseApi.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware()
      .concat(eventApi.middleware)
      .concat(baseApi.middleware)
      .concat(rtkQueryErrorLogger);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
