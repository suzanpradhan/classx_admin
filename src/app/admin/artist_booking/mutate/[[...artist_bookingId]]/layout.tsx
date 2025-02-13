'use client';
import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddArtistBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { artist_bookingId } = useParams<{ artist_bookingId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {artist_bookingId ? 'Update' : 'Add  '} Artist Booking
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
