import { PageBar } from "@/core/ui/zenbuddha/src";
export default async function AddReleasesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ releasesId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {resolvedParams ? ' Add New' : 'Update'} Releases
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
