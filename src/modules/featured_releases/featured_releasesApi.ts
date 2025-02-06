import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';

import {
  FeaturedReleasesSchemaType,
  FeaturedReleasesType,
} from './featured_releasesType';

const featuredReleaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // add
    addFeaturedRelease: builder.mutation<any, FeaturedReleasesSchemaType>({
      query: (payload) => {
        var formData = new FormData();
        formData.append('id', String(payload.id));
        if (payload.video) formData.append('video', payload.video);
        if (payload.title) formData.append('title', payload.title);
        if (payload.link) formData.append('link', payload.link);
        if (payload.subtitle) formData.append('subtitle', payload.subtitle);
        if (payload.release) formData.append('release', payload.release.value);

        return {
          url: `${apiPaths.featuredreleasesUrl}`,
          method: 'POST',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Featured Release Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a Featured Release.');
        }
      },
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: [{ type: 'FeaturedRelease', id: 'LIST' }],
    }),

    // Get All
    getAllFeaturedRelease: builder.query<
      PaginatedResponseType<FeaturedReleasesType>,
      number
    >({
      query: (pageNumber) =>
        `${apiPaths.featuredreleasesUrl}?page=${pageNumber}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ id }) => ({ type: 'FeaturedRelease', id }) as const
              ),
              { type: 'FeaturedRelease', id: 'LIST' },
            ]
          : [{ type: 'FeaturedRelease', id: 'LIST' }],
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

    getEachFeaturedRelease: builder.query<FeaturedReleasesType, string>({
      query: (tracksId) => `${apiPaths.featuredreleasesUrl}${tracksId}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'FeaturedRelease', id }];
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

    deleteFeaturedRelease: builder.mutation<any, string>({
      query(id) {
        return {
          url: `${apiPaths.featuredreleasesUrl}${id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('FeaturedRelease has been deleted.');
        } catch (err) {
          console.error('Delete FeaturedRelease Error:', err);
          toast.error(
            'Failed to delete the FeaturedRelease. Please check if the ID is correct.'
          );
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'FeaturedRelease', id }],
    }),

    //  Update
    updateFeaturedRelease: builder.mutation<
      FeaturedReleasesType,
      FeaturedReleasesSchemaType
    >({
      query: ({ id, ...payload }) => {
        var formData = new FormData();
        if (payload.video) formData.append('video', payload.video);
        if (payload.title) formData.append('title', payload.title);
        if (payload.link) formData.append('link', payload.link);
        if (payload.subtitle) formData.append('subtitle', payload.subtitle);
        if (payload.release) formData.append('release', payload.release.value);
        return {
          url: `${apiPaths.featuredreleasesUrl}${id}/`,
          method: 'PATCH',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('FeaturedRelease  Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a FeaturedRelease.');
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'FeaturedRelease', id: id! },
      ],
    }),
  }),
  overrideExisting: true,
});

export default featuredReleaseApi;
