'use client';
import { PageBar } from '@/core/ui/zenbuddha/src';
import { useParams } from 'next/navigation';

export default function AddApplicantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { applicantsId } = useParams<{ applicantsId: string }>();

  return (
    <div className="flex flex-col ">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {applicantsId ? 'Update' : 'Add  '} Applicants
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
