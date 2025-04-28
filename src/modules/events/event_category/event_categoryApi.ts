import { eventApiPaths } from '@/core/api/apiConstants';
import { eventApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import {
  EventCategorySchemaType,
  EventCategoryType,
} from './event_categoryType';

const eventCategoryApi = eventApi.injectEndpoints({
  endpoints: (builder) => ({
    // ADD
    addEventCategory: builder.mutation<any, EventCategoryType>({
      query: (payload) => {
        const formData = new FormData();
        formData.append('id', String(payload.id));
        formData.append('name', String(payload.title));
        return {
          url: `${eventApiPaths.eventCategoryUrl}`,
          method: 'POST',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Event Category Type added.');
        } catch (err) {
          console.log(err);
          toast.error('Event Category Type adding Failed.');
        }
      },
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: [{ type: 'Event_Category', id: 'LIST' }],
    }),

    // Get All
    getAllEventCategory: builder.query<
      PaginatedResponseType<EventCategoryType>,
      { pageNumber: string; searchString?: string }
    >({
      query: ({ pageNumber, searchString }) =>
        `${eventApiPaths.eventCategoryUrl}?page=${pageNumber}${searchString ? `&search=${searchString}` : ''}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ id }) => ({ type: 'Event_Category', id }) as const
              ),
              { type: 'Event_Category', id: 'LIST' },
            ]
          : [{ type: 'Event_Category', id: 'LIST' }],
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

    getEachEventCategory: builder.query<EventCategoryType, string>({
      query: (eventId) => `${eventApiPaths.eventCategoryUrl}${eventId}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'Event_Category', id }];
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
      // transformResponse: (response: any) => {
      //   return response;
      // },
    }),

    // delete

    deleteEventCategory: builder.mutation<any, string>({
      query(id) {
        return {
          url: `${eventApiPaths.eventCategoryUrl}${id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Event Category Type has been deleted.');
        } catch (err) {
          console.error('Delete Event Category Type Error:', err);
          toast.error(
            'Failed to delete the Event Category Type. Please check if the ID is correct.'
          );
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Event_Category', id }],
    }),

    // Update
    updateEventCategory: builder.mutation<
      EventCategoryType,
      EventCategorySchemaType
    >({
      query: ({ id, ...payload }) => {
        const formData = new FormData();
        formData.append('title', String(payload.title));
        return {
          url: `${eventApiPaths.eventCategoryUrl}${id}/`,
          method: 'PATCH',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Event Category Type  Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a Event Category Type.');
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Event_Category', id: id! },
      ],
    }),
  }),
  overrideExisting: true,
});
export default eventCategoryApi;
