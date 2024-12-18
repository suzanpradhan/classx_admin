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
        leading={<div className="text-base font-bold text-dark-500">Artists</div>}
      >
        <div className="flex">
          <Button
            text="Add New Artists"
            kind='warning'
            className="h-8"
            type="link"
            href="/admin/artists/mutate"
            prefix={<CirclePlus size={18} className="mr-1" />}
          />
        </div>

      </PageBar>
      {children}
    </div>
  );
}
