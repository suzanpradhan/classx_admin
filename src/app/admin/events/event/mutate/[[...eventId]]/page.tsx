'use client';
import { useGetApiEventResponse } from '@/core/api/getApiResponse';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { SelectorDataType } from '@/core/types/selectorType';
import Selector from '@/core/ui/components/Selector';
import {
  Button,
  FormCard,
  FormGroup,
  ImageInput,
  TextField,
} from '@/core/ui/zenbuddha/src';
import DateSelector from '@/core/ui/zenbuddha/src/components/DateSelector';
import TimeInput from '@/core/ui/zenbuddha/src/components/TimeInput';
import eventsApi from '@/modules/events/event/eventApi';
import {
  EventRequestType,
  eventSchema,
  EventSchemaType,
  EventTagsType,
  EventType,
} from '@/modules/events/event/eventType';
import eventCategoryApi from '@/modules/events/event_category/event_categoryApi';
import { EventCategoryType } from '@/modules/events/event_category/event_categoryType';
import venueApi from '@/modules/events/venue/venueApi';
import { VenueDataType } from '@/modules/events/venue/venueType';
import userApi from '@/modules/user/userApi';
import { UserResponse } from '@/modules/user/userType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { SingleValue } from 'react-select';
import { ZodError } from 'zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(1);
  const param = useParams();
  const eventId = param.eventId && param.eventId[0];
  const dispatch = useAppDispatch();

  const STATUS_TYPES: Array<SelectorDataType> = [
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'BOOKED', label: 'Booked' },
    { value: 'POSTPONED', label: 'Postponed' },
  ];

  useEffect(() => {
    dispatch(
      eventCategoryApi.endpoints.getAllEventCategory.initiate({
        pageNumber: '1',
      })
    );
    dispatch(venueApi.endpoints.getAllVenue.initiate({ pageNumber: '1' }));
    dispatch(
      eventsApi.endpoints.getAllEventsTags.initiate({ pageNumber: '1' })
    );
    dispatch(
      userApi.endpoints.getUser.initiate({
        pageNumber: '1',
      })
    );
  }, [pageIndex, dispatch]);

  useEffect(() => {
    if (eventId) {
      dispatch(eventsApi.endpoints.getEachEvent.initiate(eventId));
    }
  }, [eventId, dispatch]);

  const toMutateEventData = useGetApiEventResponse<EventType>(
    `getEachEvent("${eventId ?? ''}")`
  );

  const allCategory = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getAllEventCategory`]
        ?.data as PaginatedResponseType<EventCategoryType>
  );
  const allCatrgoryMod = allCategory?.results.map((item) => {
    return { label: item.title, value: item.id?.toString() ?? '' };
  });
  const allVenue = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getAllVenue`]
        ?.data as PaginatedResponseType<VenueDataType>
  );
  const allVenueMod = allVenue?.results.map((item) => {
    return { label: item.name, value: item.id?.toString() ?? '' };
  });
  const allUser = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getUser`]
        ?.data as PaginatedResponseType<UserResponse>
  );
  const allUserMod = allUser?.results.map((item) => {
    return { label: item.username, value: item.username?.toString() ?? '' };
  });

  const allTags = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getAllEventsTags`]
        ?.data as PaginatedResponseType<EventTagsType>
  );
  const allTagsMod = allTags?.results.map((item) => {
    return { label: item.title, value: item.id?.toString() ?? '' };
  });

  const onSubmit = async (values: EventSchemaType) => {
    var finalRequestData: EventRequestType = {
      ...values,
      tags: (Array.isArray(values.tags)
        ? values.tags
        : values.tags
          ? [values.tags]
          : []
      )?.map((each) =>
        each?.__isNew__
          ? { title: each?.label ?? '' }
          : { id: parseInt(each?.value ?? '0'), title: each?.label ?? '' }
      ),
    };

    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = eventId
        ? await dispatch(
            eventsApi.endpoints.updateEvents.initiate({
              id: Number(eventId),
              ...finalRequestData,
            })
          ).unwrap()
        : await dispatch(
            eventsApi.endpoints.addEvents.initiate(finalRequestData)
          ).unwrap();

      if (data) router.push('/admin/events/event/all');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (values: EventSchemaType) => {
    try {
      eventSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const dateTimeStringStart = toMutateEventData?.start_date
    ? new Date(toMutateEventData.start_date)
    : undefined;

  const initialDateStart = dateTimeStringStart
    ? dateTimeStringStart.toISOString().split('T')[0]
    : '';
  const initialTimeStart = dateTimeStringStart
    ? dateTimeStringStart.toISOString().split('T')[1].split('.')[0]
    : '';
  const dateTimeStringEnd = toMutateEventData?.end_date
    ? new Date(toMutateEventData.end_date)
    : undefined;

  const initialDateEnd = dateTimeStringEnd
    ? dateTimeStringEnd.toISOString().split('T')[0]
    : '';
  const initialTimeEnd = dateTimeStringEnd
    ? dateTimeStringEnd.toISOString().split('T')[1].split('.')[0]
    : '';

  const formik = useFormik<EventSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutateEventData?.id ?? null,
      name: toMutateEventData?.name ?? '',
      organizer: toMutateEventData?.organizer
        ? {
            label: toMutateEventData.organizer.username ?? '',
            value: toMutateEventData.organizer.username?.toString() ?? '',
          }
        : { label: '', value: '' },
      tags: toMutateEventData?.tags
        ? toMutateEventData.tags.map((item) => {
            return {
              label: item.title ?? '',
              value: item.title ?? '',
            };
          })
        : [],
      category: toMutateEventData?.category
        ? {
            label: toMutateEventData.category.title ?? '',
            value: String(toMutateEventData.category.id ?? ''),
          }
        : { label: '', value: '' },
      description: toMutateEventData?.description ?? '',
      status: toMutateEventData ? toMutateEventData.status : '',
      venue: toMutateEventData?.venue
        ? {
            label: toMutateEventData.venue.name ?? '',
            value: String(toMutateEventData.venue.id ?? ''),
          }
        : { label: '', value: '' },
      duration: '',
      image: toMutateEventData ? null : null,
      startDate: initialDateStart ? new Date(initialDateStart) : null,
      endDate: initialDateEnd ? new Date(initialDateEnd) : null,
      startTime: initialTimeStart,
      endTime: initialTimeEnd,
    },
    validate: validateForm,
    onSubmit,
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      formik.setFieldValue('image', e.target.files[0]);
    }
  };

  const handleRichTextChange = (value: string) => {
    formik.setFieldValue('description', value);
  };

  const loadPaginatedCategory = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    dispatch(
      eventCategoryApi.endpoints.getAllEventCategory.initiate({
        pageNumber: (allCategory.pagination.current_page + 1).toString(),
        searchString: searchQuery as string,
      })
    );
    return {
      options: allCatrgoryMod,
      hasMore: allCategory?.pagination.next != null,
    };
  };
  const loadPaginatedVenue = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    dispatch(
      venueApi.endpoints.getAllVenue.initiate({
        pageNumber: (allVenue.pagination.current_page + 1).toString(),
        searchString: searchQuery as string,
      })
    );
    return {
      options: allVenueMod,
      hasMore: allVenue?.pagination.next != null,
    };
  };

  const loadPaginatedUser = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    dispatch(
      userApi.endpoints.getUser.initiate({
        searchString: searchQuery as string,
        pageNumber: (allUser.pagination.current_page + 1).toString(),
      })
    );

    return {
      options: allUserMod,
      hasMore: allUser.pagination.total_page > allUser.pagination.current_page,
    };
  };
  const loadPaginatedTags = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    dispatch(
      eventsApi.endpoints.getAllEventsTags.initiate({
        pageNumber: (allTags.pagination.current_page + 1).toString(),
        searchString: searchQuery as string,
      })
    );
    return {
      options: allTagsMod,
      hasMore: allTags?.pagination.next != null,
    };
  };

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Basic Info">
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
            <ImageInput
              id="image"
              label="Image"
              required
              className="flex-1 font-normal"
              value={formik.values.image}
              onChange={handleImageChange}
            />
            {formik.errors.image && (
              <div className="text-red-500 text-sm">{formik.errors.image}</div>
            )}
          </div>
        </div>{' '}
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <Selector
              id="status"
              label="Status"
              handleChange={(e) => {
                formik.setFieldValue(
                  'status',
                  (e as SingleValue<{ value: string; label: string }>)?.value
                );
              }}
              options={STATUS_TYPES}
              placeholder="Select status"
              value={{
                label:
                  STATUS_TYPES.find(
                    (item) => item.value === formik.values.status
                  )?.label ?? '',
                value: formik.values.status ?? '',
              }}
            ></Selector>
          </div>
          <div className="flex flex-col flex-1">
            {allCategory && (
              <Selector
                id="category"
                options={allCatrgoryMod}
                loadPaginatedOptions={loadPaginatedCategory}
                label="Category"
                type="AsyncPaginateCreatable"
                placeholder="Select category"
                className="flex-1"
                handleChange={(selectedOptions) =>
                  formik.setFieldValue('category', selectedOptions)
                }
                name="category"
                value={formik.values.category}
              ></Selector>
            )}
          </div>
        </div>
        <div className="mt-3 gap-2">
          <label
            htmlFor="description"
            className="block text-sm mb-2 font-medium text-gray-700"
          >
            Description
          </label>
          <ReactQuill
            id="description"
            theme="snow"
            className="h-60"
            value={formik.values.description}
            onChange={handleRichTextChange}
          />
          {!!formik.errors.description && (
            <div className="text-red-500 text-sm">
              {formik.errors.description}
            </div>
          )}
        </div>
      </FormGroup>
      <FormGroup title="Event Duration">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <DateSelector
              id="startDate"
              label="Start Date"
              onChange={(selectedDay) => {
                const date = selectedDay ? new Date(selectedDay) : null;
                formik.setFieldValue('startDate', date);
              }}
              value={
                formik.values.startDate
                  ? new Date(formik.values.startDate)
                  : undefined
              }
            />
          </div>
          <div className="flex flex-col flex-1">
            <TimeInput
              id="startTime"
              label="Start Time"
              className="flex-1 font-normal"
              value={formik.values.startTime ?? ''}
              handleChange={(event) => {
                formik.setFieldValue('startTime', event.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <DateSelector
              id="endDate"
              label="End Date"
              onChange={(selectedDay) => {
                const date = selectedDay ? new Date(selectedDay) : null;
                formik.setFieldValue('endDate', date);
              }}
              value={
                formik.values.endDate
                  ? new Date(formik.values.endDate)
                  : undefined
              }
            />
          </div>
          <div className="flex flex-col flex-1">
            <TimeInput
              id="endTime"
              label="End Time"
              className="flex-1 font-normal"
              value={formik.values.endTime ?? ''}
              handleChange={(event) => {
                formik.setFieldValue('endTime', event.target.value);
              }}
            />
          </div>
        </div>
      </FormGroup>

      <FormGroup title="Other Info">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            {allVenue && (
              <Selector
                id="venue"
                options={allVenueMod}
                loadPaginatedOptions={loadPaginatedVenue}
                label="Venue"
                type="AsyncPaginate"
                placeholder="Select venue"
                className="flex-1"
                handleChange={(selectedOptions) =>
                  formik.setFieldValue('venue', selectedOptions)
                }
                name="venue"
                value={formik.values.venue}
              ></Selector>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            {allUser && (
              <Selector
                id="organizer"
                options={allUserMod}
                loadPaginatedOptions={loadPaginatedUser}
                label="Organizer"
                type="AsyncPaginate"
                placeholder="Select organizer"
                className="flex-1"
                handleChange={(selectedOptions) =>
                  formik.setFieldValue('organizer', selectedOptions)
                }
                name="organizer"
                value={formik.values.organizer}
              ></Selector>
            )}
          </div>
          <div className="flex flex-col flex-1">
            {allTags && (
              <Selector
                id="tags"
                options={allTagsMod}
                loadPaginatedOptions={loadPaginatedTags}
                label="Event Tags"
                type="AsyncPaginate"
                placeholder="Select tags"
                className="flex-1"
                handleChange={(selectedOptions) =>
                  formik.setFieldValue(
                    'tags',
                    Array.isArray(selectedOptions)
                      ? selectedOptions
                      : selectedOptions
                        ? [selectedOptions]
                        : []
                  )
                }
                name="tags"
                value={formik.values.tags}
              />
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
