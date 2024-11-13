import { PageBar } from "@/core/ui/zenbuddha/src";

export default function AddUsersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { bookingId: string };
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {params ? ' Update' : 'Add New  '} Artists
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
