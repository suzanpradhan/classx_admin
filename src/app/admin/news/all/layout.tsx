'use client'
import { Button, PageBar } from '@/core/ui/zenbuddha/src';
import { AddSquare } from 'iconsax-react';

export default function AddNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  
 
  return (
    <div className="flex flex-col">
      <PageBar
        leading={<div className="text-base font-bold text-dark-500">News</div>}
      >
          <div className="flex">
            <Button
              text="Add New News"
              className="h-8"
              type="link"
              href="/admin/news/mutate"
              prefix={<AddSquare size={18} variant="Bold" className="mr-1" />}
            />
          </div>
      
      </PageBar>
      {children}
    </div>
  );
}