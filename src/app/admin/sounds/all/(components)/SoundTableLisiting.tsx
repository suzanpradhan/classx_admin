'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import soundsApi from '@/modules/sounds/soundsApi';
import { SoundsType } from '@/modules/sounds/soundsType';
import { PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const SoundsTableListing = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(soundsApi.endpoints.getAllSounds.initiate(pageIndex));
  }, [dispatch, pageIndex]);
  const soundData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllSounds`]
        ?.data as PaginatedResponseType<SoundsType>
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
                soundsApi.endpoints.deleteSounds.initiate(onDelete as string)
              )
            );
          }
          toggleDeleteModel(false);
          setOnDelete(undefined);
        }}
      />
      <TableCard
        footer={
          soundData && soundData?.results.length ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 1}
              canNextPage={pageIndex < soundData.pagination.total_page}
              pageCount={soundData.pagination.total_page}
              pageIndex={soundData.pagination.current_page - 1}
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
            <th className={tableStyles.table_th}>Genres</th>
            <th className={tableStyles.table_th}>Durations</th>
            <th className={tableStyles.table_th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {soundData?.results.map((item, index) => (
            <tr key={index} className={tableStyles.table_tbody_tr}>
              <td className={tableStyles.table_td}>{item.id}</td>
              <td className={tableStyles.table_td}>{item.title}</td>
              <td className={tableStyles.table_td}>{item.artist.name}</td>
              <td className={tableStyles.table_td}>
                {item.genres && item.genres.length > 0
                  ? item.genres.map((item, index) => (
                      <div
                        key={index}
                        className="inline-block px-1 text-xs bg-slate-300 text-dark-500 rounded-sm mr-1"
                      >
                        {item.name}
                      </div>
                    ))
                  : ''}
              </td>

              <td className={tableStyles.table_td}>
                <span
                  className={`text-xs px-2 py-1 rounded-sm capitalize bg-slate-200 text-black flex items-center gap-1 w-max`}
                >
                  {item.duration}
                </span>
              </td>

              <td className={`${tableStyles.table_td} flex gap-2 max-w-xs`}>
                <Button
                  className="h-8 w-8"
                  type="link"
                  kind="warning"
                  href={`/admin/sounds/mutate/${item.id}`}
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

export default SoundsTableListing;
