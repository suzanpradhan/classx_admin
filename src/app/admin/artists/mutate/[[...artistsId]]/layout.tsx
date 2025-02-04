import { PageBar } from "@/core/ui/zenbuddha/src";

export default async function AddArtistsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { artitstId: string };
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {params.artitstId ? 'Update' : 'Add New '} Artists

          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
