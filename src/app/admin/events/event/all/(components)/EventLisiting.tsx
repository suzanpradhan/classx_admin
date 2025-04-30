'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import eventsApi from '@/modules/events/event/eventApi';
import { EventType } from '@/modules/events/event/eventType';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import Image from 'next/image';
import { Eye, PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const EventLisiting = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(eventsApi.endpoints.getAllEvents.initiate({ pageNumber: '1' }));
  }, [dispatch, pageIndex]);

  const eventData = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getAllEvents`]
        ?.data as PaginatedResponseType<EventType>
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
                eventsApi.endpoints.deleteEvent.initiate(onDelete as string)
              )
            );
          }
          toggleDeleteModel(false);
          setOnDelete(undefined);
        }}
      />
      <TableCard
        footer={
          eventData && eventData?.results.length ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 1}
              canNextPage={pageIndex < eventData.pagination.total_page}
              pageCount={eventData.pagination.total_page}
              pageIndex={eventData.pagination.current_page - 1}
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
            <th className={tableStyles.table_th}>Name</th>
            <th className={tableStyles.table_th}>Venue</th>
            <th className={tableStyles.table_th}>Date</th>
            <th className={tableStyles.table_th}>Status</th>
            <th className={tableStyles.table_th}>Organizer</th>
            <th className={tableStyles.table_th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {eventData?.results.map((item, index) => {
            const parsedDate = parseISO(item.start_date);
            const formattedDate = item.start_date
              ? format(toZonedTime(parsedDate, 'UTC'), 'PPpp')
              : 'Invalid Date';
            return (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{item.id}</td>
                <td className={tableStyles.table_td}>
                  <div className="relative w-20 h-20 overflow-hidden rounded-md">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name ?? ''}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = '/images/errors/placeholder.webp';
                        }}
                        fill
                        placeholder="blur"
                        blurDataURL={item.image}
                        quality={75}
                        sizes="(max-width: 768px) 75vw, 33vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className={tableStyles.table_td}>{item.name}</td>
                <td className={tableStyles.table_td}>{item?.venue?.name}</td>
                <td className={tableStyles.table_td}>{formattedDate}</td>
                <td className={tableStyles.table_td}>{item?.status}</td>
                <td className={tableStyles.table_td}>
                  {item?.organizer?.username}
                </td>

                <td className={tableStyles.table_td}>
                  <div className={`flex items-stretch h-full gap-2 max-w-xs`}>
                    <Button
                      className="h-8 w-8"
                      type="link"
                      href={`/admin/events/venue/${item.id}`}
                      buttonType="bordered"
                      prefix={<Eye size={18} weight="duotone" />}
                    />
                    <Button
                      className="h-8 w-8"
                      kind="warning"
                      type="link"
                      href={`/admin/events/venue/mutate/${item.id}`}
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

export default EventLisiting;
