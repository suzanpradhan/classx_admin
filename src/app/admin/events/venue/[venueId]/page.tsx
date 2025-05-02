'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import AlertDialog from '@/core/ui/components/AlertDialog';
import { Button, PageBar, Spinner } from '@/core/ui/zenbuddha/src';
import { PencilSimpleLine, TrashSimple, X } from 'phosphor-react';

import { RootState } from '@/core/redux/store';
import venueApi from '@/modules/events/venue/venueApi';
import { VenueDataType } from '@/modules/events/venue/venueType';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import VanueDetailsTap from './(components)/VenueDetailsTap';

export default function EachDetailPage() {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const param = useParams();
  const venueId = param.venueId;
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    if (venueId) {
      dispatch(venueApi.endpoints.getEachVenue.initiate(venueId.toString()));
    }
  }, [dispatch, venueId]);

  const venueData = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getEachVenue("${venueId || undefined}")`]
        ?.data as VenueDataType
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
              dispatch(venueApi.endpoints.deleteVenue.initiate(onDelete))
            );
            navigator.push('/admin/events/venue/all');
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="flex flex-col">
        {venueData ? (
          <>
            <PageBar
              leading={
                <div className="flex flex-col pt-4 pb-4">
                  <div className="text-sm font-medium text-primaryGray-500">
                    #{venueData.id} Venue
                  </div>
                  <div className="text-base font-bold text-dark-500">
                    {venueData.name}
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
                    VENUE TAP
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
                    if (param.venueId) {
                      setOnDelete(param.venueId);
                      setIsOpen(true);
                    }
                  }}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<PencilSimpleLine size={20} weight="duotone" />}
                  type="link"
                  href={`/admin/events/venue/mutate/${venueId}`}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  type="button"
                  onClick={() => {
                    navigator.push('/admin/events/venue/all');
                  }}
                  suffix={<X size={20} weight="duotone" />}
                />
              </div>
            </PageBar>
            {tab == 0 ? <VanueDetailsTap venue={venueData} /> : <></>}
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
