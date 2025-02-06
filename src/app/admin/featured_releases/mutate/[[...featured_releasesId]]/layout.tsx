'use client';
import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddFeaturedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { featured_releasesId } = useParams<{ featured_releasesId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {featured_releasesId ? 'Update' : 'Add  '} Featured Release
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
