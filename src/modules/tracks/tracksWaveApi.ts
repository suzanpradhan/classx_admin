import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { TrackWaveType } from './trackType';

const tracksWaveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ADD
    addTrackWave: builder.mutation<any, Array<Number>>({
      query: (payload) => {
        const data = {
          wave_data: payload.toString(),
        };
        return {
          url: `${apiPaths.trackwavesUrl}`,
          method: 'POST',
          body: data,
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        };
      },
      transformResponse: (response: any) => {
        return response;
      },
    }),

    getEachTrackWave: builder.query<TrackWaveType, string>({
      query: (waveId) => `${apiPaths.trackwavesUrl}${waveId}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'TrackWave', id }];
      },
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        return `${endpointName}-${queryArgs}`;
      },
    }),
    // delete

    deleteTrackWave: builder.mutation<any, string>({
      query(id) {
        return {
          url: `${apiPaths.trackwavesUrl}${id}/`,
          method: 'DELETE',
        };
      },
      invalidatesTags: (result, error, id) => [{ type: 'TrackWave', id }],
    }),

    // Update
    updateTrackWave: builder.mutation<
      TrackWaveType,
      { payload: Array<Number>; id: number }
    >({
      query: ({ id, payload }) => {
        const data = {
          wave_data: payload.toString(),
        };
        return {
          url: `${apiPaths.trackwavesUrl}${id}/`,
          method: 'PATCH',
          body: data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'TrackWave', id: id! },
      ],
    }),
  }),
  overrideExisting: true,
});

export default tracksWaveApi;
