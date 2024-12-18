'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import genresApi from '@/modules/genres/genresApi';
import { GenresType } from '@/modules/genres/genresType';
import { PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const GenresTableLisiting = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);


  useEffect(() => {
    dispatch(genresApi.endpoints.getAllGenres.initiate(pageIndex.toString()));
  }, [dispatch, pageIndex]);

  const genresData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllGenres`]
        ?.data as PaginatedResponseType<GenresType>
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
                  genresApi.endpoints.deleteGenres.initiate(onDelete as string)
                )
              );
            }
            toggleDeleteModel(false);
            setOnDelete(undefined);
          }}
        />
        <TableCard
          footer={
            genresData?.results.length ? (
              <PaginationNav
                gotoPage={setPageIndex}
                canPreviousPage={pageIndex > 0}
                canNextPage={pageIndex < genresData.pagination.total_page}
                pageCount={genresData.pagination.total_page}
                pageIndex={genresData.pagination.current_page - 1}
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
              <th className={tableStyles.table_th}>Action</th>

            </tr>
          </thead>
          <tbody>
            {genresData?.results.map((item, index) => (
              <tr key={item.id} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{index + 1}</td>
                <td className={tableStyles.table_td}>{item.name}</td>
                <td className={tableStyles.table_td + ` flex gap-2 max-w-xs`}>
                  <Button
                    className="h-8 w-8"
                    type="link"
                    kind='warning'
                    href={`/admin/genres/mutate/${item.id}`}
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

export default GenresTableLisiting;
