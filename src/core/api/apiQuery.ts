import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { apiPaths, setHeaders } from './apiConstants';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiPaths.baseUrl}`,
    prepareHeaders: async (headers: Headers) => await setHeaders(headers),
  }),
  tagTypes: [
    'Roles',
    'Permissions',
    'UserPermissions',
    'Users',
    'Artists',
    'Genres',
    'Releases',
    'Track',
    'Sounds',
    'TrackWave',
    'Orders',
    'Products',
    'News',
    'Digital_Download',
    'Applicants',
    'ArtistBooking',
    'FeaturedRelease',
  ],
  endpoints: () => ({}),
});
