import { baseApi } from '@/core/api/apiQuery';
import { configureStore } from '@reduxjs/toolkit';
import { rtkQueryErrorLogger } from '../api/apiMiddleware';

export const store = configureStore({
    reducer: {
        baseApi: baseApi.reducer,
    },
    middleware(getDefaultMiddleware) {
        return getDefaultMiddleware()
            .concat(baseApi.middleware)
            .concat(rtkQueryErrorLogger);
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
