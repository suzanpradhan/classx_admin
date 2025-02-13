'use client';

import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ordersId } = useParams<{ ordersId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {ordersId ? 'Update' : 'Add  '} Orders
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
