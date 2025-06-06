import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { ArtistsSchemaType, ArtistsType } from './artistsType';

const artistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ADD
    addArtists: builder.mutation<any, ArtistsSchemaType>({
      query: (payload) => {
        const formData = new FormData();
        formData.append('id', String(payload.id));
        formData.append('slug', String(payload.slug));
        formData.append('name', String(payload.name));
        formData.append('bio', String(payload.bio));
        formData.append('artist_ref', String(payload.artist_ref));

        if (payload.profile_picture)
          formData.append('profile_picture', payload.profile_picture);
        return {
          url: `${apiPaths.artistsUrl}`,
          method: 'POST',
          body: formData,
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
      invalidatesTags: [{ type: 'Artists', id: 'LIST' }],
    }),

    // Get All
    getAllArtists: builder.query<
      PaginatedResponseType<ArtistsType>,
      { pageNumber: string; searchString?: string }
    >({
      query: ({ pageNumber, searchString }) =>
        `${apiPaths.artistsUrl}?page=${pageNumber}${searchString ? `&search=${searchString}` : ''}`,
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
      query: (artistsSlug) => `${apiPaths.artistsUrl}${artistsSlug}/`,
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
      transformResponse: (response: any) => {
        // console.log('get each artist response', response);
        return response;
      },
    }),
    // delete

    deleteArtists: builder.mutation<any, string>({
      query(slug) {
        return {
          url: `${apiPaths.artistsUrl}${slug}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Artists has been deleted.');
        } catch (err) {
          console.error('Delete Artists Error:', err);
          toast.error(
            'Failed to delete the Artists. Please check if the ID is correct.'
          );
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Artists', id }],
    }),

    // Update
    updateArtists: builder.mutation<ArtistsType, ArtistsSchemaType>({
      query: ({ slug, ...payload }) => {
        const formData = new FormData();

        formData.append('name', String(payload.name));
        formData.append('bio', String(payload.bio));
        formData.append('artist_ref', String(payload.artist_ref));
        if (payload.profile_picture)
          formData.append('profile_picture', payload.profile_picture);

        return {
          url: `${apiPaths.artistsUrl}${slug}/`,
          method: 'PATCH',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Artists  Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a Artists.');
        }
      },
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Artists', id: result?.id ?? 0 },
      ],
    }),
  }),
  overrideExisting: true,
});

export default artistsApi;
