'use client';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import Selector from '@/core/ui/components/Selector';
import {
  Button,
  FormCard,
  FormGroup,
  ImageInput,
  TextField,
} from '@/core/ui/zenbuddha/src';
import cityApi from '@/modules/events/cityApi';
import venueApi from '@/modules/events/venue/venueApi';
import {
  CityType,
  VenueDataType,
  venueSchema,
  VenueSchemaType,
} from '@/modules/events/venue/venueType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { ZodError } from 'zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const param = useParams();
  const venueId = param.venueId && param.venueId[0];
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(cityApi.endpoints.getAllCity.initiate({ pageNumber: '1' }));
  }, [dispatch]);

  useEffect(() => {
    if (venueId) {
      dispatch(venueApi.endpoints.getEachVenue.initiate(venueId));
    }
  }, [venueId, dispatch]);

  const toMutateVenueData = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getEachVenue("${venueId || undefined}")`]
        ?.data as PaginatedResponseType<VenueDataType>
  );

  const allCity = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getAllCity`]
        ?.data as PaginatedResponseType<CityType>
  );
  const allCityMod = allCity?.results.map((item) => {
    return { label: item.name, value: item.id.toString() };
  });

  const onSubmit = async (values: VenueSchemaType) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = venueId
        ? await dispatch(
            venueApi.endpoints.updateVenue.initiate({
              id: Number(venueId),
              ...values,
            })
          ).unwrap()
        : await dispatch(venueApi.endpoints.addVenue.initiate(values)).unwrap();

      if (data) router.push('/admin/events/venue/all');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (values: VenueSchemaType) => {
    try {
      venueSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const formik = useFormik<VenueSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutateVenueData?.id ?? null,
      name: toMutateVenueData ? toMutateVenueData.name : '',
      city: toMutateVenueData?.city
        ? {
            label: toMutateVenueData?.city.name ?? '',
            value: toMutateVenueData?.city.id.toString() ?? '',
          }
        : {
            label: '',
            value: '',
          },
      description: toMutateVenueData ? toMutateVenueData.description : '',
      image: toMutateVenueData ? null : null,
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

  const loadPaginatedCity = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    dispatch(
      cityApi.endpoints.getAllCity.initiate({
        pageNumber: (allCity.pagination.current_page + 1).toString(),
        searchString: searchQuery as string,
      })
    );
    return {
      options: allCityMod,
      hasMore: allCity?.pagination.next != null,
    };
  };

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Basic Type">
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
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            {allCity && (
              <Selector
                id="city"
                options={allCityMod}
                loadPaginatedOptions={loadPaginatedCity}
                label="City"
                type="AsyncPaginateCreatable"
                placeholder="Select city"
                className="flex-1"
                handleChange={(selectedOptions) =>
                  formik.setFieldValue('city', selectedOptions)
                }
                name="city"
                value={formik.values.city}
              ></Selector>
            )}
          </div>

          <div className="flex flex-col flex-1">
            <ImageInput
              id="image"
              label="Cover Image"
              required
              className="flex-1 font-normal"
              value={formik.values.image}
              onChange={handleImageChange}
            />
            {formik.errors.image && (
              <div className="text-red-500 text-sm">{formik.errors.image}</div>
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
