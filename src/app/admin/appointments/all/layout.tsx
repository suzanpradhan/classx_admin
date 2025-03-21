'use client';
import { PageBar } from '@/core/ui/zenbuddha/src';

export default function AddApplicantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            All Appointments
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
