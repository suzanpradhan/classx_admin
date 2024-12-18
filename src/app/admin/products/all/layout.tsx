'use client';
import { Button, PageBar } from '@/core/ui/zenbuddha/src';
import { CirclePlus } from 'lucide-react';

export default function AddNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col">
      <PageBar
        leading={<div className="text-base font-bold text-dark-500">Products</div>}
      >
        <div className="flex">
          <Button
            text="Add New Products"
            kind='warning'
            className="h-8"
            type="link"
            href="/admin/products/mutate"
            prefix={<CirclePlus size={18} className="mr-1" />}
          />
        </div>

      </PageBar>
      {children}
    </div>
  );
}
