'use client';

import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import { Edit2, Eye, Trash } from 'iconsax-react';

const ReleasesTableLisitng = () => {
 

  return (
    <>
        <>
          {/* <AlertDialog
            isOpen={deleteModelOpen}
            deleteContent={onDelete}
            onClickNo={() => {
              toggleDeleteModel(false);
            }}
            onClickYes={async () => {
              if (onDelete) {
                await Promise.resolve(
                  dispatch(
                    hotelApi.endpoints.deleteHotel.initiate(onDelete as string)
                  )
                );
              }
              toggleDeleteModel(false);
              setOnDelete(undefined);
            }}
          /> */}
          <TableCard
            // footer={
            //   hotelData.results.length ? (
            //     <PaginationNav
            //       gotoPage={setPageIndex}
            //       canPreviousPage={pageIndex > 0}
            //       canNextPage={pageIndex < hotelData.pagination.total_page}
            //       pageCount={hotelData.pagination.total_page}
            //       pageIndex={hotelData.pagination.current_page - 1}
            //     />
            //   ) : (
            //     <></>
            //   )
            // }
          >
            <thead>
              <tr className={tableStyles.table_thead_tr}>
                <th className={tableStyles.table_th}>S.N.</th>
                <th className={tableStyles.table_th}>Title</th>
                <th className={tableStyles.table_th}>Artist</th>
                <th className={tableStyles.table_th}>Release type</th>
                <th className={tableStyles.table_th}>Release date</th>
                <th className={tableStyles.table_th}>Genres</th>
                
              </tr>
            </thead>
            <tbody>
                  <tr className={tableStyles.table_tbody_tr}>
                    <td className={tableStyles.table_td}>{"1"}</td>
                    <td className={tableStyles.table_td}>{'Hello'}</td>
                    <td className={tableStyles.table_td}>{'Hello'}</td>
                    <td className={tableStyles.table_td}>{'Hello'}</td>
                    <td className={tableStyles.table_td}>{"1"}</td>
                    <td className={tableStyles.table_td}>{'Hello'}</td>
                
                    <td
                      className={tableStyles.table_td + ` flex gap-2 max-w-xs`}
                    >
                        <Button
                          className="h-8 w-8"
                        //   type="link"
                        //   href={`/admin/hotels/${item.id}`}
                          buttonType="bordered"
                          prefix={<Eye size={18} variant="Bold" />}
                        />
                    
                        <Button
                          className="h-8 w-8"
                        //   type="link"
                        //   href={`/admin/hotels/mutate/${item.id}/`}
                          prefix={<Edit2 size={18} variant="Bold" />}
                        />
                     
                        <Button
                          className="h-8 w-8"
                          kind="danger"
                          type="button"
                        //   onClick={() => {
                        //     setOnDelete(item.id?.toString());
                        //     toggleDeleteModel(true);
                        //   }}
                          prefix={<Trash size={18} variant="Bold" />}
                        />
                     
                    </td>
                  </tr>
            </tbody>
          </TableCard>
        </>
    </>
  );
};

export default ReleasesTableLisitng;
