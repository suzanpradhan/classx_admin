'use client';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import artistsApi from '@/modules/artists/artistsApi';
import { ArtistsType } from '@/modules/artists/artistsType';
import parse from "html-react-parser";
import Image from 'next/image';
import { Eye, PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const ArtistsTableLisiting = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(artistsApi.endpoints.getAllArtists.initiate({ pageNumber: pageIndex.toString() }));
  }, [dispatch, pageIndex]);

  const artistsData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllArtists`]
        ?.data as PaginatedResponseType<ArtistsType>
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
                  artistsApi.endpoints.deleteArtists.initiate(onDelete as string)
                )
              );
            }
            toggleDeleteModel(false);
            setOnDelete(undefined);
          }}
        />
        <TableCard
          footer={
            artistsData && artistsData?.results.length > 0 ? (
              <PaginationNav
                gotoPage={setPageIndex}
                canPreviousPage={pageIndex > 0}
                canNextPage={pageIndex < artistsData.pagination.total_page}
                pageCount={artistsData.pagination.total_page}
                pageIndex={artistsData.pagination.current_page - 1}
              />
            ) : (
              <></>
            )
          }
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
                <td className={tableStyles.table_td}>{item.id}</td>
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
                <td className={tableStyles.table_td}>{parse(item.bio)}</td>

                <td className={tableStyles.table_td + ` flex gap-2 max-w-xs`}>
                  <Button
                    className="h-8 w-8"
                    type="link"
                    href={`/admin/artists/${item.id}`}
                    buttonType="bordered"
                    prefix={<Eye size={18} weight="duotone" />}

                  />
                  <Button
                    className="h-8 w-8"
                    kind='warning'
                    type="link"
                    href={`/admin/artists/mutate/${item.id}`}
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
