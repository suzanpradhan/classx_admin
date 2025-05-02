import { eventApiPaths } from '@/core/api/apiConstants';
import { eventApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { CityType } from './venue/venueType';

const cityApi = eventApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All
    getAllCity: builder.query<
      PaginatedResponseType<CityType>,
      { pageNumber: string; searchString?: string }
    >({
      query: ({ pageNumber, searchString }) =>
        `${eventApiPaths.cityUrl}?page=${pageNumber}${searchString ? `&search=${searchString}` : ''}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ id }) => ({ type: 'City', id }) as const
              ),
              { type: 'City', id: 'LIST' },
            ]
          : [{ type: 'City', id: 'LIST' }],
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

    // Get Each

    getEachCity: builder.query<CityType, string>({
      query: (cityId) => `${eventApiPaths.cityUrl}${cityId}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'City', id }];
      },
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        return `${endpointName}("${queryArgs}")`;
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.log(err);
          toast.error(JSON.stringify(err));
        }
      },
      transformResponse: (response: any) => {
        console.log('get each city response', response);
        return response;
      },
    }),
  }),
  overrideExisting: true,
});

export default cityApi;
