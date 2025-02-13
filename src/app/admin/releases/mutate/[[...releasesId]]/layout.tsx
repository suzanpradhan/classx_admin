'use client';

import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddReleasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { releasesId } = useParams<{ releasesId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {releasesId ? 'Update' : 'Add  '} Releases
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
