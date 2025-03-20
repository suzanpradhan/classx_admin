'use client';

import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddSoundsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { soundsId } = useParams<{ soundsId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {soundsId ? 'Update' : 'Add  '} Beats
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
