import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { toast } from 'react-toastify';
import { AppointmentsType } from './appointmentsType';

const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All
    getAllAppointments: builder.query<
      PaginatedResponseType<AppointmentsType>,
      number
    >({
      query: (pageNumber) => `${apiPaths.appointmentsUrl}?page=${pageNumber}`,
      providesTags: (response) =>
        response?.results
          ? [
              ...response.results.map(
                ({ id }) => ({ type: 'Appointments', id }) as const
              ),
              { type: 'Appointments', id: 'LIST' },
            ]
          : [{ type: 'Appointments', id: 'LIST' }],
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

    getEachAppointments: builder.query<AppointmentsType, string>({
      query: (appointmentsId) =>
        `${apiPaths.appointmentsUrl}${appointmentsId}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'Appointments', id }];
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

    deleteAppointments: builder.mutation<any, string>({
      query(id) {
        return {
          url: `${apiPaths.appointmentsUrl}${id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Appointment has been deleted.');
        } catch (err) {
          console.error('Delete Appointment Error:', err);
          toast.error(
            'Failed to delete the Appointment. Please check if the ID is correct.'
          );
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Appointments', id }],
    }),
  }),
  overrideExisting: true,
});

export default appointmentsApi;
