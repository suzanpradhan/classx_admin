import { eventApiPaths } from '@/core/api/apiConstants';
import { eventApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { EventRequestType, EventTagsType, EventType } from './eventType';

const eventsApi = eventApi.injectEndpoints({
  endpoints: (builder) => ({
    // ADD
    addEvents: builder.mutation<any, EventRequestType>({
      query: (payload) => {
        const formData = new FormData();
        formData.append('id', String(payload.id));
        formData.append('name', String(payload.name));
        if (payload.endDate && payload.endTime) {
          const endDate = payload.endDate;
          const formattedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')} ${payload.endTime}`;
          formData.append('end_date', formattedEndDate);
        }
        if (payload.startDate && payload.startTime) {
          const startDate = payload.startDate;
          const formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')} ${payload.startTime}`;
          formData.append('start_date', formattedStartDate);
        }
        if (payload.image) formData.append('image', payload.image);
        if (payload.category) {
          formData.append('category', payload.category.value);
        }
        if (payload.organizer) {
          formData.append('organizer', payload.organizer.value);
        }
        if (payload.venue) {
          formData.append('venue', payload.venue.value);
        }
        if (payload.status) formData.append('status', payload.status);
        payload.tags?.forEach((item, index) => {
          formData.append(`tags[${index}]title`, item.title);
          if (item.id) formData.append(`tags[${index}]id`, item.id.toString());
        });
        if (payload.description)
          formData.append('description', payload.description);
        return {
          url: `${eventApiPaths.eventUrl}`,
          method: 'POST',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Event Added.');
        } catch (err) {
          console.log(err);
          toast.error('Event  adding Failed.');
        }
      },
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),

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

    // Event Tags
    getAllEventsTags: builder.query<
      PaginatedResponseType<EventTagsType>,
      { pageNumber: string; searchString?: string }
    >({
      query: ({ pageNumber, searchString }) =>
        `${eventApiPaths.event_tagsUrl}?page=${pageNumber}${searchString ? `&search=${searchString}` : ''}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ id }) => ({ type: 'Event_Tags', id }) as const
              ),
              { type: 'Event_Tags', id: 'LIST' },
            ]
          : [{ type: 'Event_Tags', id: 'LIST' }],
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
        console.log('get each event response', response);
        return response;
      },
    }),

    // delete

    deleteEvent: builder.mutation<any, string>({
      query(id) {
        return {
          url: `${eventApiPaths.eventUrl}${id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Event has been deleted.');
        } catch (err) {
          console.error('Delete Event Error:', err);
          toast.error(
            'Failed to delete the Event. Please check if the ID is correct.'
          );
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Event', id }],
    }),

    // Update
    updateEvents: builder.mutation<EventType, EventRequestType>({
      query: ({ id, ...payload }) => {
        const formData = new FormData();
        formData.append('name', String(payload.name));
        if (payload.endDate && payload.endTime) {
          const endDate = payload.endDate;
          const formattedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')} ${payload.endTime}`;
          formData.append('end_date', formattedEndDate);
        }
        if (payload.startDate && payload.startTime) {
          const startDate = payload.startDate;
          const formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')} ${payload.startTime}`;
          formData.append('start_date', formattedStartDate);
        }
        if (payload.image) formData.append('image', payload.image);
        if (payload.category) {
          formData.append('category', payload.category.value);
        }
        if (payload.organizer) {
          formData.append('organizer', payload.organizer.value);
        }
        if (payload.venue) {
          formData.append('venue', payload.venue.value);
        }
        if (payload.status) formData.append('status', payload.status);
        payload.tags?.forEach((item, index) => {
          formData.append(`tags[${index}]title`, item.title);
          if (item.id) formData.append(`tags[${index}]id`, item.id.toString());
        });
        if (payload.description)
          formData.append('description', payload.description);
        return {
          url: `${eventApiPaths.eventUrl}${id}/`,
          method: 'PATCH',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Event Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a Event.');
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Event', id: id! }],
    }),
  }),
  overrideExisting: true,
});

export default eventsApi;
