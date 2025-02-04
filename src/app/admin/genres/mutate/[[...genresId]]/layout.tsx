import { PageBar } from "@/core/ui/zenbuddha/src";

export default async function AddGenresLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { genresId: string }
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {params.genresId ? 'Update' : 'Add New '} Genres

          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
