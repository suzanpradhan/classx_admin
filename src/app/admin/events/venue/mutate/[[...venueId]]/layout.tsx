'use client';
import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddNewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { venueId } = useParams<{ venueId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {venueId ? 'Update' : 'Add  '} Venue
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
