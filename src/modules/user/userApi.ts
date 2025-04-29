import { eventApiPaths } from '@/core/api/apiConstants';
import { eventApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { UserResponse } from './accountsType';

const userApi = eventApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All
    getUser: builder.query<
      PaginatedResponseType<UserResponse>,
      { pageNumber: number; searchText?: string }
    >({
      query: ({ pageNumber, searchText }) =>
        `${eventApiPaths.accountsUrl}?page=${pageNumber}${searchText ? `&search=${searchText}` : ''}`,
      providesTags: (response) =>
        response
          ? [
              ...response?.results?.map(
                ({ id }) => ({ type: 'User', id }) as const
              ),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.log(err);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
  overrideExisting: true,
});

export default userApi;
