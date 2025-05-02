import { eventApiPaths } from '@/core/api/apiConstants';
import { eventApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import {
  EventPerfomerDataTypes,
  EventPerformerSchemaType,
  PerfomerDataTypes,
} from './performerType';

const performerApi = eventApi.injectEndpoints({
  endpoints: (builder) => ({
    // add
    addVenue: builder.mutation<any, EventPerformerSchemaType>({
      query: (payload) => {
        var formData = new FormData();
        formData.append('id', String(payload.id));
        if (payload.event) formData.append('event', payload.event.value);
        if (payload.performer)
          formData.append('performer', payload.performer.value);

        return {
          url: `${eventApiPaths.eventPerformerUrl}`,
          method: 'POST',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Event Performer Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a event performer.');
        }
      },
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: [{ type: 'Event_Performer', id: 'LIST' }],
    }),

    // Get All
    getAllEventPerformer: builder.query<
      PaginatedResponseType<EventPerfomerDataTypes>,
      number
    >({
      query: (pageNumber) =>
        `${eventApiPaths.eventPerformerUrl}?page=${pageNumber}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ id }) => ({ type: 'Event_Performer', id }) as const
              ),
              { type: 'Event_Performer', id: 'LIST' },
            ]
          : [{ type: 'Event_Performer', id: 'LIST' }],
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

    // Get All
    getAllPerformer: builder.query<
      PaginatedResponseType<PerfomerDataTypes>,
      number
    >({
      query: (pageNumber) => `${eventApiPaths.performerUrl}?page=${pageNumber}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ uuid }) => ({ type: 'Performer', id: uuid }) as const
              ),
              { type: 'Performer', id: 'LIST' },
            ]
          : [{ type: 'Performer', id: 'LIST' }],
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

    getEachPerformer: builder.query<EventPerfomerDataTypes, string>({
      query: (performerId) =>
        `${eventApiPaths.eventPerformerUrl}${performerId}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'Event_Performer', id }];
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
        console.log('get each performer response', response);
        return response;
      },
    }),

    // delete

    deletePerformer: builder.mutation<any, string>({
      query(id) {
        return {
          url: `${eventApiPaths.eventPerformerUrl}${id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Event Performer has been deleted.');
        } catch (err) {
          console.error('Delete Performer Error:', err);
          toast.error(
            'Failed to delete the Event Performer. Please check if the ID is correct.'
          );
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Event_Performer', id }],
    }),

    //  Update
    updatePerformer: builder.mutation<
      EventPerfomerDataTypes,
      EventPerformerSchemaType
    >({
      query: ({ id, ...payload }) => {
        var formData = new FormData();
        if (payload.event) formData.append('event', payload.event.value);
        if (payload.performer)
          formData.append('performer', payload.performer.value);

        return {
          url: `${eventApiPaths.eventPerformerUrl}${id}/`,
          method: 'PATCH',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Event Performer Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a Event Performer.');
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Event_Performer', id: id! },
      ],
    }),
  }),
  overrideExisting: true,
});

export default performerApi;
