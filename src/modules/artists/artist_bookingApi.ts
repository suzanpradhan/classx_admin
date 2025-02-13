import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { ArtitstBookingSchemaType, ArtitstBookingType } from './artistsType';

const artistBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // add
    addArtistBooking: builder.mutation<any, ArtitstBookingSchemaType>({
      query: (payload) => {
        var formData = new FormData();
        if (payload.full_name) formData.append('full_name', payload.full_name);
        if (payload.phone) formData.append('phone', payload.phone);
        if (payload.event_type) {
          formData.append('event_type', payload.event_type);
        }
        if (payload.artist) {
          formData.append('artist', payload.artist.value);
        }
        if (payload.email) formData.append('email', payload.email);
        if (payload.info) formData.append('info', payload.info);
        if (payload.location) formData.append('location', payload.location);
        if (payload.document) formData.append('document', payload.document);
        if (payload.event_date && payload.event_time)
          formData.append(
            'event_date',
            `${payload.event_date.getFullYear()}-${payload.event_date.getMonth() + 1}-${payload.event_date.getDate()} ${payload.event_time}`
          );

        return {
          url: `${apiPaths.artistbookingUrl}`,
          method: 'POST',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('ArtistBooking Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a ArtistBooking.');
        }
      },
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: [{ type: 'ArtistBooking', id: 'LIST' }],
    }),

    // Get All
    getAllArtistBooking: builder.query<
      PaginatedResponseType<ArtitstBookingType>,
      number
    >({
      query: (pageNumber) => `${apiPaths.artistbookingUrl}?page=${pageNumber}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ id }) => ({ type: 'ArtistBooking', id }) as const
              ),
              { type: 'ArtistBooking', id: 'LIST' },
            ]
          : [{ type: 'ArtistBooking', id: 'LIST' }],
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

    getEachArtistBooking: builder.query<ArtitstBookingType, string>({
      query: (tracksId) => `${apiPaths.artistbookingUrl}${tracksId}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'ArtistBooking', id }];
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
      //   console.log('get hotek response', response);
      //   return response;
      // },
    }),
    // delete

    deleteArtistBooking: builder.mutation<any, string>({
      query(id) {
        return {
          url: `${apiPaths.artistbookingUrl}${id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('ArtistBooking has been deleted.');
        } catch (err) {
          console.error('Delete ArtistBooking Error:', err);
          toast.error(
            'Failed to delete the ArtistBooking. Please check if the ID is correct.'
          );
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'ArtistBooking', id }],
    }),

    //  Update
    updateArtistBooking: builder.mutation<
      ArtitstBookingType,
      ArtitstBookingSchemaType
    >({
      query: ({ id, ...payload }) => {
        var formData = new FormData();
        if (payload.full_name) formData.append('full_name', payload.full_name);
        if (payload.phone) formData.append('phone', payload.phone);
        if (payload.event_type) {
          formData.append('event_type', payload.event_type);
        }
        if (payload.artist) {
          formData.append('artist', payload.artist.value);
        }
        if (payload.email) formData.append('email', payload.email);
        if (payload.info) formData.append('info', payload.info);
        if (payload.location) formData.append('location', payload.location);
        if (payload.document) formData.append('document', payload.document);
        if (payload.event_date && payload.event_time)
          formData.append(
            'event_date',
            `${payload.event_date.getFullYear()}-${payload.event_date.getMonth() + 1}-${payload.event_date.getDate()} ${payload.event_time}`
          );
        return {
          url: `${apiPaths.artistbookingUrl}${id}/`,
          method: 'PATCH',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('ArtistBooking  Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a ArtistBooking.');
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'ArtistBooking', id: id! },
      ],
    }),
  }),
  overrideExisting: true,
});

export default artistBookingApi;
