'use client';

import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddGenresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { genresId } = useParams<{ genresId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {genresId ? 'Update' : 'Add  '} Genres
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
