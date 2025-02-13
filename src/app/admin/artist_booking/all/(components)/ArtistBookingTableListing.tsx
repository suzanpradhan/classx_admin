'use client';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import artistBookingApi from '@/modules/artists/artist_bookingApi';
import { ArtitstBookingType } from '@/modules/artists/artistsType';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Clock, Eye, PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const ArtistBookingTableListing = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(
      artistBookingApi.endpoints.getAllArtistBooking.initiate(pageIndex)
    );
  }, [dispatch, pageIndex]);

  const artistBookingsData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllArtistBooking`]
        ?.data as PaginatedResponseType<ArtitstBookingType>
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
                artistBookingApi.endpoints.deleteArtistBooking.initiate(
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
          artistBookingsData && artistBookingsData?.results.length ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 1}
              canNextPage={pageIndex < artistBookingsData.pagination.total_page}
              pageCount={artistBookingsData.pagination.total_page}
              pageIndex={artistBookingsData.pagination.current_page - 1}
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>S.N.</th>
            <th className={tableStyles.table_th}>FullName</th>
            <th className={tableStyles.table_th}>Email</th>
            <th className={tableStyles.table_th}>Phone</th>
            <th className={tableStyles.table_th}>Artist</th>
            <th className={tableStyles.table_th}>Event Type</th>
            <th className={tableStyles.table_th}>Date</th>
            <th className={tableStyles.table_th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {artistBookingsData?.results.map((item, index) => {
            const parsedDate = parseISO(item.event_date as string);
            const formattedDate = item.event_date
              ? format(toZonedTime(parsedDate, 'UTC'), 'PPpp')
              : 'Invalid Date';
            return (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{item.id}</td>
                <td className={tableStyles.table_td}>{item.full_name}</td>
                <td className={tableStyles.table_td}>{item.email}</td>
                <td className={tableStyles.table_td}>{item.phone}</td>
                <td className={tableStyles.table_td}>{item?.artist?.name}</td>
                <td className={tableStyles.table_td}>{item.event_type}</td>
                <td className={tableStyles.table_td}>
                  <span
                    className={`text-xs px-2 py-1 rounded-sm capitalize bg-slate-200 text-black flex items-center gap-1 w-max`}
                  >
                    <Clock size={15} weight="duotone" />
                    {formattedDate}
                  </span>
                </td>
                <td className={tableStyles.table_td}>
                  <div className={`flex items-stretch h-full gap-2 max-w-xs`}>
                    <Button
                      className="h-8 w-8"
                      type="link"
                      href={`/admin/artist_booking/${item.id}`}
                      buttonType="bordered"
                      prefix={<Eye size={18} weight="duotone" />}
                    />
                    <Button
                      className="h-8 w-8"
                      kind="warning"
                      type="link"
                      href={`/admin/artist_booking/mutate/${item.id}`}
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

export default ArtistBookingTableListing;
