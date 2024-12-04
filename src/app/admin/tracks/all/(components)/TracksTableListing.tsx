'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import tracksApi from '@/modules/tracks/tracksApi';
import { Trackstype } from '@/modules/tracks/trackType';
// import { Eye } from 'iconsax-react';
import { Eye, PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const TaraclTableListing = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(tracksApi.endpoints.getAllTracks.initiate(pageIndex));
  }, [dispatch, pageIndex]);
  const trackData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllTracks`]?.data as PaginatedResponseType<Trackstype>
  );


  // console.log(trackData, "data");

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
                tracksApi.endpoints.deleteTracks.initiate(onDelete as string)
              )
            );
          }
          toggleDeleteModel(false);
          setOnDelete(undefined);
        }}
      />
      <TableCard
        footer={
          trackData && trackData?.results.length > 0 ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 0}
              canNextPage={pageIndex < trackData.pagination.total_page}
              pageCount={trackData.pagination.total_page}
              pageIndex={trackData.pagination.current_page - 1}
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>S.N.</th>
            <th className={tableStyles.table_th}>Title</th>
            <th className={tableStyles.table_th}>Artists</th>
            <th className={tableStyles.table_th}>Slug</th>
            <th className={tableStyles.table_th}>Genres</th>
            <th className={tableStyles.table_th}>Release</th>
            <th className={tableStyles.table_th}>Durations</th>
            <th className={tableStyles.table_th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trackData?.results.map((item, index) => (
            <tr key={index} className={tableStyles.table_tbody_tr}>
              <td className={tableStyles.table_td}>{item.id}</td>
              <td className={tableStyles.table_td}>{item.title}</td>
              <td className={tableStyles.table_td}>{item.artist.name}</td>
              <td className={tableStyles.table_td}>{item.slug}</td>
              <td className={tableStyles.table_td}>{item.genres && item.genres.length > 0 ? item.genres.map((item, index) => <div key={index} className='inline-block px-1 text-xs bg-slate-300 text-dark-500 rounded-sm mr-1'>{item.name}</div>) : ""}</td>
              <td className={tableStyles.table_td}>{item.release.title}</td>
              <td className={tableStyles.table_td}><span className={`text-xs px-2 py-1 rounded-sm capitalize bg-slate-200 text-black flex items-center gap-1 w-max`}>{item.duration}</span></td>

              <td className={`${tableStyles.table_td} flex gap-2 max-w-xs`}>
                <Button
                  className="h-8 w-8"
                  type="link"
                  href={`/admin/tracks/${item.id}`}
                  buttonType="bordered"
                  prefix={<Eye size={18} weight="duotone" />}
                />
                <Button
                  className="h-8 w-8"
                  type="link"
                  href={`/admin/tracks/mutate/${item.id}`}
                  prefix={<PencilSimpleLine size={15} weight="duotone" />}
                />
                <Button
                  className="h-8 w-8"
                  kind="danger"
                  type="button"
                  onClick={() => {
                    setOnDelete(item.id.toString());
                    toggleDeleteModel(true);
                  }}
                  prefix={<TrashSimple size={18} weight="duotone" />}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </>
  );
};

export default TaraclTableListing;
