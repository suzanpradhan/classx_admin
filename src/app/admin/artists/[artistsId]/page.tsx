'use client';

import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import AlertDialog from '@/core/ui/components/AlertDialog';
import { Button, PageBar, Spinner } from '@/core/ui/zenbuddha/src';
import artistsApi from '@/modules/artists/artistsApi';
import { ArtistsType } from '@/modules/artists/artistsType';
import { PencilSimpleLine, TrashSimple, X } from 'phosphor-react';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ArtistsInfosTab from './(components)/AtristsDetailsTab';

export default function EachDetailPage() {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const param = useParams();
  const artistsId = param.artistsId;
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    if (artistsId) {
      dispatch(
        artistsApi.endpoints.getEachArtists.initiate(artistsId as string)
      );
    }
  }, [dispatch, artistsId]);

  const ArtistsData = useGetApiResponse<ArtistsType>(
    `getEachArtists("${artistsId ? artistsId : undefined}")`
  );

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
              dispatch(artistsApi.endpoints.deleteArtists.initiate(onDelete))
            );
            navigator.push('/admin/artists/all');
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="flex flex-col">
        {ArtistsData ? (
          <>
            <PageBar
              leading={
                <div className="flex flex-col pt-4 pb-4">
                  <div className="text-sm font-medium text-primaryGray-500">
                    #{ArtistsData.id} Artists
                  </div>
                  <div className="text-base font-bold text-dark-500">
                    {ArtistsData.name}
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
                    ARTISTS TAB
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
                    if (param.artistsId) {
                      setOnDelete(param.artistsId);
                      setIsOpen(true);
                    }
                  }}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<PencilSimpleLine size={20} weight="duotone" />}
                  type="link"
                  href={`/admin/artists/mutate/${param.artistsId}`}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  type="button"
                  onClick={() => {
                    navigator.push('/admin/artists/all');
                  }}
                  suffix={<X size={20} weight="duotone" />}
                />
              </div>
            </PageBar>
            {tab == 0 ? <ArtistsInfosTab artists={ArtistsData} /> : <></>}
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
