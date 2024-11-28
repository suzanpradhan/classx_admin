import { PageBar } from "@/core/ui/zenbuddha/src";

export default async function AddTracksLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tracksId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {resolvedParams ? ' Add New' : 'Update'} Tracks
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
