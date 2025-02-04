import { PageBar } from "@/core/ui/zenbuddha/src";

export default function AddFooterLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { applicantsId: string };
}) {
    return (
        <div className="flex flex-col ">
            <PageBar
                leading={
                    <div className="text-base font-bold text-dark-500">
                        {params.applicantsId ? 'Update' : 'Add New '} Applicants
                    </div>
                }
            ></PageBar>
            {children}
        </div>
    );
}
