'use client';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import appointmentsApi from '@/modules/appointments/appointmentsApi';
import { AppointmentsType } from '@/modules/appointments/appointmentsType';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { DirectRight } from 'iconsax-react';
import { Clock, Eye, Phone, TrashSimple, User } from 'phosphor-react';
import { useEffect, useState } from 'react';

const AppointmentsTableListing = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(appointmentsApi.endpoints.getAllAppointments.initiate(pageIndex));
  }, [dispatch, pageIndex]);

  const appointmentsData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllAppointments`]
        ?.data as PaginatedResponseType<AppointmentsType>
  );

  const formatDate = (date: string | null, timeZone: string = 'UTC') => {
    if (!date) return 'Invalid Date';
    try {
      const parsedDate = parseISO(date);
      return format(toZonedTime(parsedDate, timeZone), 'PPpp');
    } catch (error) {
      return 'Invalid Date';
    }
  };

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
                appointmentsApi.endpoints.deleteAppointments.initiate(
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
          appointmentsData && appointmentsData?.results.length ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 1}
              canNextPage={pageIndex < appointmentsData.pagination.total_page}
              pageCount={appointmentsData.pagination.total_page}
              pageIndex={appointmentsData.pagination.current_page - 1}
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>S.N.</th>
            <th className={tableStyles.table_th}>Client Info</th>
            <th className={tableStyles.table_th}>Genre</th>
            <th className={tableStyles.table_th}>Type</th>
            <th className={tableStyles.table_th}>Permanent Address</th>
            <th className={tableStyles.table_th}>Current Address</th>
            <th className={tableStyles.table_th}>Start Date</th>
            <th className={tableStyles.table_th}>End Date</th>
            <th className={tableStyles.table_th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointmentsData?.results.map((item, index) => {
            const formattedStartDate = formatDate(item.start_dt as string);
            const formattedEndDate = formatDate(item.end_dt as string);

            return (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{item.id}</td>
                <td className={tableStyles.table_td}>
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-xs uppercase text-black flex items-center gap-1 w-max font-semibold`}
                    >
                      <User size={15} weight="duotone" />
                      {`${item.full_name}`}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-sm capitalize bg-slate-600 text-white flex items-center gap-1 w-max`}
                    >
                      <Phone size={15} weight="duotone" />
                      {item.phone}
                    </span>
                    <a
                      href={`mailto:${item.email}`}
                      className={`text-xs px-2 py-1 rounded-sm  bg-slate-900 text-white flex items-center gap-1 w-max`}
                    >
                      {item.email}
                      <DirectRight size={15} />
                    </a>
                  </div>
                </td>
                <td className={tableStyles.table_td}>{item?.genre?.name}</td>
                <td className={tableStyles.table_td}>{item?.type}</td>
                <td className={tableStyles.table_td}>{item.perm_address}</td>
                <td className={tableStyles.table_td}>{item.current_address}</td>
                <td className={tableStyles.table_td}>
                  <span
                    className={`text-xs px-2 py-1 rounded-sm capitalize bg-slate-200 text-black flex items-center gap-1 w-max`}
                  >
                    <Clock size={15} weight="duotone" />
                    {formattedStartDate}
                  </span>
                </td>
                <td className={tableStyles.table_td}>
                  <span
                    className={`text-xs px-2 py-1 rounded-sm capitalize bg-slate-200 text-black flex items-center gap-1 w-max`}
                  >
                    <Clock size={15} weight="duotone" />
                    {formattedEndDate}
                  </span>
                </td>
                <td className={tableStyles.table_td}>
                  <div className={`flex items-stretch h-full gap-2 max-w-xs`}>
                    <Button
                      className="h-8 w-8"
                      type="link"
                      href={`/admin/appointments/${item.id}`}
                      buttonType="bordered"
                      prefix={<Eye size={18} weight="duotone" />}
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

export default AppointmentsTableListing;
