import { eventApiPaths } from '@/core/api/apiConstants';
import { eventApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { TicketTypeDataType, TicketTypeSchemaType } from './ticket_typeType';

const ticketTypeAPi = eventApi.injectEndpoints({
  endpoints: (builder) => ({
    // add
    addTicketType: builder.mutation<any, TicketTypeSchemaType>({
      query: (payload) => {
        var formData = new FormData();
        formData.append('id', String(payload.id));
        if (payload.name) formData.append('name', payload.name);
        // if (payload.event) formData.append('performer', payload.event);

        return {
          url: `${eventApiPaths.ticketTypeUrl}`,
          method: 'POST',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Ticket Type Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a event ticket type.');
        }
      },
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),

    // Get All
    getAllTicketType: builder.query<
      PaginatedResponseType<TicketTypeDataType>,
      number
    >({
      query: (pageNumber) =>
        `${eventApiPaths.ticketTypeUrl}?page=${pageNumber}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ id }) => ({ type: 'Ticket', id }) as const
              ),
              { type: 'Ticket', id: 'LIST' },
            ]
          : [{ type: 'Ticket', id: 'LIST' }],
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

    getEachTicketType: builder.query<TicketTypeDataType, string>({
      query: (ticketId) => `${eventApiPaths.ticketTypeUrl}${ticketId}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'Ticket', id }];
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
        console.log('get each ticket response', response);
        return response;
      },
    }),

    // delete

    deleteTicketType: builder.mutation<any, string>({
      query(id) {
        return {
          url: `${eventApiPaths.ticketTypeUrl}${id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Ticket Type has been deleted.');
        } catch (err) {
          console.error('Delete Ticket Type Error:', err);
          toast.error(
            'Failed to delete the Event Performer. Please check if the ID is correct.'
          );
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Ticket', id }],
    }),

    //  Update
    updateTicketType: builder.mutation<
      TicketTypeDataType,
      TicketTypeSchemaType
    >({
      query: ({ id, ...payload }) => {
        var formData = new FormData();
        if (payload.name) formData.append('name', payload.name);

        return {
          url: `${eventApiPaths.ticketTypeUrl}${id}/`,
          method: 'PATCH',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Ticket Type Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a Ticket Type.');
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id: id! }],
    }),
  }),
  overrideExisting: true,
});

export default ticketTypeAPi;
