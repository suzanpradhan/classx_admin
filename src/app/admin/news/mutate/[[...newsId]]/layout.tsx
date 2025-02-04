import { PageBar } from "@/core/ui/zenbuddha/src";

export default async function AddArtistsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { newsId: string };
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {params.newsId ? 'Update' : 'Add New'} News
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
