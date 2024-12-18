'use client';

import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import AlertDialog from '@/core/ui/components/AlertDialog';
import Button from '@/core/ui/zenbuddha/src/components/Button';
import PageBar from '@/core/ui/zenbuddha/src/components/PageBar';
import Spinner from '@/core/ui/zenbuddha/src/components/Spinner';
import releaseApi from '@/modules/releases/releasesApi';
import { ReleasesType } from '@/modules/releases/releasesType';
import { useParams, useRouter } from 'next/navigation';
import { PencilSimpleLine, TrashSimple, X } from 'phosphor-react';
import { useEffect, useState } from 'react';
import ReleasesInfosTab from './(components)/ReleasesDetailsTap';

export default function EachDetailPage() {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const param = useParams();
  const releasesId = param.releasesId;
  const [onDelete, setOnDelete] = useState<any>(undefined);


  useEffect(() => {
    if (releasesId) {
      dispatch(releaseApi.endpoints.getEachReleases.initiate(releasesId as string));
    }
  }, [releasesId, dispatch]);

  const releasesData = useGetApiResponse<ReleasesType>(
    `getEachReleases("${releasesId ? releasesId : undefined}")`
  );

  console.log(releasesData, "Data")

  return (
    <>
      <AlertDialog
        isOpen={modalIsOpen}
        deleteContent={`Package: ${onDelete}`}
        onClickNo={() => {
          setIsOpen(false);
        }}
        onClickYes={async () => {
          if (onDelete) {
            await Promise.resolve(
              dispatch(releaseApi.endpoints.deleteReleases.initiate(onDelete))
            );
            navigator.push('/admin/releases/all');
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="flex flex-col">
        {releasesData ? (
          <>
            <PageBar
              leading={
                <div className="flex flex-col pt-4 pb-4">
                  <div className="text-sm font-medium text-primaryGray-500">
                    #{releasesData.id} Releases
                  </div>
                  <div className="text-base font-bold text-dark-500">
                    {releasesData.title}
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
                    RELEASES TAB
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
                    if (param.releasesId) {
                      setOnDelete(param.releasesId);
                      setIsOpen(true);
                    }
                  }}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<PencilSimpleLine size={20} weight="duotone" />}
                  type="link"
                  href={`/admin/releases/mutate/${param.releasesId}`}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  type="button"
                  onClick={() => {
                    navigator.push('/admin/releases/all');
                  }}
                  suffix={<X size={20} weight="duotone" />}
                />
              </div>
            </PageBar>
            {tab == 0 ? <ReleasesInfosTab releases={releasesData} /> : <></>}
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
