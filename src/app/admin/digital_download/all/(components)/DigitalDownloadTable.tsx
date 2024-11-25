'use client'
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import digital_downloadApi from '@/modules/digital_download/digital_downloadApi';
import { Digital_DownloadType } from '@/modules/digital_download/digital_downloadType';
import { PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';


const DigitalDownloadTable = () => {
  const dispatch = useAppDispatch();
const [pageIndex, setPageIndex] = useState(1);
const [deleteModelOpen, toggleDeleteModel] = useState(false);
const [onDelete, setOnDelete] = useState<string | undefined>(undefined);


useEffect(() => {
  dispatch(digital_downloadApi.endpoints.getAlldigital.initiate(pageIndex.toString()));
}, [dispatch, pageIndex]);

const digitalData = useAppSelector(
  (state: RootState) => 
    state.baseApi.queries[`getAlldigital`]
      ?.data as PaginatedResponseType<Digital_DownloadType>
);

  return (
    <>
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
                    digital_downloadApi.endpoints.deleteDigital.initiate(onDelete as string)
                  )
                );
              }
              toggleDeleteModel(false);
              setOnDelete(undefined);
            }}
          />
          <TableCard
            footer={
              digitalData?.results.length ? (
                <PaginationNav
                  gotoPage={setPageIndex}
                  canPreviousPage={pageIndex > 0}
                  canNextPage={pageIndex < digitalData.pagination.total_page}
                  pageCount={digitalData.pagination.total_page}
                  pageIndex={digitalData.pagination.current_page - 1}
                />
              ) : (
                <></>
              )
            }
          >
            <thead>
              <tr className={tableStyles.table_thead_tr}>
                <th className={tableStyles.table_th}>S.N.</th>
                <th className={tableStyles.table_th}>Name</th>
                <th className={tableStyles.table_th}>Max Download</th>
                <th className={tableStyles.table_th}>Action</th>
                
              </tr>
            </thead>
            <tbody>
          {digitalData?.results.map((item, index) => (
            <tr key={item.id} className={tableStyles.table_tbody_tr}>
              <td className={tableStyles.table_td}>{index + 1}</td>
              <td className={tableStyles.table_td}>{item.release.title}</td>
              <td className={tableStyles.table_td}>{item.max_downloads}</td>
              <td className={tableStyles.table_td + ` flex gap-2 max-w-xs`}>
                  <Button
                    className="h-8 w-8"
                    type="link"
                    href={`/admin/digital_download/mutate/${item.id}`}
                    prefix={<PencilSimpleLine size={18} weight="duotone" />}
                  />
                  <Button
                    className="h-8 w-8"
                    kind="danger"
                    type="button"
                    prefix={<TrashSimple size={18} weight="duotone" />}
                    onClick={() => {
                      setOnDelete(item.id.toString());
                      toggleDeleteModel(true);
                    }}
                  />
               
              </td>
            </tr>
          ))}
        </tbody>
          </TableCard>
        </>
    </>
  );
};

export default DigitalDownloadTable
