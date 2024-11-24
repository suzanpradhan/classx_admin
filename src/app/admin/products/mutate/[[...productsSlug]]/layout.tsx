import { PageBar } from "@/core/ui/zenbuddha/src";

export default function AddArtistsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { productsSlug: string };
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {params?.productsSlug ? "Update" : "Add New"} Products
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
