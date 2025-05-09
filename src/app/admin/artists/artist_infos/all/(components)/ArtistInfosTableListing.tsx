'use client';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import artistInfosApi from '@/modules/artists/artist_infosApi';
import { ArtistInfosType } from '@/modules/artists/artistsType';
import parse from 'html-react-parser';
import { Eye, PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const ArtistInfosTableListing = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(artistInfosApi.endpoints.getAllArtistInfos.initiate(pageIndex));
  }, [dispatch, pageIndex]);

  const artistsInfosData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllArtistInfos`]
        ?.data as PaginatedResponseType<ArtistInfosType>
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
                  artistInfosApi.endpoints.deleteArtistInfos.initiate(
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
            artistsInfosData && artistsInfosData?.results.length ? (
              <PaginationNav
                gotoPage={setPageIndex}
                canPreviousPage={pageIndex > 1}
                canNextPage={pageIndex < artistsInfosData.pagination.total_page}
                pageCount={artistsInfosData.pagination.total_page}
                pageIndex={artistsInfosData.pagination.current_page - 1}
              />
            ) : (
              <></>
            )
          }
        >
          <thead>
            <tr className={tableStyles.table_thead_tr}>
              <th className={tableStyles.table_th}>S.N.</th>
              <th className={tableStyles.table_th}>Artist</th>
              <th className={tableStyles.table_th}>Text one</th>
              <th className={tableStyles.table_th}>Text two</th>
              <th className={tableStyles.table_th}>Feat Text</th>
              <th className={tableStyles.table_th}>Book artist</th>
              <th className={tableStyles.table_th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {artistsInfosData?.results.map((item, index) => (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{item.id}</td>
                <td className={tableStyles.table_td}>{item?.artist?.name}</td>
                <td className={tableStyles.table_td}>
                  <span className="line-clamp-2">{item?.text_one}</span>
                </td>
                <td className={tableStyles.table_td}>
                  <span className="line-clamp-2">{item?.text_two}</span>
                </td>
                <td className={tableStyles.table_td}>
                  {' '}
                  <span className="line-clamp-2">
                    {parse(item.feat_text)}...
                  </span>
                </td>
                <td className={tableStyles.table_td}>
                  {' '}
                  <span className="line-clamp-2">
                    {parse(item?.book_artist as string)}...
                  </span>
                </td>

                <td className={tableStyles.table_td}>
                  <div className={`flex items-stretch h-full gap-2 max-w-xs`}>
                    <Button
                      className="h-8 w-8"
                      type="link"
                      href={`/admin/artists/artist_infos/${item.id}`}
                      buttonType="bordered"
                      prefix={<Eye size={18} weight="duotone" />}
                    />
                    <Button
                      className="h-8 w-8"
                      kind="warning"
                      type="link"
                      href={`/admin/artists/artist_infos/mutate/${item.id}`}
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
            ))}
          </tbody>
        </TableCard>
      </>
    </>
  );
};

export default ArtistInfosTableListing;
