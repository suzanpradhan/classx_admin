'use client';
import { useGetApiResponse } from '@/core/api/getApiResponse';
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
import artistBookingApi from '@/modules/artists/artist_bookingApi';

import artistsApi from '@/modules/artists/artistsApi';
import {
  ArtistsType,
  artitstBookingSchema,
  ArtitstBookingSchemaType,
  ArtitstBookingType,
} from '@/modules/artists/artistsType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import { ZodError } from 'zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const param = useParams();
  const artist_bookingId = param.artist_bookingId && param.artist_bookingId[0];
  const dispatch = useAppDispatch();

  const EVENT_TYPES: Array<SelectorDataType> = [
    { value: 'coop', label: 'Cooperate' },
    { value: 'privp', label: 'Private Party' },
    { value: 'festiv', label: 'Fair & Festival' },
    { value: 'fund', label: 'Fundraiser' },
    { value: 'clz', label: 'College Organization' },
    { value: 'entre', label: 'Entrepreneur' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'other', label: ' Other' },
  ];
  useEffect(() => {
    dispatch(artistsApi.endpoints.getAllArtists.initiate({ pageNumber: '1' }));
    if (artist_bookingId) {
      dispatch(
        artistBookingApi.endpoints.getEachArtistBooking.initiate(
          artist_bookingId
        )
      );
    }
  }, [artist_bookingId, dispatch]);

  const toMutateArtistBookingata = useGetApiResponse<ArtitstBookingType>(
    `getEachArtistBooking("${artist_bookingId || undefined}")`
  );

  const allArtist = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllArtists`]
        ?.data as PaginatedResponseType<ArtistsType>
  );
  const allArtistMod = allArtist?.results.map((item) => {
    return { label: item.name, value: item.id.toString() };
  });

  const validateForm = (values: ArtitstBookingSchemaType) => {
    try {
      artitstBookingSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const onSubmit = async (values: ArtitstBookingSchemaType) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = artist_bookingId
        ? await dispatch(
            artistBookingApi.endpoints.updateArtistBooking.initiate({
              id: Number(artist_bookingId),
              ...values,
            })
          ).unwrap()
        : await dispatch(
            artistBookingApi.endpoints.addArtistBooking.initiate(values)
          ).unwrap();

      if (data) router.push('/admin/artist_booking/all');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dateTimeString = toMutateArtistBookingata?.event_date
    ? new Date(toMutateArtistBookingata.event_date)
    : undefined;

  const initialHours = dateTimeString
    ? dateTimeString.getUTCHours().toString().padStart(2, '0')
    : '';
  const initialMinutes = dateTimeString
    ? dateTimeString.getUTCMinutes().toString().padStart(2, '0')
    : '';
  const initialSeconds = dateTimeString
    ? dateTimeString.getUTCSeconds().toString().padStart(2, '0')
    : '';
  const timeString = `${initialHours}:${initialMinutes}:${initialSeconds}`;

  const formik = useFormik<ArtitstBookingSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutateArtistBookingata?.id ?? null,
      full_name: toMutateArtistBookingata
        ? toMutateArtistBookingata.full_name
        : '',
      artist: toMutateArtistBookingata?.artist
        ? {
            value: toMutateArtistBookingata?.artist?.id.toString(),
            label: toMutateArtistBookingata?.artist?.name,
          }
        : { value: '', label: '' },
      email: toMutateArtistBookingata
        ? (toMutateArtistBookingata.email as string)
        : '',
      event_type: toMutateArtistBookingata
        ? toMutateArtistBookingata.event_type
        : '',
      phone: toMutateArtistBookingata ? toMutateArtistBookingata?.phone : '',
      info: toMutateArtistBookingata ? toMutateArtistBookingata?.info : '',
      event_date: dateTimeString,
      event_time: timeString,
      document: toMutateArtistBookingata ? null : null,
      location: toMutateArtistBookingata
        ? toMutateArtistBookingata.location
        : '',
    },
    validate: validateForm,
    onSubmit,
  });

  const hanldeDocChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      formik.setFieldValue('document', e.target.files[0]);
    }
  };

  const loadPaginatedOptions = async (
    searchQuery: any,
    _loadedOptions: any,
    // eslint-disable-next-line no-unused-vars
    { page }: any
  ) => {
    dispatch(
      artistsApi.endpoints.getAllArtists.initiate({
        pageNumber: (allArtist.pagination.current_page + 1).toString(),
        searchString: searchQuery as string,
      })
    );

    return {
      options: allArtistMod,
      hasMore: allArtist?.pagination.next != null,
    };
  };

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Basic Type">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="full_name"
              type="text"
              label="Full Name"
              required
              className="flex-1"
              {...formik.getFieldProps('full_name')}
            />
            {formik.errors.full_name && (
              <div className="text-red-500 text-sm">
                {formik.errors.full_name}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <TextField
              id="email"
              type="text"
              label="Email"
              required
              className="flex-1"
              {...formik.getFieldProps('email')}
            />
            {formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="phone"
              type=""
              label="Phone"
              required
              className="flex-1"
              {...formik.getFieldProps('phone')}
            />
            {formik.errors.phone && (
              <div className="text-red-500 text-sm">{formik.errors.phone}</div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <TextField
              id="location"
              type="text"
              label="Location "
              required
              className="flex-1"
              {...formik.getFieldProps('location')}
            />
            {formik.errors.location && (
              <div className="text-red-500 text-sm">
                {formik.errors.location}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <Selector
              id="event_type"
              label="Event Type"
              required
              handleChange={(e) => {
                formik.setFieldValue(
                  'event_type',
                  (e as SingleValue<{ value: string; label: string }>)?.value
                );
              }}
              options={EVENT_TYPES}
              placeholder="Select type"
              value={{
                label:
                  EVENT_TYPES.find(
                    (item) => item.value === formik.values.event_type
                  )?.label ?? '',
                value: formik.values.event_type ?? '',
              }}
            ></Selector>
          </div>
          <div className="flex flex-col flex-1">
            {allArtist && (
              <Selector
                id="artist"
                options={allArtistMod}
                loadPaginatedOptions={loadPaginatedOptions}
                label="Artist"
                type="AsyncPaginate"
                value={formik.values.artist}
                placeholder="Select artist"
                className="flex-1"
                handleChange={(e) => {
                  formik.setFieldValue('artist', e);
                }}
                name="artist"
              ></Selector>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <DateSelector
              id="event_date"
              label="Date"
              onChange={(selectedDay) => {
                const date = selectedDay ? new Date(selectedDay) : null;
                formik.setFieldValue('event_date', date);
              }}
              value={
                formik.values.event_date
                  ? new Date(formik.values.event_date)
                  : undefined
              }
            />
          </div>
          <div className="flex flex-col flex-1">
            <TimeInput
              id="event_time"
              label="Time"
              className="flex-1 font-normal"
              value={formik.values.event_time ?? ''}
              handleChange={(event) => {
                formik.setFieldValue('event_time', event.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <ImageInput
              id="document"
              label="Document"
              className="flex-1 font-normal"
              value={formik.values.document}
              onChange={hanldeDocChange}
            />
            {formik.errors.document && (
              <div className="text-red-500 text-sm">
                {formik.errors.document}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <TextField
            id="info"
            type="text"
            label="Info "
            required
            isMulti
            className="flex-1"
            {...formik.getFieldProps('info')}
          />
          {formik.errors.info && (
            <div className="text-red-500 text-sm">{formik.errors.info}</div>
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
