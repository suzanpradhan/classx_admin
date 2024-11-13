'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import artistsApi from '@/modules/artists/artistsApi';
import { ArtistsType } from '@/modules/artists/artistsType';
import { Eye } from 'iconsax-react';
import { PencilSimpleLine, TrashSimple } from 'phosphor-react';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const ArtistsTableLisiting = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(artistsApi.endpoints.getAllArtists.initiate(pageIndex));
  }, [dispatch, pageIndex]);

  const artistsData = useAppSelector(
    (state: RootState) => 
      state.baseApi.queries[`getAllArtists`]
        ?.data as PaginatedResponseType<ArtistsType>
  );
 

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
                <th className={tableStyles.table_th}>Profile</th>
                <th className={tableStyles.table_th}>Name</th>
                <th className={tableStyles.table_th}>Bio</th>
                <th className={tableStyles.table_th}>Action</th>
                
              </tr>
            </thead>
            <tbody>
            {artistsData?.results.map((item, index) => (
            <tr key={index} className={tableStyles.table_tbody_tr}>
              <td className={tableStyles.table_td}>{index + 1}</td>
              <td className={tableStyles.table_td}>
                  <div className="relative w-20 h-20 overflow-hidden rounded-md">
                    {item.profile_picture && (
                      <Image
                        src={item.profile_picture}
                        alt={item.name ?? ''}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = '/images/errors/placeholder.webp';
                        }}
                        fill
                        placeholder="blur"
                        blurDataURL={item.profile_picture}
                        quality={75}
                        sizes="(max-width: 768px) 75vw, 33vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className={tableStyles.table_td}>{item.name}</td>
                <td className={tableStyles.table_td}>{item.bio}</td>

              <td className={tableStyles.table_td + ` flex gap-2 max-w-xs`}>
              <Button
                  className="h-8 w-8"
                  // type="link"
                  // href={`/admin/bookings/${item.id}`}
                  buttonType="bordered"
                  prefix={<Eye size={18} variant="Bold" />}
                />
                <Button
                        className="h-8 w-8"
                        // type="link"
                        // href={`/admin/news/mutate/${item.id}`}
                        prefix={<PencilSimpleLine size={15} weight="duotone" />}
                      />
                <Button
                  className="h-8 w-8"
                  kind="danger"
                  type="button"
                  prefix={<TrashSimple size={18} weight="duotone" />}
                 
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

export default ArtistsTableLisiting;
