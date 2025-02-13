'use client';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import applicantsApi from '@/modules/applicants/applicantsApi';
import { ApplicantsType } from '@/modules/applicants/applicantsType';
import Image from 'next/image';
import { Eye, PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const ApplicantsTableListing = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(applicantsApi.endpoints.getAllApplicants.initiate(pageIndex));
  }, [dispatch, pageIndex]);

  const applicantsData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllApplicants`]
        ?.data as PaginatedResponseType<ApplicantsType>
  );
  return (
    <>
      <AlertDialog
        isOpen={deleteModelOpen}
        deleteContent={onDelete}
        onClickNo={() => {
          toggleDeleteModel(false);
        }}
        onClickYes={async () => {
          if (onDelete) {
            await Promise.resolve(
              dispatch(
                applicantsApi.endpoints.deleteApplicants.initiate(
                  onDelete as string
                )
              )
            );
          }
          toggleDeleteModel(false);
          setOnDelete(undefined);
        }}
      />
      <TableCard
        footer={
          applicantsData && applicantsData?.results.length ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 1}
              canNextPage={pageIndex < applicantsData.pagination.total_page}
              pageCount={applicantsData.pagination.total_page}
              pageIndex={applicantsData.pagination.current_page - 1}
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>S.N.</th>
            <th className={tableStyles.table_th}>Image</th>
            <th className={tableStyles.table_th}>FullName</th>
            <th className={tableStyles.table_th}>Email</th>
            <th className={tableStyles.table_th}>Genre</th>
            <th className={tableStyles.table_th}>Permanent Address</th>
            <th className={tableStyles.table_th}>Current Address</th>
            <th className={tableStyles.table_th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {applicantsData?.results.map((item, index) => (
            <tr key={index} className={tableStyles.table_tbody_tr}>
              <td className={tableStyles.table_td}>{item.id}</td>
              <td className={tableStyles.table_td}>
                <div className="relative w-20 h-20 overflow-hidden rounded-md">
                  {item.photo && (
                    <Image
                      src={item.photo}
                      alt={item.full_name ?? ''}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = '/images/errors/placeholder.webp';
                      }}
                      fill
                      placeholder="blur"
                      blurDataURL={item.photo}
                      quality={75}
                      sizes="(max-width: 768px) 75vw, 33vw"
                      className="object-cover"
                    />
                  )}
                </div>
              </td>
              <td className={tableStyles.table_td}>{item.full_name}</td>
              <td className={tableStyles.table_td}>{item.email}</td>
              <td className={tableStyles.table_td}>{item?.genre?.name}</td>
              <td className={tableStyles.table_td}>{item.perm_address}</td>
              <td className={tableStyles.table_td}>{item.current_address}</td>
              <td className={tableStyles.table_td}>
                <div className={`flex items-stretch h-full gap-2 max-w-xs`}>
                  <Button
                    className="h-8 w-8"
                    type="link"
                    href={`/admin/applicants/${item.id}`}
                    buttonType="bordered"
                    prefix={<Eye size={18} weight="duotone" />}
                  />
                  <Button
                    className="h-8 w-8"
                    kind="warning"
                    type="link"
                    href={`/admin/applicants/mutate/${item.id}`}
                    prefix={<PencilSimpleLine size={15} weight="duotone" />}
                  />
                  <Button
                    className="h-8 w-8"
                    kind="danger"
                    type="button"
                    onClick={() => {
                      setOnDelete(item.id?.toString());
                      toggleDeleteModel(true);
                    }}
                    prefix={<TrashSimple size={18} weight="duotone" />}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </>
  );
};

export default ApplicantsTableListing;
