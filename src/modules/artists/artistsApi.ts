import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import {
    ArtistsSchemaType,
    ArtistsType,
} from './artistsType';

const artistsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ADD
        addArtists: builder.mutation<any, ArtistsSchemaType>({
            query: (payload) => {
                const fromData = new FormData();
                fromData.append('id', String(payload.id));
                fromData.append('name', String(payload.name));
                if (payload.profile_picture) fromData.append('profile_picture', payload.profile_picture);
                return {
                    url: `${apiPaths.artistsUrl}`,
                    method: 'POST',
                    body: fromData,
                };
            },
            async onQueryStarted(payload, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success('Artists added');
                } catch (err) {
                    console.log(err);
                    toast.error('Artists adding failed');
                }
            },
            transformResponse: (response: any) => {
                return response;
            },
        }),

        // Get All
        getAllArtists: builder.query<
            PaginatedResponseType<ArtistsType>,
            number
        >({
            query: (pageNumber) =>
                `${apiPaths.artistsUrl}?page=${pageNumber}`,
            providesTags: (response) =>
                response?.results
                    ? [
                        ...response.results.map(
                            ({ id }) => ({ type: 'Artists', id }) as const
                        ),
                        { type: 'Artists', id: 'LIST' },
                    ]
                    : [{ type: 'Artists', id: 'LIST' }],
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

        getEachArtists: builder.query<ArtistsType, string>({
            query: (artistsId) =>
                `${apiPaths.artistsUrl}${artistsId}/`,
            providesTags: (result, error, id) => {
                return [{ type: 'Artists', id }];
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



    }),
    overrideExisting: true,
});

export default artistsApi;