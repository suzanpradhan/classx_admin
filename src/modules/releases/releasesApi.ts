import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
// import { GenresSchemaType, GenresType } from './genresType';
import { ReleasesSchemaType, ReleasesType } from './releasesType';

const releaseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ADD
        // addReleases: builder.mutation<any, GenresSchemaType>({
        //     query: (payload) => {
        //         const formData = new FormData();
        //         formData.append('id', String(payload.id));
        //         formData.append('name', String(payload.name));
        //         return {
        //             url: `${apiPaths.genresUrl}`,
        //             method: 'POST',
        //             body: formData,
        //         };
        //     },
        //     async onQueryStarted(payload, { queryFulfilled }) {
        //         try {
        //             await queryFulfilled;
        //             toast.success('Genres Type added.');
        //         } catch (err) {
        //             console.log(err);
        //             toast.error('Genres Type adding Failed.');
        //         }
        //     },
        //     transformResponse: (response: any) => {
        //         return response;
        //     },
        //     invalidatesTags: [{ type: 'Genres', id: 'LIST' }],
        // }),

        // Get All
        getAllReleases: builder.query<PaginatedResponseType<ReleasesType>, string>({
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
                    toast.success('Releases Type has been deleted.');
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
        updateReleases: builder.mutation<ReleasesType, ReleasesSchemaType>({
            query: ({ id, ...payload }) => {
                const formData = new FormData();
                formData.append('name', String(payload.name));
                return {
                    url: `${apiPaths.releasesUrl}${id}/`,
                    method: 'PATCH',
                    body: formData,
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Releases Type  Updated.');
                } catch (err) {
                    console.log(err);
                    toast.error('Failed updating a Releases Type.');
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
