'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import performerApi from '@/modules/events/performer/performerApi';
import { EventPerfomerDataTypes } from '@/modules/events/performer/performerType';
import { PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const PerformerLisiting = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(performerApi.endpoints.getAllEventPerformer.initiate(pageIndex));
  }, [dispatch, pageIndex]);

  const performerData = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getAllEventPerformer`]
        ?.data as PaginatedResponseType<EventPerfomerDataTypes>
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
                performerApi.endpoints.deletePerformer.initiate(
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
          performerData && performerData?.results.length ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 1}
              canNextPage={pageIndex < performerData.pagination.total_page}
              pageCount={performerData.pagination.total_page}
              pageIndex={performerData.pagination.current_page - 1}
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>S.N.</th>
            <th className={tableStyles.table_th}>Event</th>
            <th className={tableStyles.table_th}>Performer</th>
            <th className={tableStyles.table_th}>Uuid</th>
            <th className={tableStyles.table_th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {performerData?.results.map((item, index) => {
            return (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{item.id}</td>
                <td className={tableStyles.table_td}>{item?.event?.name}</td>
                <td className={tableStyles.table_td}>
                  {item?.performer?.name}
                </td>
                <td className={tableStyles.table_td}>
                  {item?.performer?.uuid}
                </td>

                <td className={tableStyles.table_td}>
                  <div className={`flex items-stretch h-full gap-2 max-w-xs`}>
                    <Button
                      className="h-8 w-8"
                      kind="warning"
                      type="link"
                      href={`/admin/events/performer/mutate/${item.id}`}
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
            );
          })}
        </tbody>
      </TableCard>
    </>
  );
};

export default PerformerLisiting;
