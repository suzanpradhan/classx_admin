'use client';

import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categoryId } = useParams<{ categoryId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {categoryId ? 'Update' : 'Add  '} Event Category
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
