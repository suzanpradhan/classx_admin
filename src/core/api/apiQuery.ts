import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import {
  apiPaths,
  eventApiPaths,
  setHeaders,
  setHeadersEvents,
} from './apiConstants';

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
    'Appointments',
    'ArtistBooking',
    'FeaturedRelease',
    'ArtistInfos',
  ],
  endpoints: () => ({}),
});

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${eventApiPaths.eventBaseUrl}`,
    prepareHeaders: async (headers: Headers) => await setHeadersEvents(headers),
  }),
  tagTypes: [
    'User',
    'Venue',
    'City',
    'State',
    'Event',
    'Performer',
    'Event_Category',
    'Event_Performer',
    'Event_Tags',
  ],
  endpoints: () => ({}),
});
