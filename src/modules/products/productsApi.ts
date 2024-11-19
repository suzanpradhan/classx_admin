import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { ProductsType } from './productType';

const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // Get All
        getAllProducts: builder.query<
            PaginatedResponseType<ProductsType>,
            number
        >({
            query: (pageNumber) =>
                `${apiPaths.productsUrl}?page=${pageNumber}`,
            providesTags: (response) =>
                response?.results
                    ? [
                        ...response.results.map(({ id }) => ({
                            type: 'Products',
                            id: id ?? undefined,
                        }) as const),
                        { type: 'Products', id: 'LIST' },
                    ]
                    : [{ type: 'Products', id: 'LIST' }],
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    console.error(err);
                }
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),


        // Get Each

        getEachProducts: builder.query<ProductsType, string>({
            query: (id) =>
                `${apiPaths.productsUrl}${id}/`,
            providesTags: (result, error, id) => {
                return [{ type: 'Products', id }];
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

        deleteOrders: builder.mutation<any, string>({
            query(id) {
                return {
                    url: `${apiPaths.productsUrl}${id}/`,
                    method: 'DELETE',
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Products has been deleted.');
                } catch (err) {
                    console.error('Delete Products Error:', err);
                    toast.error(
                        'Failed to delete the Products. Please check if the ID is correct.'
                    );
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Orders', id }],
        }),




    }),
    overrideExisting: true,
});

export default productsApi;
