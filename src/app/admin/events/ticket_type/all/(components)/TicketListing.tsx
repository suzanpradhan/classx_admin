'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import ticketTypeAPi from '@/modules/events/ticket_type/ticket_typeApi';
import { TicketTypeDataType } from '@/modules/events/ticket_type/ticket_typeType';
import { PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const TicketListing = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(ticketTypeAPi.endpoints.getAllTicketType.initiate(pageIndex));
  }, [dispatch, pageIndex]);

  const ticketData = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getAllTicketType`]
        ?.data as PaginatedResponseType<TicketTypeDataType>
  );

  console.log(ticketData, 'ticket dtat');
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
                ticketTypeAPi.endpoints.deleteTicketType.initiate(
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
          ticketData && ticketData?.results.length ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 1}
              canNextPage={pageIndex < ticketData.pagination.total_page}
              pageCount={ticketData.pagination.total_page}
              pageIndex={ticketData.pagination.current_page - 1}
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
            <th className={tableStyles.table_th}>Price</th>
            <th className={tableStyles.table_th}>Stock</th>
            <th className={tableStyles.table_th}>Event</th>
            <th className={tableStyles.table_th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {ticketData?.results.map((item) => {
            return (
              <tr key={item.id} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{item.id}</td>
                <td className={tableStyles.table_td}>{item?.name}</td>
                <td className={tableStyles.table_td}>{item?.price}</td>
                <td className={tableStyles.table_td}>{item?.stock.quantity}</td>
                <td className={tableStyles.table_td}>{item?.event?.name}</td>

                <td className={tableStyles.table_td}>
                  <div className={`flex items-stretch h-full gap-2 max-w-xs`}>
                    <Button
                      className="h-8 w-8"
                      kind="warning"
                      type="link"
                      href={`/admin/events/ticket_type/mutate/${item.id}`}
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

export default TicketListing;
