'use client';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import Selector from '@/core/ui/components/Selector';
import { Button, FormCard, FormGroup } from '@/core/ui/zenbuddha/src';
import eventsApi from '@/modules/events/event/eventApi';
import { EventType } from '@/modules/events/event/eventType';
import performerApi from '@/modules/events/performer/performerApi';
import {
  EventPerfomerDataTypes,
  eventPerformerSchema,
  EventPerformerSchemaType,
  PerfomerDataTypes,
} from '@/modules/events/performer/performerType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ZodError } from 'zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const router = useRouter();
  const param = useParams();
  const performerSlug = param.performerSlug && param.performerSlug[0];
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(eventsApi.endpoints.getAllEvents.initiate({ pageNumber: '1' }));
    dispatch(performerApi.endpoints.getAllPerformer.initiate(pageIndex));
  }, [pageIndex, dispatch]);

  useEffect(() => {
    if (performerSlug) {
      const fetchcity = async () => {
        try {
          await dispatch(
            performerApi.endpoints.getEachPerformer.initiate(performerSlug)
          );
        } catch (error) {
          console.error('Error fetching venue data:', error);
        }
      };

      fetchcity();
    }
  }, [performerSlug, dispatch]);

  const toMutatePerformerData = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[
        `getEachPerformer("${performerSlug || undefined}")`
      ]?.data as PaginatedResponseType<EventPerfomerDataTypes>
  );

  const allEvents = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getAllEvents`]
        ?.data as PaginatedResponseType<EventType>
  );

  const allEventsMod = allEvents?.results.map((item) => {
    return { label: item.name, value: item.id.toString() };
  });

  const allPerformer = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getAllPerformer`]
        ?.data as PaginatedResponseType<PerfomerDataTypes>
  );

  const allPerformerMod = allPerformer?.results.map((item) => {
    return { label: item.name, value: item.uuid.toString(), extra: item.slug };
  });

  const onSubmit = async (values: EventPerformerSchemaType) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = performerSlug
        ? await dispatch(
            performerApi.endpoints.updatePerformer.initiate({
              id: Number(performerSlug),
              ...values,
            })
          ).unwrap()
        : await dispatch(
            performerApi.endpoints.addVenue.initiate(values)
          ).unwrap();

      if (data) router.push('/admin/events/performer/all');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (values: EventPerformerSchemaType) => {
    try {
      eventPerformerSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const formik = useFormik<EventPerformerSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutatePerformerData?.id ?? null,
      event: toMutatePerformerData?.event
        ? {
            label: toMutatePerformerData.event.name,
            value: toMutatePerformerData.event.id,
          }
        : { label: '', value: '' },

      performer: toMutatePerformerData?.performer
        ? {
            label: toMutatePerformerData.performer.name,
            value: toMutatePerformerData.performer.uuid,
          }
        : { label: '', value: '' },
    },
    validate: validateForm,
    onSubmit,
  });
  const loadPaginatedEvents = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    dispatch(
      eventsApi.endpoints.getAllEvents.initiate({
        pageNumber: (allEvents.pagination.current_page + 1).toString(),
        searchString: searchQuery as string,
      })
    );
    return {
      options: allEventsMod,
      hasMore: allEvents?.pagination.next != null,
    };
  };

  const loadPaginatedPerformer = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    dispatch(
      performerApi.endpoints.getAllPerformer.initiate(
        allPerformer.pagination.current_page + 1
      )
    );

    return {
      options: allPerformerMod,
      hasMore: allPerformer?.pagination.next != null,
    };
  };

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Basic Type">
        <div className="flex mb-2 flex-col flex-1">
          {allEvents && (
            <>
              <Selector
                id="event"
                options={allEventsMod}
                loadPaginatedOptions={loadPaginatedEvents}
                label="Events"
                type="AsyncPaginateCreatable"
                placeholder="Select event"
                className="flex-1"
                handleChange={(selectedOptions) =>
                  formik.setFieldValue('event', selectedOptions)
                }
                name="event"
                value={formik.values.event}
              />
            </>
          )}
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            {allPerformer && (
              <>
                <Selector
                  id="performer"
                  options={allPerformerMod}
                  loadPaginatedOptions={loadPaginatedPerformer}
                  label="Performer"
                  type="AsyncPaginateCreatable"
                  placeholder="Select performer"
                  className="flex-1"
                  handleChange={(selectedOptions) =>
                    formik.setFieldValue('performer', selectedOptions)
                  }
                  name="performer"
                  value={formik.values.performer}
                />
              </>
            )}
          </div>
        </div>
      </FormGroup>

      <div className="flex justify-end gap-2 m-4">
        <Button
          text="Submit"
          kind="warning"
          className="h-8 w-fit"
          type="submit"
          isLoading={isLoading}
        />
        <Button
          text="Cancel"
          kind="danger"
          className="h-8 w-fit"
          buttonType="flat"
          onClick={() => router.back()}
        />
      </div>
    </FormCard>
  );
};

export default Page;
