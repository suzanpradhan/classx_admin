'use client';

import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import AlertDialog from '@/core/ui/components/AlertDialog';
import Button from '@/core/ui/zenbuddha/src/components/Button';
import PageBar from '@/core/ui/zenbuddha/src/components/PageBar';
import Spinner from '@/core/ui/zenbuddha/src/components/Spinner';
import artistInfosApi from '@/modules/artists/artist_infosApi';
import { ArtistInfosType } from '@/modules/artists/artistsType';
import { useParams, useRouter } from 'next/navigation';
import { PencilSimpleLine, TrashSimple, X } from 'phosphor-react';
import { useEffect, useState } from 'react';
import ArtistInfosTap from './(components)/ArtistInfosTap';

export default function EachDetailPage() {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const param = useParams();
  const artist_infosId = param.artist_infosId;
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    if (artist_infosId) {
      dispatch(
        artistInfosApi.endpoints.getEachArtistInfos.initiate(
          artist_infosId as string
        )
      );
    }
  }, [artist_infosId, dispatch]);

  const artistInfosData = useGetApiResponse<ArtistInfosType>(
    `getEachArtistInfos("${artist_infosId || undefined}")`
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
              dispatch(
                artistInfosApi.endpoints.deleteArtistInfos.initiate(onDelete)
              )
            );
            navigator.push('/admin/artists/artist_infos/all');
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="flex flex-col">
        {artistInfosData ? (
          <>
            <PageBar
              leading={
                <div className="flex flex-col pt-4 pb-4">
                  <div className="text-sm font-medium text-primaryGray-500">
                    #{artistInfosData.id} ArtistInfos
                  </div>
                  <div className="text-base font-bold text-dark-500">
                    {artistInfosData?.artist?.name}
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
                    ARTISTINFOS TAP
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
                    if (param.artist_infosId) {
                      setOnDelete(param.artist_infosId);
                      setIsOpen(true);
                    }
                  }}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<PencilSimpleLine size={20} weight="duotone" />}
                  type="link"
                  href={`/admin/artists/artist_infos/mutate/${param.artist_infosId}`}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  type="button"
                  onClick={() => {
                    navigator.push('/admin/artists/artist_infos/all');
                  }}
                  suffix={<X size={20} weight="duotone" />}
                />
              </div>
            </PageBar>
            {tab == 0 ? (
              <ArtistInfosTap artistInfos={artistInfosData} />
            ) : (
              <></>
            )}
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
