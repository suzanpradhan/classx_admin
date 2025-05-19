'use client';
import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddTicketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ticket_typeId } = useParams<{ ticket_typeId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {ticket_typeId ? 'Update' : 'Add  '}Ticket Type
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
