'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import releaseApi from '@/modules/releases/releasesApi';
import { ReleasesType } from '@/modules/releases/releasesType';
// import { Eye } from 'iconsax-react';
import { useEffect, useState } from 'react';
import RealesTableRow from './RealesTableRow';

const ReleasesTableListing = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);

  useEffect(() => {
    dispatch(releaseApi.endpoints.getAllReleases.initiate(pageIndex));
  }, [dispatch, pageIndex]);
  const releaseData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllReleases`]?.data as PaginatedResponseType<ReleasesType>
  );


  // console.log(releaseData, "data");

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
                    releaseApi.endpoints.deleteReleases.initiate(onDelete as string)
                  )
                );
              }
              toggleDeleteModel(false);
              setOnDelete(undefined);
            }}
          />
      <TableCard
        footer={
          releaseData && releaseData?.results.length > 0 ?  (
          <PaginationNav
            gotoPage={setPageIndex}
            canPreviousPage={pageIndex > 0}
            canNextPage={pageIndex < releaseData.pagination.total_page}
            pageCount={releaseData.pagination.total_page}
            pageIndex={releaseData.pagination.current_page - 1}
          />
        ) : (
          <></>
        )
      }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>S.N.</th>
            <th className={tableStyles.table_th}>Cover</th>
            <th className={tableStyles.table_th}>Title</th>
            <th className={tableStyles.table_th}>Artists</th>
            <th className={tableStyles.table_th}>Genres</th>
            <th className={tableStyles.table_th}>Release Type</th>
            <th className={tableStyles.table_th}>Release Date</th>
            <th className={tableStyles.table_th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {releaseData?.results.map((item, index) => (
            <RealesTableRow props={item} setOnDelete={setOnDelete} toggleDeleteModel={toggleDeleteModel} key={index}/>
          ))}
        </tbody>
      </TableCard>
    </>
  );
};

export default ReleasesTableListing;
