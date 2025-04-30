'use client';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import {
  Button,
  FormCard,
  FormGroup,
  TextField,
} from '@/core/ui/zenbuddha/src';
import eventCategoryApi from '@/modules/events/event_category/event_categoryApi';
import {
  eventCategorySchema,
  EventCategorySchemaType,
  EventCategoryType,
} from '@/modules/events/event_category/event_categoryType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ZodError } from 'zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const param = useParams();
  const categoryId = param.categoryId && param.categoryId[0];
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (categoryId) {
      const fetchnews = async () => {
        try {
          await dispatch(
            eventCategoryApi.endpoints.getEachEventCategory.initiate(categoryId)
          );
        } catch (error) {
          console.error('Error fetching news data:', error);
        }
      };

      fetchnews();
    }
  }, [categoryId, dispatch]);

  const toMutateCategoryData = useAppSelector(
    (state: RootState) =>
      state.eventApi.queries[`getEachEventCategory("${categoryId}")`]
        ?.data as PaginatedResponseType<EventCategoryType>
  );
  const onSubmit = async (values: EventCategorySchemaType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const data = categoryId
        ? await dispatch(
            eventCategoryApi.endpoints.updateEventCategory.initiate({
              id: Number(categoryId),
              ...values,
            })
          ).unwrap()
        : await dispatch(
            eventCategoryApi.endpoints.addEventCategory.initiate(values)
          ).unwrap();

      if (data) {
        router.push('/admin/events/category/all');
      }
    } catch (error) {
      console.error('Failed to submit:', error);
    }

    setIsLoading(false);
  };

  const validateForm = (values: EventCategorySchemaType) => {
    try {
      eventCategorySchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const formik = useFormik<EventCategorySchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutateCategoryData.id,
      title: toMutateCategoryData ? toMutateCategoryData.title : '',
    },
    validateOnChange: true,
    validate: validateForm,
    onSubmit,
  });

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Basic Type">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="title"
              type="text"
              label="Title"
              className="flex-1"
              {...formik.getFieldProps('title')}
            />
            {!!formik.errors.title && (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
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
          onClick={() => {
            router.back();
          }}
        />
      </div>
    </FormCard>
  );
};

export default Page;
