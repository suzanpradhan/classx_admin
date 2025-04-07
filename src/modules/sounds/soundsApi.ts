import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { SoundRequestType, SoundsType } from './soundsType';

const soundsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ADD
    addSounds: builder.mutation<any, SoundRequestType>({
      query: (payload) => {
        const formData = new FormData();
        formData.append('id', String(payload.id));
        formData.append('title', String(payload.title));
        if (payload.track) formData.append('track', payload.track);
        if (payload.duration)
          formData.append(
            'duration',
            `${payload.duration.hour?.toString().padStart(2, '0')}:${payload.duration.minutes?.toString().padStart(2, '0')}:${payload.duration.seconds?.toString().padStart(2, '0')}`
          );
        if (payload.wave_data_id) {
          formData.append('track_wave', payload.wave_data_id.toString());
        }
        if (payload.artist) {
          formData.append('artist', payload.artist.value);
        }
        payload.genres?.forEach((item, index) => {
          formData.append(`genres[${index}]name`, item.name);
          if (item.id)
            formData.append(`genres[${index}]id`, item.id.toString());
        });
        return {
          url: `${apiPaths.soundsUrl}`,
          method: 'POST',
          body: formData,
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Sounds added');
        } catch (err) {
          console.log(err);
          toast.error('Sounds adding failed');
        }
      },
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: [{ type: 'Sounds', id: 'LIST' }],
    }),
    // Get All
    getAllSounds: builder.query<PaginatedResponseType<SoundsType>, number>({
      query: (pageNumber) => `${apiPaths.soundsUrl}?page=${pageNumber}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ id }) => ({ type: 'Sounds', id }) as const
              ),
              { type: 'Sounds', id: 'LIST' },
            ]
          : [{ type: 'Sounds', id: 'LIST' }],
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

    getEachSounds: builder.query<SoundsType, string>({
      query: (soundsId) => `${apiPaths.soundsUrl}${soundsId}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'Sounds', id }];
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
    }),
    // delete

    deleteSounds: builder.mutation<any, string>({
      query(id) {
        return {
          url: `${apiPaths.soundsUrl}${id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Sounds has been deleted.');
        } catch (err) {
          console.error('Delete Sounds Error:', err);
          toast.error(
            'Failed to delete the Sounds. Please check if the ID is correct.'
          );
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Sounds', id }],
    }),

    // Update
    updateSounds: builder.mutation<SoundsType, SoundRequestType>({
      query: ({ id, ...payload }) => {
        const formData = new FormData();
        formData.append('title', String(payload.title));
        if (payload.track) formData.append('track', payload.track);
        if (payload.artist) {
          formData.append('artist', payload.artist.value);
        }
        if (payload.duration)
          formData.append(
            'duration',
            `${payload.duration.hour?.toString().padStart(2, '0')}:${payload.duration.minutes?.toString().padStart(2, '0')}:${payload.duration.seconds?.toString().padStart(2, '0')}`
          );
        payload.genres?.forEach((item, index) => {
          formData.append(`genres[${index}]name`, item.name);
          if (item.id)
            formData.append(`genres[${index}]id`, item.id.toString());
        });

        return {
          url: `${apiPaths.soundsUrl}${id}/`,
          method: 'PATCH',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Sounds  Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a Sounds.');
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Sounds', id: id! }],
    }),
  }),
  overrideExisting: true,
});

export default soundsApi;
