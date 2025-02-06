'use client';
import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddNewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { newsId } = useParams<{ newsId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {newsId ? 'Update' : 'Add  '} News
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
