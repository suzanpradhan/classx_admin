import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { ProductsSchemaType, ProductsType } from './productType';

const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addProducts: builder.mutation<any, ProductsSchemaType>({
            query: (payload) => {
                const formData = new FormData();
                formData.append('id', String(payload.id));
                formData.append('title', String(payload.title));
                formData.append('slug', String(payload.slug));
                if (payload.thumbnail) formData.append('thumbnail', payload.thumbnail);
                if (payload.price) formData.append('price', payload.price);
                if (payload.stock) formData.append('stock', payload.stock.toString());
                if (payload.artist) formData.append('artist', payload.artist);
                if (payload.release) formData.append('release', payload.release.toString());
                if (payload.product_type)
                    formData.append('product_type', payload.product_type);
                if (payload.description)
                    formData.append('description', payload.description);
                return {
                    url: `${apiPaths.productsUrl}`,
                    method: 'POST',
                    body: formData,
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Products  added.');
                } catch (err) {
                    console.log(err);
                    toast.error('Products  adding Failed.');
                }
            },
            transformResponse: (response: any) => {
                return response;
            },
        }),

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
            query: (productsSlug) => `${apiPaths.productsUrl}${productsSlug}/`,
            providesTags: (result, error, productsSlug) => {
                return [{ type: 'Products', productsSlug }];
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

        deleteProducts: builder.mutation<any, string>({
            query(slug) {
                return {
                    url: `${apiPaths.productsUrl}${slug}/`,
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
            invalidatesTags: (result, error, slug) => [{ type: 'Products', slug }],
        }),


        // Update
        updateProducts: builder.mutation<ProductsType, ProductsSchemaType>({
            query: ({ slug, ...payload }) => {
                const formData = new FormData();
                formData.append('title', String(payload.title));
                // formData.append('slug', String(payload.slug));
                if (payload.thumbnail) formData.append('thumbnail', payload.thumbnail);
                if (payload.price) formData.append('price', payload.price);
                if (payload.stock) formData.append('stock', payload.stock.toString());
                if (payload.artist) formData.append('artist', payload.artist);
                if (payload.release) formData.append('release', payload.release.toString());
                if (payload.product_type)
                    formData.append('product_type', payload.product_type);
                if (payload.description)
                    formData.append('description', payload.description);
                return {
                    url: `${apiPaths.productsUrl}${slug}/`,
                    method: 'PATCH',
                    body: formData,
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Products Updated.');
                } catch (err) {
                    console.log(err);
                    toast.error('Failed updating a Products.');
                }
            },
            invalidatesTags: (result, error, { slug }) => [
                { type: 'Products', id: slug! },
            ],
        }),

    }),
    overrideExisting: true,
});

export default productsApi;
