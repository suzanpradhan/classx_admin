import { getSession } from 'next-auth/react';

export const apiConfig = {
  headers: {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
};
export async function setHeaders(headers: Headers) {
  const session = await getSession();
  // eslint-disable-next-line no-unused-vars
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (session) {
    const token = (session! as any).user.accessToken as string;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
  }
  headers.set('accept', 'application/json');
  return headers;
}

export async function setHeadersEvents(headers: Headers) {
  const apiKey = process.env.NEXT_PUBLIC_X_ORGANZIER_KEY || '';
  const username = process.env.NEXT_PUBLIC_X_ORGANZIER_USERNAME || '';
  headers.set('accept', 'application/json');
  headers.set('X-Organizer-Key', apiKey);
  headers.set('X-Organizer-Username', username);
  return headers;
}

export const apiPaths = {
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URL + '/api/v1/',
  loginUrl: 'auth/login/',
  artistsUrl: 'artists/',
  genresUrl: 'genres/',
  releasesUrl: 'releases/',
  tracksUrl: 'tracks/',
  trackwavesUrl: 'track_wave/',
  ordersUrl: 'orders/',
  productsUrl: 'products/',
  newsUrl: 'blogs/',
  soundsUrl: 'sounds/',
  digital_downloadUrl: 'digital_files/',
  applicantsUrl: 'applicants/',
  appointmentsUrl: 'appointments/',
  artistbookingUrl: 'artist_booking/',
  featuredreleasesUrl: 'featured_releases/',
  artist_infosUrl: 'artist_infos/',
};

export const eventApiPaths = {
  serverUrl: process.env.NEXT_PUBLIC_EVENT_URL,
  eventBaseUrl: process.env.NEXT_PUBLIC_EVENT_URL + '/api/v1/',
  loginUrl: 'auth/login/',
  usersUrl: 'users/',
  venueUrl: 'venue/',
  cityUrl: 'city/',
  stateUrl: 'state/',
  eventCategoryUrl: 'event-category/',
  eventUrl: 'event/',
  event_tagsUrl: 'event-tag/',
  performerUrl: 'performer/',
  eventPerformerUrl: 'event-performer/',
  ticketTypeUrl: 'ticket-type/',
};
