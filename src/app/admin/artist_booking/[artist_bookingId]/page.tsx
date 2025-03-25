'use client';

import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import AlertDialog from '@/core/ui/components/AlertDialog';
import { Button, PageBar, Spinner } from '@/core/ui/zenbuddha/src';
import artistsApi from '@/modules/artists/artistsApi';
import { PencilSimpleLine, TrashSimple, X } from 'phosphor-react';

import { ApplicantsType } from '@/modules/applicants/applicantsType';
import artistBookingApi from '@/modules/artists/artist_bookingApi';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ArtitsBookingTab from './(components)/ArtitsBookingTab';

export default function EachDetailPage() {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const param = useParams();
  const artist_bookingId = param.artist_bookingId && param.artist_bookingId[0];
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    if (artist_bookingId) {
      dispatch(
        artistBookingApi.endpoints.getEachArtistBooking.initiate(
          artist_bookingId as string
        )
      );
    }
  }, [dispatch, artist_bookingId]);

  const artitsBookingData = useGetApiResponse<ApplicantsType>(
    `getEachArtistBooking("${artist_bookingId || undefined}")`
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
            navigator.push('/admin/artists/booking_artist/all');
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="flex flex-col">
        {artitsBookingData ? (
          <>
            <PageBar
              leading={
                <div className="flex flex-col pt-4 pb-4">
                  <div className="text-sm font-medium text-primaryGray-500">
                    #{artitsBookingData.id} Artist Booking
                  </div>
                  <div className="text-base font-bold text-dark-500">
                    {artitsBookingData.full_name}
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
                    ARTIST BOOKING INFO
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
                    if (param.artist_bookingId) {
                      setOnDelete(param.artist_bookingId);
                      setIsOpen(true);
                    }
                  }}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<PencilSimpleLine size={20} weight="duotone" />}
                  type="link"
                  href={`/admin/artist_booking/mutate/${param.artist_bookingId}`}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  type="button"
                  onClick={() => {
                    navigator.push('/admin/artist_booking/all');
                  }}
                  suffix={<X size={20} weight="duotone" />}
                />
              </div>
            </PageBar>
            {tab == 0 ? (
              <ArtitsBookingTab artitsBooking={artitsBookingData} />
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
