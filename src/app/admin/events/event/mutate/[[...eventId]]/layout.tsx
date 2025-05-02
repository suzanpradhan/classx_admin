'use client';
import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { eventId } = useParams<{ eventId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {eventId ? 'Update' : 'Add  '} Event
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
