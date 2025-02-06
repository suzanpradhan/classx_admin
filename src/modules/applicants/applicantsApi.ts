import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { ApplicantsSchemaType, ApplicantsType } from './applicantsType';

const applicantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // add
    addApplicants: builder.mutation<any, ApplicantsSchemaType>({
      query: (payload) => {
        var formData = new FormData();
        if (payload.full_name) formData.append('full_name', payload.full_name);
        if (payload.age) {
          formData.append('age', payload.age.toString());
        }
        if (payload.current_address) {
          formData.append('current_address', payload.current_address);
        }
        if (payload.perm_address) {
          formData.append('perm_address', payload.perm_address);
        }
        if (payload.applicant_type) {
          formData.append('applicant_type', payload.applicant_type);
        }
        if (payload.prev_work_link)
          formData.append('prev_work_link', payload.prev_work_link);
        if (payload.email) formData.append('email', payload.email);
        if (payload.document) formData.append('document', payload.document);
        if (payload.photo) formData.append('photo', payload.photo);
        if (payload.genre) formData.append('genre', payload.genre.value);
        if (payload.why_classx)
          formData.append('why_classx', payload.why_classx);
        if (payload.carrer_plan)
          formData.append('carrer_plan', payload.carrer_plan);
        return {
          url: `${apiPaths.applicantsUrl}`,
          method: 'POST',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Applicants Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a Applicants.');
        }
      },
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: [{ type: 'Applicants', id: 'LIST' }],
    }),

    // Get All
    getAllApplicants: builder.query<
      PaginatedResponseType<ApplicantsType>,
      number
    >({
      query: (pageNumber) => `${apiPaths.applicantsUrl}?page=${pageNumber}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ id }) => ({ type: 'Applicants', id }) as const
              ),
              { type: 'Applicants', id: 'LIST' },
            ]
          : [{ type: 'Applicants', id: 'LIST' }],
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

    getEachApplicants: builder.query<ApplicantsType, string>({
      query: (applicantsId) => `${apiPaths.applicantsUrl}${applicantsId}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'Applicants', id }];
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
        return response;
      },
    }),
    // delete

    deleteApplicants: builder.mutation<any, string>({
      query(id) {
        return {
          url: `${apiPaths.applicantsUrl}${id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Applicants has been deleted.');
        } catch (err) {
          console.error('Delete Applicants Error:', err);
          toast.error(
            'Failed to delete the Applicants. Please check if the ID is correct.'
          );
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Applicants', id }],
    }),

    //  Update
    updateApplicants: builder.mutation<ApplicantsType, ApplicantsSchemaType>({
      query: ({ id, ...payload }) => {
        var formData = new FormData();
        if (payload.full_name) formData.append('full_name', payload.full_name);
        if (payload.age)
          formData.append('max_downloads', payload.age.toString());

        if (payload.current_address)
          formData.append('current_address', payload.current_address);
        if (payload.perm_address)
          formData.append('perm_address', payload.perm_address);
        if (payload.applicant_type)
          formData.append('applicant_type', payload.applicant_type);
        if (payload.prev_work_link)
          formData.append('prev_work_link', payload.prev_work_link);
        if (payload.email) formData.append('email', payload.email);
        if (payload.document) formData.append('document', payload.document);
        if (payload.photo) formData.append('photo', payload.photo);
        if (payload.genre) formData.append('genre', payload.genre.value);
        if (payload.why_classx)
          formData.append('why_classx', payload.why_classx);
        if (payload.carrer_plan)
          formData.append('carrer_plan', payload.carrer_plan);
        return {
          url: `${apiPaths.applicantsUrl}${id}/`,
          method: 'PATCH',
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Applicants  Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a Applicants.');
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Applicants', id: id! },
      ],
    }),
  }),
  overrideExisting: true,
});

export default applicantsApi;
