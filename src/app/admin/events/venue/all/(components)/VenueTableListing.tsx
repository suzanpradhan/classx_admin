'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import venueApi from '@/modules/events/venue/venueApi';
import { VenueDataType } from '@/modules/events/venue/venueType';
import Image from 'next/image';
import { Eye, PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const VenueTableListing = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(venueApi.endpoints.getAllVenue.initiate({ pageNumber: '1' }));
  }, [dispatch, pageIndex]);

  const venueData = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getAllVenue`]
        ?.data as PaginatedResponseType<VenueDataType>
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
                venueApi.endpoints.deleteVenue.initiate(onDelete as string)
              )
            );
          }
          toggleDeleteModel(false);
          setOnDelete(undefined);
        }}
      />
      <TableCard
        footer={
          venueData && venueData?.results.length ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 1}
              canNextPage={pageIndex < venueData.pagination.total_page}
              pageCount={venueData.pagination.total_page}
              pageIndex={venueData.pagination.current_page - 1}
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
            <th className={tableStyles.table_th}>Title</th>
            <th className={tableStyles.table_th}>City</th>
            <th className={tableStyles.table_th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {venueData?.results.map((item, index) => {
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
                <td className={tableStyles.table_td}>{item?.city?.name}</td>

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

export default VenueTableListing;
