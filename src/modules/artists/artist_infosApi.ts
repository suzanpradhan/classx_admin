import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { ArtistInfosSchemaType, ArtistInfosType } from './artistsType';

const artistInfosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ADD
    addArtistInfos: builder.mutation<any, ArtistInfosSchemaType>({
      query: (payload) => {
        const formData = new FormData();
        formData.append('id', String(payload.id));
        formData.append('about', String(payload.about));
        if (payload.artist) {
          formData.append('artist', payload.artist.value);
        }
        formData.append('feat_text', String(payload.feat_text));
        formData.append('text_one', String(payload.text_one));
        formData.append('text_two', String(payload.text_two));
        formData.append('book_artist', String(payload.book_artist));

        return {
          url: `${apiPaths.artist_infosUrl}`,
          method: 'POST',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('ArtistInfos added');
        } catch (err) {
          console.log(err);
          toast.error('ArtistInfos adding failed');
        }
      },
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: [{ type: 'ArtistInfos', id: 'LIST' }],
    }),

    // Get All
    getAllArtistInfos: builder.query<
      PaginatedResponseType<ArtistInfosType>,
      number
    >({
      query: (pageNumber) => `${apiPaths.artist_infosUrl}?page=${pageNumber}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ id }) => ({ type: 'ArtistInfos', id }) as const
              ),
              { type: 'ArtistInfos', id: 'LIST' },
            ]
          : [{ type: 'ArtistInfos', id: 'LIST' }],
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

    getEachArtistInfos: builder.query<ArtistInfosType, string>({
      query: (artistsId) => `${apiPaths.artist_infosUrl}${artistsId}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'ArtistInfos', id }];
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
        console.log('get each artist response', response);
        return response;
      },
    }),
    // delete

    deleteArtistInfos: builder.mutation<any, string>({
      query(slug) {
        return {
          url: `${apiPaths.artist_infosUrl}${slug}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('ArtistInfos has been deleted.');
        } catch (err) {
          console.error('Delete ArtistInfos Error:', err);
          toast.error(
            'Failed to delete the ArtistInfos. Please check if the ID is correct.'
          );
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'ArtistInfos', id }],
    }),

    // Update
    updateArtistInfos: builder.mutation<ArtistInfosType, ArtistInfosSchemaType>(
      {
        query: ({ id, ...payload }) => {
          const formData = new FormData();

          formData.append('about', String(payload.about));
          if (payload.artist) {
            formData.append('artist', payload.artist.value);
          }
          formData.append('book_artist', String(payload.book_artist));
          formData.append('feat_text', String(payload.feat_text));
          formData.append('text_one', String(payload.text_one));
          formData.append('text_two', String(payload.text_two));

          return {
            url: `${apiPaths.artist_infosUrl}${id}/`,
            method: 'PATCH',
            body: formData,
          };
        },
        async onQueryStarted(payload, { queryFulfilled }) {
          try {
            await queryFulfilled;
            toast.success('ArtistInfos  Updated.');
          } catch (err) {
            console.log(err);
            toast.error('Failed updating a ArtistInfos.');
          }
        },
        invalidatesTags: (result, error, { id }) => [
          { type: 'ArtistInfos', id: result?.id ?? 0 },
        ],
      }
    ),
  }),
  overrideExisting: true,
});

export default artistInfosApi;
