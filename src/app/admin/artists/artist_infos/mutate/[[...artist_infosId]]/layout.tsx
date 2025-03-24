'use client';
import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddArtistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { artist_infosId } = useParams<{ artist_infosId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {artist_infosId ? 'Update' : 'Add  '} Artist Infos
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
