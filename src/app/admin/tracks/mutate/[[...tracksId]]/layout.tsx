'use client';

import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddTracksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tracksId } = useParams<{ tracksId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {tracksId ? 'Update' : 'Add  '} Tracks
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
