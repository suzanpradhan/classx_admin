import { PageBar } from "@/core/ui/zenbuddha/src";

export default async function AddArtistsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ ordersId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {resolvedParams ? ' Add New' : 'Update'} Orders
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
