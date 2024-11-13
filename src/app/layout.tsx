import Provider from '@/core/redux/provider';
import Notification from '@/core/ui/components/Notification';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'ClassX Presentation',
  description: 'ClassX Presentation is a venture with a non-stereotypical scheme towards creating a stepping stone in the developing phase of the seeking(aspiring) artists.',
  keywords: ['music', 'nepali', 'song', 'songs', 'class', 'classx', 'classX', 'classXpresentation', 'presentation', 'vek', 'yabes', 'songsnepal'],
  authors: [
    {
      name: 'IIONS Tech Pvt. Ltd.',
      url: 'https://github.com/suzanpradhan/classx_admin'
    },
  ],
  creator: 'Niwesh Shrestha',
  publisher: 'Niwesh Shrestha',
  icons: {
    icon: '/favicon.ico',
  }
};

const helvetica = localFont({
  src: [
    {
      path: '../../public/fonts/HelveticaNowDisplay-Light.ttf',
      weight: '300',
    },
    {
      path: '../../public/fonts/HelveticaNowDisplay-Regular.ttf',
      weight: '400',
    },
    {
      path: '../../public/fonts/HelveticaNowDisplay-Medium.ttf',
      weight: '500',
    },
    {
      path: '../../public/fonts/HelveticaNowDisplay-Bold.ttf',
      weight: '600',
    },
    {
      path: '../../public/fonts/HelveticaNowDisplay-ExtraBold.ttf',
      weight: '700',
    },
    {
      path: '../../public/fonts/HelveticaNowDisplay-Black.ttf',
      weight: '800',
    },
    {
      path: '../../public/fonts/HelveticaNowDisplay-ExtBlk.ttf',
      weight: '900',
    },
  ],
  variable: '--font-helvetica',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${helvetica.variable} font-sans`}
      >
        <Notification />
        <div id="deleteWarningDialog"></div>
       <Provider>{children}</Provider>
      </body>
    </html>
  );
}
