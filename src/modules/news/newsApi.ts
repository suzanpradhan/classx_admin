import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { NewsSchemaType, NewsType } from './newsType';

const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // add
    addNews: builder.mutation<any, NewsSchemaType>({
      query: (payload) => {
        var formData = new FormData();
        if (payload.title) formData.append('title', payload.title);
        if (payload.content) formData.append('content', payload.content);
        if (payload.cover_image)
          formData.append('cover_image', payload.cover_image);
        if (payload.date && payload.time)
          formData.append(
            'date',
            `${payload.date.getFullYear()}-${payload.date.getMonth() + 1}-${payload.date.getDate()} ${payload.time}`
          );
        if (payload.description)
          formData.append('description', payload.description);
        return {
          url: `${apiPaths.newsUrl}`,
          method: 'POST',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('News Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a news.');
        }
      },
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: [{ type: 'News', id: 'LIST' }],
    }),

    // Get All
    getAllNews: builder.query<PaginatedResponseType<NewsType>, number>({
      query: (pageNumber) => `${apiPaths.newsUrl}?page=${pageNumber}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ id }) => ({ type: 'News', id }) as const
              ),
              { type: 'News', id: 'LIST' },
            ]
          : [{ type: 'News', id: 'LIST' }],
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

    getEachNews: builder.query<NewsType, string>({
      query: (newsId) => `${apiPaths.newsUrl}${newsId}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'News', id }];
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
        console.log('get each news response', response);
        return response;
      },
    }),
    // delete

    deleteNews: builder.mutation<any, string>({
      query(id) {
        return {
          url: `${apiPaths.newsUrl}${id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('News has been deleted.');
        } catch (err) {
          console.error('Delete News Error:', err);
          toast.error(
            'Failed to delete the News. Please check if the ID is correct.'
          );
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'News', id }],
    }),

    //  Update
    updateNews: builder.mutation<NewsType, NewsSchemaType>({
      query: ({ id, ...payload }) => {
        var formData = new FormData();
        if (payload.title) formData.append('title', payload.title);
        if (payload.content) formData.append('content', payload.content);
        if (payload.cover_image)
          formData.append('cover_image', payload.cover_image);
        if (payload.date && payload.time)
          formData.append(
            'date',
            `${payload.date.getFullYear()}-${payload.date.getMonth() + 1}-${payload.date.getDate()} ${payload.time}`
          );
        if (payload.description)
          formData.append('description', payload.description);

        return {
          url: `${apiPaths.newsUrl}${id}/`,
          method: 'PATCH',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('News  Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a News.');
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'News', id: id! }],
    }),
  }),
  overrideExisting: true,
});

export default newsApi;
