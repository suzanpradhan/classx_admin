'use client';

import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import { Button, PageBar, Spinner } from '@/core/ui/zenbuddha/src';
import { PencilSimpleLine, TrashSimple, X } from 'phosphor-react';

import productsApi from '@/modules/products/productsApi';
import { ProductsType } from '@/modules/products/productType';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductsDeatils from './(components)/ProductsDeatils';

export default function EachDetailPage() {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);
  const params = useParams();
  const slug = params.productsSlug;

  useEffect(() => {
    if (slug) {
      dispatch(productsApi.endpoints.getEachProducts.initiate(slug.toString()));
    }
  }, [dispatch, slug]);

  const productsData = useGetApiResponse<ProductsType>(
    `getEachProducts("${slug ? slug : undefined}")`
  );

  return (
    <>
      {/* <AlertDialog
        isOpen={modalIsOpen}
        deleteContent={`Package: ${onDelete}`}
        onClickNo={() => {
          setIsOpen(false);
        }}
        onClickYes={async () => {
          if (onDelete) {
            await Promise.resolve(
              dispatch(productsApi.endpoints..initiate(onDelete))
            );
            navigator.push('/admin/products/all');
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      /> */}
      <div className="flex flex-col">
        {productsData ? (
          <>
            <PageBar
              leading={
                <div className="flex flex-col pt-4 pb-4">
                  <div className="text-sm font-medium text-primaryGray-500">
                    #{productsData.id} Products
                  </div>
                  <div className="text-base font-bold text-dark-500">
                    {productsData.title}
                  </div>
                 
                </div>
              }
              bottom={
                <div className="flex gap-4 text-base font-normal text-primaryGray-500 pb-2">

                  <button
                    className={
                      tab == 1
                        ? 'text-dark-500 font-semibold relative text-sm'
                        : 'text-dark-500 font-normal text-sm'
                    }
                    onClick={() => {
                      setTab(0);
                    }}
                  >
                    PRODUCTS TAP
                    {tab == 1 ? (
                      <div className="absolute top-[calc(100%+6px)] h-[2px] w-full bg-dark-500 rounded-md"></div>
                    ) : (
                      <></>
                    )}
                  </button>
                </div>
              }
            >
              <div className="flex gap-2">
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<TrashSimple size={20} weight="duotone" />}
                  onClick={() => {
                    if (slug) {
                      setOnDelete(slug);
                      setIsOpen(true);
                    }
                  }}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<PencilSimpleLine size={20} weight="duotone" />}
                  type="link"
                  href={`/admin/products/mutate/${slug}`}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  type="button"
                  onClick={() => {
                    navigator.push('/admin/products/all');
                  }}
                  suffix={<X size={20} weight="duotone" />}
                />
              </div>
            </PageBar>
            {tab == 0 ? <ProductsDeatils products={productsData} /> : <></>}
          </>
        ) : (
          <div className="flex justify-center items-center min-h-[calc(100vh-3.25rem)]">
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
}
