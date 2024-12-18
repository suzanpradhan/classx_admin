import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { Digital_DownloadSchemaType, Digital_DownloadType } from './digital_downloadType';

const digital_downloadApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ADD
        addigital: builder.mutation<any, Digital_DownloadSchemaType>({
            query: (payload) => {
                const formData = new FormData();
                formData.append('id', String(payload.id));
                if (payload.max_downloads) formData.append('max_downloads', payload.max_downloads.toString())
                if (payload.release) {
                    formData.append('release', payload.release.value);
                }
                if (payload.file)
                    if (payload.file) formData.append('file', payload.file);

                return {
                    url: `${apiPaths.digital_downloadUrl}`,
                    method: 'POST',
                    body: formData,
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Digital Download added.');
                } catch (err) {
                    console.log(err);
                    toast.error('Digital Download adding Failed.');
                }
            },
            transformResponse: (response: any) => {
                return response;
            },
            invalidatesTags: [{ type: 'Digital_Download', id: 'LIST' }],
        }),

        // Get All
        getAlldigital: builder.query<PaginatedResponseType<Digital_DownloadType>, string>({
            query: (pageNumber) => `${apiPaths.digital_downloadUrl}?page=${pageNumber}`,
            providesTags: (response) =>
                response?.results
                    ? [
                        ...response.results.map(
                            ({ id }) => ({ type: 'Digital_Download', id }) as const
                        ),
                        { type: 'Digital_Download', id: 'LIST' },
                    ]
                    : [{ type: 'Digital_Download', id: 'LIST' }],
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

        getEachDigital: builder.query<Digital_DownloadType, string>({
            query: (digital_downloadId) =>
                `${apiPaths.digital_downloadUrl}${digital_downloadId}/`,
            providesTags: (result, error, id) => {
                return [{ type: 'Digital_Download', id }];
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

        deleteDigital: builder.mutation<any, string>({
            query(id) {
                return {
                    url: `${apiPaths.digital_downloadUrl}${id}/`,
                    method: 'DELETE',
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Digital Download has been deleted.');
                } catch (err) {
                    console.log('Delete Digital Download Error:', err);
                    toast.error(
                        'Failed to delete the Digital Download Type. Please check if the ID is correct.'
                    );
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Digital_Download', id }],
        }),

        // Update
        updatedigital: builder.mutation<Digital_DownloadType, Digital_DownloadSchemaType>({
            query: ({ id, ...payload }) => {
                const formData = new FormData();
                if (payload.release)
                    if (payload.max_downloads) formData.append('max_downloads', payload.max_downloads.toString())
                if (payload.file) formData.append('file', payload.file);
                if (payload.release) {
                    formData.append('release', payload.release.value);
                }
                return {
                    url: `${apiPaths.digital_downloadUrl}${id}/`,
                    method: 'PATCH',
                    body: formData,
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Digital Download Type  Updated.');
                } catch (err) {
                    console.log(err);
                    toast.error('Failed updating a Digital Download Type.');
                }
            },
            invalidatesTags: (result, error, { id }) => [
                { type: 'Digital_Download', id: id! },
            ],
        }),
    }),
    overrideExisting: true,
});
export default digital_downloadApi;
