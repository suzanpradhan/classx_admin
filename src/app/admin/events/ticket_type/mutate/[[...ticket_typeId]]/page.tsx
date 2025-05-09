'use client';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import Selector from '@/core/ui/components/Selector';
import { Button, FormCard, FormGroup } from '@/core/ui/zenbuddha/src';
import TextField from '@/core/ui/zenbuddha/src/components/TextField2';
import eventsApi from '@/modules/events/event/eventApi';
import { EventType } from '@/modules/events/event/eventType';
import ticketTypeAPi from '@/modules/events/ticket_type/ticket_typeApi';
import {
  TicketTypeDataType,
  ticketTypeSchema,
  TicketTypeSchemaType,
} from '@/modules/events/ticket_type/ticket_typeType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ZodError } from 'zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const router = useRouter();
  const param = useParams();
  const ticket_typeId = param.ticket_typeId && param.ticket_typeId[0];
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(eventsApi.endpoints.getAllEvents.initiate({ pageNumber: '1' }));
  }, [dispatch]);

  useEffect(() => {
    if (ticket_typeId) {
      const fetchcity = async () => {
        try {
          await dispatch(
            ticketTypeAPi.endpoints.getEachTicketType.initiate(ticket_typeId)
          );
        } catch (error) {
          console.error('Error fetching venue data:', error);
        }
      };

      fetchcity();
    }
  }, [ticket_typeId, dispatch]);

  const toMutateTicketData = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[
        `getEachTicketType("${ticket_typeId || undefined}")`
      ]?.data as PaginatedResponseType<TicketTypeDataType>
  );

  const allEvents = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getAllEvents`]
        ?.data as PaginatedResponseType<EventType>
  );

  const allEventsMod = allEvents?.results.map((item) => {
    return { label: item.name, value: item.id.toString() };
  });

  const onSubmit = async (values: TicketTypeSchemaType) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = ticket_typeId
        ? await dispatch(
            ticketTypeAPi.endpoints.updateTicketType.initiate({
              id: Number(ticket_typeId),
              ...values,
            })
          ).unwrap()
        : await dispatch(
            ticketTypeAPi.endpoints.addTicketType.initiate(values)
          ).unwrap();

      if (data) router.push('/admin/events/ticket_type/all');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (values: TicketTypeSchemaType) => {
    try {
      ticketTypeSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const formik = useFormik<TicketTypeSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutateTicketData?.id ?? null,
      name: toMutateTicketData?.name ?? '',
      price: toMutateTicketData?.price ?? '',
      stock: {
        quantity: toMutateTicketData?.stock?.quantity ?? '',
      },

      max_quantity_per_order: toMutateTicketData?.max_quantity_per_order ?? 0,
      event: toMutateTicketData?.event
        ? {
            label: toMutateTicketData.event.name,
            value: toMutateTicketData.event.id.toString(),
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

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Basic Type">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex mb-2 flex-col flex-1">
            <TextField
              id="name"
              type="text"
              label="Name"
              required
              className="flex-1"
              {...formik.getFieldProps('name')}
            />
            {formik.errors.name && (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <TextField
              id="price"
              type="text"
              label="Price"
              required
              className="flex-1"
              {...formik.getFieldProps('price')}
            />
            {formik.errors.price && (
              <div className="text-red-500 text-sm">{formik.errors.price}</div>
            )}
          </div>
        </div>{' '}
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex mb-2 flex-col flex-1">
            <TextField
              id="stocks"
              type="number"
              label="Stocks"
              className="flex-1"
              {...formik.getFieldProps('stock.quantity')}
            />
            {formik.errors.stock && (
              <div className="text-red-500 text-sm">
                {formik.errors.stock.quantity}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <TextField
              id="max_quantity_per_order"
              type="number"
              label="Max quantity per order"
              className="flex-1"
              {...formik.getFieldProps('max_quantity_per_order')}
            />
            {formik.errors.max_quantity_per_order && (
              <div className="text-red-500 text-sm">
                {formik.errors.max_quantity_per_order}
              </div>
            )}
          </div>
        </div>{' '}
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
                required
                name="event"
                value={formik.values.event}
              />
            </>
          )}
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
