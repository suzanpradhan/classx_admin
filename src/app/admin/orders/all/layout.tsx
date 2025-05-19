'use client';
import { PageBar } from '@/core/ui/zenbuddha/src';

export default function AddNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">Orders</div>
        }
      >
        <div className="flex">
          {/* <Button
              text="Add New Orders"
              className="h-8"
              type="link"
              href="/admin/orders/mutate"
              prefix={<AddSquare size={18} variant="Bold" className="mr-1" />}
            /> */}
        </div>
      </PageBar>
      {children}
    </div>
  );
}
