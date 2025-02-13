'use client';

import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { productsSlug } = useParams<{ productsSlug: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {productsSlug ? 'Update' : 'Add  '} Products
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
