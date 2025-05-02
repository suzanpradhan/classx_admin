'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import AlertDialog from '@/core/ui/components/AlertDialog';
import { Button, PageBar, Spinner } from '@/core/ui/zenbuddha/src';
import { PencilSimpleLine, TrashSimple, X } from 'phosphor-react';

import { RootState } from '@/core/redux/store';
import eventsApi from '@/modules/events/event/eventApi';
import { EventType } from '@/modules/events/event/eventType';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import EventDetailsTap from './(components)/EventDetails';

export default function EachDetailPage() {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const param = useParams();
  const eventId = param.eventId;
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    if (eventId) {
      dispatch(eventsApi.endpoints.getEachEvent.initiate(eventId.toString()));
    }
  }, [dispatch, eventId]);

  const eventData = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getEachEvent("${eventId || undefined}")`]
        ?.data as EventType
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
              dispatch(eventsApi.endpoints.deleteEvent.initiate(onDelete))
            );
            navigator.push('/admin/events/event/all');
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="flex flex-col">
        {eventData ? (
          <>
            <PageBar
              leading={
                <div className="flex flex-col pt-4 pb-4">
                  <div className="text-sm font-medium text-primaryGray-500">
                    #{eventData.id} Event
                  </div>
                  <div className="text-base font-bold text-dark-500">
                    {eventData.name}
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
                    EVENT TAP
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
                    if (param.eventId) {
                      setOnDelete(param.eventId);
                      setIsOpen(true);
                    }
                  }}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<PencilSimpleLine size={20} weight="duotone" />}
                  type="link"
                  href={`/admin/events/event/mutate/${param.eventId}`}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  type="button"
                  onClick={() => {
                    navigator.push('/admin/events/event/all');
                  }}
                  suffix={<X size={20} weight="duotone" />}
                />
              </div>
            </PageBar>
            {tab == 0 ? <EventDetailsTap event={eventData} /> : <></>}
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
