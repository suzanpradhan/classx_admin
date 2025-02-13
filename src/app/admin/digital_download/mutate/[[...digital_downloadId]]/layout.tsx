'use client';

import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddDigitalDownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { digital_downloadId } = useParams<{ digital_downloadId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {digital_downloadId ? 'Update' : 'Add  '} Digital Download
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
