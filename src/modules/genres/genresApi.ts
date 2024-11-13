import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { GenresSchemaType, GenresType } from './genresType';

const genresApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ADD
        addGenres: builder.mutation<any, GenresSchemaType>({
            query: (payload) => {
                const formData = new FormData();
                formData.append('id', String(payload.id));
                formData.append('name', String(payload.name));
                return {
                    url: `${apiPaths.genresUrl}`,
                    method: 'POST',
                    body: formData,
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Genres Type added.');
                } catch (err) {
                    console.log(err);
                    toast.error('Genres Type adding Failed.');
                }
            },
            transformResponse: (response: any) => {
                return response;
            },
            invalidatesTags: [{ type: 'Genres', id: 'LIST' }],
        }),

        // Get All
        getAllGenres: builder.query<PaginatedResponseType<GenresType>, string>({
            query: (pageNumber) => `${apiPaths.genresUrl}?page=${pageNumber}`,
            providesTags: (response) =>
                response?.results
                    ? [
                        ...response.results.map(
                            ({ id }) => ({ type: 'Genres', id }) as const
                        ),
                        { type: 'Genres', id: 'LIST' },
                    ]
                    : [{ type: 'Genres', id: 'LIST' }],
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

        getEachGenres: builder.query<GenresType, string>({
            query: (property_typeId) =>
                `${apiPaths.genresUrl}${property_typeId}/`,
            providesTags: (result, error, id) => {
                return [{ type: 'Genres', id }];
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

        deleteGenres: builder.mutation<any, string>({
            query(id) {
                return {
                    url: `${apiPaths.genresUrl}${id}/`,
                    method: 'DELETE',
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Genres Type has been deleted.');
                } catch (err) {
                    console.error('Delete Genres Type Error:', err);
                    toast.error(
                        'Failed to delete the Genres Type. Please check if the ID is correct.'
                    );
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Genres', id }],
        }),

        // Update
        updateGenres: builder.mutation<GenresType, GenresSchemaType>({
            query: ({ id, ...payload }) => {
                const formData = new FormData();
                formData.append('name', String(payload.name));
                return {
                    url: `${apiPaths.genresUrl}${id}/`,
                    method: 'PATCH',
                    body: formData,
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Genres Type  Updated.');
                } catch (err) {
                    console.log(err);
                    toast.error('Failed updating a Genres Type.');
                }
            },
            invalidatesTags: (result, error, { id }) => [
                { type: 'Genres', id: id! },
            ],
        }),
    }),
    overrideExisting: true,
});
export default genresApi;
