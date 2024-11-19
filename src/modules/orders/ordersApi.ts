import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { OrdersType } from './ordersType';

const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // Get All
        getAllOrders: builder.query<
            PaginatedResponseType<OrdersType>,
            number
        >({
            query: (pageNumber) =>
                `${apiPaths.ordersUrl}?page=${pageNumber}`,
            providesTags: (response) =>
                response?.results
                    ? [
                        ...response.results.map(
                            ({ id }) => ({ type: 'Orders', id }) as const
                        ),
                        { type: 'Orders', id: 'LIST' },
                    ]
                    : [{ type: 'Orders', id: 'LIST' }],
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

        getEachOrders: builder.query<OrdersType, string>({
            query: (id) =>
                `${apiPaths.ordersUrl}${id}/`,
            providesTags: (result, error, id) => {
                return [{ type: 'Orders', id }];
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
                    url: `${apiPaths.ordersUrl}${id}/`,
                    method: 'DELETE',
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Orders has been deleted.');
                } catch (err) {
                    console.error('Delete Orders Error:', err);
                    toast.error(
                        'Failed to delete the Orders. Please check if the ID is correct.'
                    );
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Orders', id }],
        }),




    }),
    overrideExisting: true,
});

export default ordersApi;
