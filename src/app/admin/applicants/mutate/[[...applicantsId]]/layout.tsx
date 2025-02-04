import { PageBar } from '@/core/ui/zenbuddha/src';

export default async function AddApplicantsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ applicantsId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {resolvedParams ? ' Add New' : 'Update'} Applicants
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
