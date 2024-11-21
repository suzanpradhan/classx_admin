import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
// import { GenresSchemaType, GenresType } from './genresType';
import { ReleasesRequestType, ReleasesType } from './releasesType';

const releaseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ADD
        addReleases: builder.mutation<any, ReleasesRequestType>({
            query: (payload) => {
                const formData = new FormData();
                formData.append('id', String(payload.id));
                formData.append('title', String(payload.title));
                if (payload.release_date)
                    formData.append(
                        'release_date',
                        `${payload.release_date.getFullYear()}-${payload.release_date.getMonth()}-${payload.release_date.getDate()}`
                    );
                if (payload.cover) formData.append('cover', payload.cover);
                if (payload.artist) formData.append('artist', payload.artist);
                if (payload.release_type)
                    formData.append('release_type', payload.release_type);
                payload.genres?.forEach((item, index) => {
                    formData.append(`genres[${index}]name`, item.name);
                    if (item.id)
                        formData.append(`genres[${index}]id`, item.id.toString());
                });
                if (payload.description)
                    formData.append('description', payload.description);
                return {
                    url: `${apiPaths.releasesUrl}`,
                    method: 'POST',
                    body: formData,
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Releases Added.');
                } catch (err) {
                    console.log(err);
                    toast.error('Releases  adding Failed.');
                }
            },
            transformResponse: (response: any) => {
                return response;
            },
        }),

        // Get All
        getAllReleases: builder.query<PaginatedResponseType<ReleasesType>, number>({
            query: (pageNumber) => `${apiPaths.releasesUrl}?page=${pageNumber}`,
            providesTags: (response) =>
                response?.results
                    ? [
                        ...response.results.map(
                            ({ id }) => ({ type: 'Releases', id }) as const
                        ),
                        { type: 'Releases', id: 'LIST' },
                    ]
                    : [{ type: 'Releases', id: 'LIST' }],
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

        getEachReleases: builder.query<ReleasesType, string>({
            query: (releasesId) =>
                `${apiPaths.releasesUrl}${releasesId}/`,
            providesTags: (result, error, id) => {
                return [{ type: 'Releases', id }];
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

        deleteReleases: builder.mutation<any, string>({
            query(id) {
                return {
                    url: `${apiPaths.releasesUrl}${id}/`,
                    method: 'DELETE',
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Releases has been deleted.');
                } catch (err) {
                    console.error('Delete Releases Type Error:', err);
                    toast.error(
                        'Failed to delete the Releases Type. Please check if the ID is correct.'
                    );
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Releases', id }],
        }),

        // Update
        updateReleases: builder.mutation<ReleasesType, ReleasesRequestType>({
            query: ({ id, ...payload }) => {
                const formData = new FormData();
                formData.append('title', String(payload.title));
                if (payload.release_date)
                    formData.append(
                        'release_date',
                        `${payload.release_date.getFullYear()}-${payload.release_date.getMonth()}-${payload.release_date.getDate()}`
                    );
                if (payload.cover) formData.append('cover', payload.cover);
                if (payload.artist) formData.append('artist', payload.artist);
                if (payload.release_type)
                    formData.append('release_type', payload.release_type);
                payload.genres?.forEach((item, index) => {
                    formData.append(`genres[${index}]name`, item.name);
                    if (item.id)
                        formData.append(`genres[${index}]id`, item.id.toString());
                });
                if (payload.description)
                    formData.append('description', payload.description);
                return {
                    url: `${apiPaths.releasesUrl}${id}/`,
                    method: 'PATCH',
                    body: formData,
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Releases Updated.');
                } catch (err) {
                    console.log(err);
                    toast.error('Failed updating a Releases.');
                }
            },
            invalidatesTags: (result, error, { id }) => [
                { type: 'Releases', id: id! },
            ],
        }),
    }),
    overrideExisting: true,
});
export default releaseApi;
