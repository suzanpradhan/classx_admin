import { PageBar } from "@/core/ui/zenbuddha/src";
export default async function AddReleasesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { releasesId: string }
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {params.releasesId ? 'Update' : 'Add New'} Releases
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
