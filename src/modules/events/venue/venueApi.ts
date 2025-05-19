import { eventApiPaths } from '@/core/api/apiConstants';
import { eventApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { VenueDataType, VenueSchemaType } from './venueType';

const venueApi = eventApi.injectEndpoints({
  endpoints: (builder) => ({
    // add
    addVenue: builder.mutation<any, VenueSchemaType>({
      query: (payload) => {
        let formData = new FormData();
        formData.append('id', String(payload.id));
        if (payload.name) formData.append('name', payload.name);
        if (payload.city) formData.append('city', payload.city.value);
        if (payload.image) formData.append('image', payload.image);
        if (payload.description)
          formData.append('description', payload.description);
        return {
          url: `${eventApiPaths.venueUrl}`,
          method: 'POST',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Venue Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a performer.');
        }
      },
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: [{ type: 'Venue', id: 'LIST' }],
    }),

    // Get All
    getAllVenue: builder.query<
      PaginatedResponseType<VenueDataType>,
      { pageNumber: string; searchString?: string }
    >({
      query: ({ pageNumber, searchString }) =>
        `${eventApiPaths.venueUrl}?page=${pageNumber}${searchString ? `&search=${searchString}` : ''}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ id }) => ({ type: 'Venue', id }) as const
              ),
              { type: 'Venue', id: 'LIST' },
            ]
          : [{ type: 'Venue', id: 'LIST' }],
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

    getEachVenue: builder.query<VenueDataType, string>({
      query: (venueId) => `${eventApiPaths.venueUrl}${venueId}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'Venue', id }];
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
        console.log('get each venue response', response);
        return response;
      },
    }),

    // delete

    deleteVenue: builder.mutation<any, string>({
      query(id) {
        return {
          url: `${eventApiPaths.venueUrl}${id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Venue has been deleted.');
        } catch (err) {
          console.error('Delete Venue Error:', err);
          toast.error(
            'Failed to delete the Venue. Please check if the ID is correct.'
          );
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Venue', id }],
    }),

    //  Update
    updateVenue: builder.mutation<VenueDataType, VenueSchemaType>({
      query: ({ id, ...payload }) => {
        let formData = new FormData();
        if (payload.name) formData.append('name', payload.name);
        if (payload.city) formData.append('city', payload.city.value);
        if (payload.image) formData.append('image', payload.image);

        if (payload.description)
          formData.append('description', payload.description);

        return {
          url: `${eventApiPaths.venueUrl}${id}/`,
          method: 'PATCH',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Venue  Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a Venue.');
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Venue', id: id! }],
    }),
  }),
  overrideExisting: true,
});

export default venueApi;
