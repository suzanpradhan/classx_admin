'use client';
import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddArtistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { artistsSlug } = useParams<{ artistsSlug: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {artistsSlug ? 'Update' : 'Add  '} Artists
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
