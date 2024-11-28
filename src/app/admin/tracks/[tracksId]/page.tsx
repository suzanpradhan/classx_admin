'use client';

import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import AlertDialog from '@/core/ui/components/AlertDialog';
import { Button, PageBar, Spinner } from '@/core/ui/zenbuddha/src';
import { PencilSimpleLine, TrashSimple, X } from 'phosphor-react';

import tracksApi from '@/modules/tracks/tracksApi';
import { Trackstype } from '@/modules/tracks/trackType';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TrackDetailsTap from './(components)/TrackDetailsTap';

export default function EachDetailPage() {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const param = useParams();
  const tracksId = param.tracksId;
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    if (tracksId) {
      dispatch(tracksApi.endpoints.getEachTracks.initiate(tracksId as string));
    }
  }, [dispatch, tracksId]);

  const tracksData = useGetApiResponse<Trackstype>(
    `getEachTracks("${tracksId ? tracksId : undefined}")`
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
              dispatch(tracksApi.endpoints.deleteTracks.initiate(onDelete))
            );
            navigator.push('/admin/tracks/all');
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="flex flex-col">
        {tracksData ? (
          <>
            <PageBar
              leading={
                <div className="flex flex-col pt-4 pb-4">
                  <div className="text-sm font-medium text-primaryGray-500">
                    #{tracksData.id} Tracks
                  </div>
                  <div className="text-base font-bold text-dark-500">
                    {tracksData.title}
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
                    TRACKS TAB
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
                    if (param.tracksId) {
                      setOnDelete(param.tracksId);
                      setIsOpen(true);
                    }
                  }}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<PencilSimpleLine size={20} weight="duotone" />}
                  type="link"
                  href={`/admin/tracks/mutate/${param.tracksId}`}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  type="button"
                  onClick={() => {
                    navigator.push('/admin/tracks/all');
                  }}
                  suffix={<X size={20} weight="duotone" />}
                />
              </div>
            </PageBar>
            {tab == 0 ? <TrackDetailsTap tracks={tracksData} /> : <></>}
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
