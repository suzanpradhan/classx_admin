'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import eventCategoryApi from '@/modules/events/event_category/event_categoryApi';
import { EventCategoryType } from '@/modules/events/event_category/event_categoryType';
import { PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const EventCategoryListing = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(
      eventCategoryApi.endpoints.getAllEventCategory.initiate({
        pageNumber: pageIndex.toString(),
      })
    );
  }, [dispatch, pageIndex]);

  const eventCategoryData = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getAllEventCategory`]
        ?.data as PaginatedResponseType<EventCategoryType>
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
                  eventCategoryApi.endpoints.deleteEventCategory.initiate(
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
            eventCategoryData?.results.length ? (
              <PaginationNav
                gotoPage={setPageIndex}
                canPreviousPage={pageIndex > 1}
                canNextPage={
                  pageIndex < eventCategoryData.pagination.total_page
                }
                pageCount={eventCategoryData.pagination.total_page}
                pageIndex={eventCategoryData.pagination.current_page - 1}
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
            {eventCategoryData?.results.map((item, index) => (
              <tr key={item.id} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{index + 1}</td>
                <td className={tableStyles.table_td}>{item.title}</td>
                <td className={tableStyles.table_td + ` flex gap-2 max-w-xs`}>
                  <Button
                    className="h-8 w-8"
                    type="link"
                    kind="warning"
                    href={`/admin/events/category/mutate/${item.id}`}
                    prefix={<PencilSimpleLine size={18} weight="duotone" />}
                  />
                  <Button
                    className="h-8 w-8"
                    kind="danger"
                    type="button"
                    prefix={<TrashSimple size={18} weight="duotone" />}
                    onClick={() => {
                      if (item.id) {
                        setOnDelete(item.id.toString());
                        toggleDeleteModel(true);
                      }
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

export default EventCategoryListing;
