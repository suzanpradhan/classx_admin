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
};
