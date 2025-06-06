'use client';
import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import {
  Button,
  FormCard,
  FormGroup,
  ImageInput,
  TextField,
} from '@/core/ui/zenbuddha/src';
import DateSelector from '@/core/ui/zenbuddha/src/components/DateSelector';
import TimeInput from '@/core/ui/zenbuddha/src/components/TimeInput';
import newsApi from '@/modules/news/newsApi';
import { newsSchema, NewsSchemaType, NewsType } from '@/modules/news/newsType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { ZodError } from 'zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const param = useParams();
  const newsId = param.newsId && param.newsId[0];
  const dispatch = useAppDispatch();

  const toMutateNewsData = useGetApiResponse<NewsType>(
    `getEachNews("${newsId ?? ''}")`
  );

  useEffect(() => {
    if (newsId) {
      const fetchnews = async () => {
        try {
          await dispatch(newsApi.endpoints.getEachNews.initiate(newsId));
        } catch (error) {
          console.error('Error fetching news data:', error);
        }
      };

      fetchnews();
    }
  }, [newsId, dispatch]);

  const onSubmit = async (values: NewsSchemaType) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = newsId
        ? await dispatch(
            newsApi.endpoints.updateNews.initiate({
              id: Number(newsId),
              ...values,
            })
          ).unwrap()
        : await dispatch(newsApi.endpoints.addNews.initiate(values)).unwrap();

      if (data) router.push('/admin/news/all');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (values: NewsSchemaType) => {
    try {
      newsSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };
  const dateTimeString = toMutateNewsData?.date
    ? new Date(toMutateNewsData.date)
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

  const formik = useFormik<NewsSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutateNewsData?.id ?? null,
      title: toMutateNewsData ? toMutateNewsData.title : '',
      description: toMutateNewsData ? toMutateNewsData.description : '',
      cover_image: toMutateNewsData ? null : null,
      content: toMutateNewsData ? (toMutateNewsData.content ?? '') : '',
      date: dateTimeString,
      time: timeString,
    },
    validate: validateForm,
    onSubmit,
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      formik.setFieldValue('cover_image', e.target.files[0]);
    }
  };

  const handleRichTextChange = (value: string) => {
    formik.setFieldValue('content', value);
  };

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Basic Type">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="title"
              type="text"
              label="Title"
              required
              className="flex-1"
              {...formik.getFieldProps('title')}
            />
            {formik.errors.title && (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            )}
          </div>

          <div className="flex flex-col flex-1">
            <ImageInput
              id="cover_image"
              label="Cover Image"
              required
              className="flex-1 font-normal"
              value={formik.values.cover_image}
              onChange={handleImageChange}
            />
            {formik.errors.cover_image && (
              <div className="text-red-500 text-sm">
                {formik.errors.cover_image}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <DateSelector
              label="Date"
              id="date"
              onChange={(selectedDay) => {
                const date = selectedDay ? new Date(selectedDay) : null;
                formik.setFieldValue('date', date);
              }}
              value={
                formik.values.date ? new Date(formik.values.date) : undefined
              }
            />
          </div>
          <div className="flex flex-col flex-1">
            <TimeInput
              id="time"
              label="Time"
              className="flex-1 font-normal"
              value={formik.values.time ?? ''}
              handleChange={(event) => {
                formik.setFieldValue('time', event.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col mb-2">
          <TextField
            id="description"
            type="text"
            required
            label="Description"
            className="flex-1 mb-2"
            isMulti
            {...formik.getFieldProps('description')}
          />
          {!!formik.errors.description && (
            <div className="text-red-500 text-sm">
              {formik.errors.description}
            </div>
          )}
        </div>
        <div className="mt-3 gap-2">
          <label
            htmlFor="content"
            className="block text-sm mb-2 font-medium text-gray-700"
          >
            Content
          </label>
          <ReactQuill
            id="content"
            theme="snow"
            className="h-60"
            value={formik.values.content}
            onChange={handleRichTextChange}
          />
          {!!formik.errors.content && (
            <div className="text-red-500 text-sm">{formik.errors.content}</div>
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
