'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import productsApi from '@/modules/products/productsApi';
import releaseApi from '@/modules/releases/releasesApi';
import { ReleasesType } from '@/modules/releases/releasesType';
import Image from 'next/image';
import { Eye, PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const ReleasesTableListing = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(releaseApi.endpoints.getAllReleases.initiate(pageIndex));
    // dispatch(productsApi.endpoints.getAllProducts.initiate(pageIndex));
  }, [dispatch, pageIndex]);
  const releaseData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllReleases`]?.data as PaginatedResponseType<ReleasesType>
  );
  // const productsData = useAppSelector(
  //   (state: RootState) =>
  //     state.baseApi.queries[`getAllProducts`]?.data as PaginatedResponseType<ProductsType>
  // );
  // console.log("productsData", productsData);
  // console.log(releaseData, "releasedata hooooo")

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
            try {
              await Promise.all([
                dispatch(productsApi.endpoints.deleteProducts.initiate(onDelete)),
                dispatch(releaseApi.endpoints.deleteReleases.initiate(onDelete)),
              ]);
            } catch (error) {
              console.error("Error deleting release or product:", error);
            }
          }
          toggleDeleteModel(false);
          setOnDelete(undefined);
        }}
      />


      <TableCard
        footer={
          releaseData && releaseData?.results.length > 0 ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 0}
              canNextPage={pageIndex < releaseData.pagination.total_page}
              pageCount={releaseData.pagination.total_page}
              pageIndex={releaseData.pagination.current_page - 1}
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>S.N.</th>
            <th className={tableStyles.table_th}>Cover</th>
            <th className={tableStyles.table_th}>Title</th>
            <th className={tableStyles.table_th}>Artists</th>
            <th className={tableStyles.table_th}>Genres</th>
            <th className={tableStyles.table_th}>Release Type</th>
            <th className={tableStyles.table_th}>Release Date</th>
            <th className={tableStyles.table_th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {releaseData?.results.map((item, index) => (
            <tr key={index} className={tableStyles.table_tbody_tr}>

              <td className={tableStyles.table_td}>{item.id}</td>
              <td className={tableStyles.table_td}> <div className="relative w-20 h-20 overflow-hidden rounded-md">
                {item.cover && (
                  <Image
                    src={item.cover}
                    alt={item.title ?? ''}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = '/images/errors/placeholder.webp';
                    }}
                    fill
                    placeholder="blur"
                    blurDataURL={item.cover}
                    quality={75}
                    sizes="(max-width: 768px) 75vw, 33vw"
                    className="object-cover"
                  />
                )}
              </div></td>
              <td className={tableStyles.table_td}>{item.title}</td>
              <td className={tableStyles.table_td}>{item.artist.name}</td>
              <td className={tableStyles.table_td}>{item.genres && item.genres.length > 0 ? item.genres.map((item, index) => <div key={index} className='inline-block px-1 text-xs bg-slate-300 text-dark-500 rounded-sm mr-1'>{item.name}</div>) : ""}</td>
              <td className={tableStyles.table_td}>
                <span
                  className={`text-white text-xs px-2 py-1 rounded-sm capitalize ${item.release_type === 'EP'
                    ? 'bg-blue-500'
                    : item.release_type === 'ALB'
                      ? 'bg-green-500'
                      : item.release_type === 'SNG'
                        ? 'bg-yellow-500'
                        : 'bg-black'
                    }`}
                >
                  {item.release_type}
                </span>
              </td>
              <td className={tableStyles.table_td}><span className={`text-xs px-2 py-1 rounded-sm capitalize bg-slate-200 text-black flex items-center gap-1 w-max`}>{item.release_date}</span></td>
              <td className={`${tableStyles.table_td} flex gap-2 max-w-xs`}>
                <Button
                  className="h-8 w-8"
                  type="link"
                  href={`/admin/releases/${item.id}`}
                  buttonType="bordered"
                  prefix={<Eye size={18} weight="duotone" />}
                />
                <Button
                  className="h-8 w-8"
                  type="link"
                  // href={`/admin/releases/mutate/${item.id}/${productsData?.results[index + 1]?.slug}`}
                  href={`/admin/releases/mutate/${item.id}/${item?.product_slug}`}
                  prefix={<PencilSimpleLine size={15} weight="duotone" />}
                />

                <Button
                  className="h-8 w-8"
                  kind="danger"
                  type="button"
                  onClick={() => {
                    setOnDelete(item.id.toString());
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
  );
};

export default ReleasesTableListing;