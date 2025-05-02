'use client';
import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddNewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { performerSlug } = useParams<{ performerSlug: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {performerSlug ? 'Update' : 'Add  '} Event Performer
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
