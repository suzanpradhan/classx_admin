import { eventApiPaths } from '@/core/api/apiConstants';
import { eventApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { EventType } from './eventType';

const eventsApi = eventApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All
    getAllEvents: builder.query<
      PaginatedResponseType<EventType>,
      { pageNumber: string; searchString?: string }
    >({
      query: ({ pageNumber, searchString }) =>
        `${eventApiPaths.eventUrl}?page=${pageNumber}${searchString ? `&search=${searchString}` : ''}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ id }) => ({ type: 'Event', id }) as const
              ),
              { type: 'Event', id: 'LIST' },
            ]
          : [{ type: 'Event', id: 'LIST' }],
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

    getEachEvent: builder.query<EventType, string>({
      query: (cityId) => `${eventApiPaths.eventUrl}${cityId}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'Event', id }];
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

export default eventsApi;
