import { PageBar } from "@/core/ui/zenbuddha/src";

export default async function AddGenresLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ digital_downloadId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {resolvedParams ? ' Add New' : 'Update'} Digital Download
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
