'use client';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import productsApi from '@/modules/products/productsApi';
import { ProductsType } from '@/modules/products/productType';
import Image from 'next/image';
import { Eye, PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const ProductsTableListing = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(
      productsApi.endpoints.getAllProducts.initiate({
        pageNumber: pageIndex,
        productType: 'merch',
      })
    );
  }, [dispatch, pageIndex]);

  const productsData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllProducts`]
        ?.data as PaginatedResponseType<ProductsType>
  );
  // console.log(productsData,'data')

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
                  productsApi.endpoints.deleteProducts.initiate(
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
            productsData && productsData?.results.length ? (
              <PaginationNav
                gotoPage={setPageIndex}
                canPreviousPage={pageIndex > 1}
                canNextPage={pageIndex < productsData.pagination.total_page}
                pageCount={productsData.pagination.total_page}
                pageIndex={productsData.pagination.current_page - 1}
              />
            ) : (
              <></>
            )
          }
        >
          <thead>
            <tr className={tableStyles.table_thead_tr}>
              <th className={tableStyles.table_th}>S.N.</th>
              <th className={tableStyles.table_th}>Thumbnail</th>
              <th className={tableStyles.table_th}>Title</th>
              <th className={tableStyles.table_th}>Price</th>
              <th className={tableStyles.table_th}>Stock</th>
              <th className={tableStyles.table_th}>Product Type</th>
              <th className={tableStyles.table_th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {productsData?.results.map((item, index) => (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{item.id}</td>
                <td className={tableStyles.table_td}>
                  <div className="relative w-20 h-20 overflow-hidden rounded-md">
                    {item.thumbnail && (
                      <Image
                        src={item.thumbnail}
                        alt={item.thumbnail ?? ''}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = '/images/errors/placeholder.webp';
                        }}
                        fill
                        placeholder="blur"
                        blurDataURL={item.thumbnail}
                        quality={75}
                        sizes="(max-width: 768px) 75vw, 33vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className={tableStyles.table_td}>{item.title}</td>
                <td className={tableStyles.table_td}>
                  <span
                    className={`text-xs px-2 py-1 rounded-sm capitalize bg-slate-300 text-black flex items-center gap-1 w-max`}
                  >
                    {item.price}
                  </span>
                </td>
                <td className={tableStyles.table_td}>
                  <span
                    className={`text-xs px-2 py-1 rounded-sm capitalize bg-green-4 00 text-black flex items-center gap-1 w-max`}
                  >
                    {item.stock}
                  </span>
                </td>
                <td className={tableStyles.table_td}>
                  <span
                    className={`text-white text-xs px-2 py-1 rounded-sm capitalize ${
                      item.product_type === 'merch'
                        ? 'bg-blue-500'
                        : item.product_type === 'digital'
                          ? 'bg-green-500'
                          : item.product_type === ''
                            ? 'bg-gray-600'
                            : 'bg-black'
                    }`}
                  >
                    {item.product_type}
                  </span>
                </td>

                <td className={tableStyles.table_td}>
                  <div className={`flex items-stretch h-full gap-2 max-w-xs`}>
                    <Button
                      className="h-8 w-8"
                      type="link"
                      href={`/admin/products/${item.slug}`}
                      buttonType="bordered"
                      prefix={<Eye size={18} weight="duotone" />}
                    />
                    <Button
                      className="h-8 w-8"
                      kind="warning"
                      type="link"
                      href={`/admin/products/mutate/${item.slug}`}
                      prefix={<PencilSimpleLine size={15} weight="duotone" />}
                    />
                    <Button
                      className="h-8 w-8"
                      kind="danger"
                      type="button"
                      onClick={() => {
                        setOnDelete(item.slug?.toString());
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

export default ProductsTableListing;
