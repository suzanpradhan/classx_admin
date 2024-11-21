import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { TrackRequestType, Trackstype } from './trackType';

const tracksApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ADD
        addTracks: builder.mutation<any, TrackRequestType>({
            query: (payload) => {
                const formData = new FormData();
                formData.append('id', String(payload.id));
                formData.append('title', String(payload.title));
                formData.append('slug', String(payload.slug));
                if (payload.intro_track) formData.append('intro_track', payload.intro_track);
                if (payload.duration) formData.append('duration', payload.duration);
                if (payload.artist) formData.append('artist', payload.artist);
                if (payload.release)
                    formData.append('release', payload.release);
                payload.genres?.forEach((item, index) => {
                    formData.append(`genres[${index}]name`, item.name);
                    if (item.id)
                        formData.append(`genres[${index}]id`, item.id.toString());
                });
                return {
                    url: `${apiPaths.tracksUrl}`,
                    method: 'POST',
                    body: formData,
                    prepareHeaders: async (headers: Headers) => await setHeaders(headers),

                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Tracks added');
                } catch (err) {
                    console.log(err);
                    toast.error('Tracks adding failed');
                }
            },
            transformResponse: (response: any) => {
                return response;
            },

        }),

        // Get All
        getAllTracks: builder.query<
            PaginatedResponseType<Trackstype>,
            number
        >({
            query: (pageNumber) =>
                `${apiPaths.tracksUrl}?page=${pageNumber}`,
            providesTags: (response) =>
                response?.results
                    ? [
                        ...response.results.map(
                            ({ id }) => ({ type: 'Tracks', id }) as const
                        ),
                        { type: 'Tracks', id: 'LIST' },
                    ]
                    : [{ type: 'Tracks', id: 'LIST' }],
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

        getEachTracks: builder.query<Trackstype, string>({
            query: (tracksId) =>
                `${apiPaths.tracksUrl}${tracksId}/`,
            providesTags: (result, error, id) => {
                return [{ type: 'Tracks', id }];
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

        deleteTracks: builder.mutation<any, string>({
            query(id) {
                return {
                    url: `${apiPaths.tracksUrl}${id}/`,
                    method: 'DELETE',
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Tracks has been deleted.');
                } catch (err) {
                    console.error('Delete Tracks Error:', err);
                    toast.error(
                        'Failed to delete the Tracks. Please check if the ID is correct.'
                    );
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Tracks', id }],
        }),

        // Update
        updateTracks: builder.mutation<
            Trackstype,
            TrackRequestType
        >({
            query: ({ id, ...payload }) => {
                const formData = new FormData();
                formData.append('title', String(payload.title));
                formData.append('slug', String(payload.slug));
                if (payload.intro_track) formData.append('intro_track', payload.intro_track);
                if (payload.artist) formData.append('artist', payload.artist);
                if (payload.release)
                    formData.append('release', payload.release);
                payload.genres?.forEach((item, index) => {
                    formData.append(`genres[${index}]name`, item.name);
                    if (item.id)
                        formData.append(`genres[${index}]id`, item.id.toString());
                });


                return {
                    url: `${apiPaths.tracksUrl}${id}/`,
                    method: 'PATCH',
                    body: formData,
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Tracks  Updated.');
                } catch (err) {
                    console.log(err);
                    toast.error('Failed updating a Tracks.');
                }
            },
            invalidatesTags: (result, error, { id }) => [
                { type: 'Tracks', id: id! },
            ],
        }),
    }),
    overrideExisting: true,
});

export default tracksApi;