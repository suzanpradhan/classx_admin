/* eslint-disable no-unused-vars */
'use client';
import { useGetApiResponse } from '@/core/api/getApiResponse';
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
import featuredReleaseApi from '@/modules/featured_releases/featured_releasesApi';
import {
  featuredReleasesSchema,
  FeaturedReleasesSchemaType,
  FeaturedReleasesType,
} from '@/modules/featured_releases/featured_releasesType';
import releaseApi from '@/modules/releases/releasesApi';
import { ReleasesType } from '@/modules/releases/releasesType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { ZodError } from 'zod';

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const param = useParams();
  const featured_releasesId =
    param.featured_releasesId && param.featured_releasesId[0];
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(releaseApi.endpoints.getAllReleases.initiate({ pageNumber: '1' }));
    if (featured_releasesId) {
      dispatch(
        featuredReleaseApi.endpoints.getEachFeaturedRelease.initiate(
          featured_releasesId
        )
      );
    }
  }, [featured_releasesId, dispatch]);

  const toMutatetrackData = useGetApiResponse<FeaturedReleasesType>(
    `getEachFeaturedRelease("${featured_releasesId ? featured_releasesId : undefined}")`
  );

  const allRelease = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllReleases`]
        ?.data as PaginatedResponseType<ReleasesType>
  );
  const allReleaseMod = allRelease?.results.map((item) => {
    return { label: item.title, value: item.id?.toString() };
  });

  const validateForm = (values: FeaturedReleasesSchemaType) => {
    try {
      featuredReleasesSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const onSubmit = async (values: FeaturedReleasesSchemaType) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = featured_releasesId
        ? await dispatch(
            featuredReleaseApi.endpoints.updateFeaturedRelease.initiate({
              ...values,
            })
          ).unwrap()
        : await dispatch(
            featuredReleaseApi.endpoints.addFeaturedRelease.initiate(values)
          ).unwrap();

      if (data) router.push('/admin/featured_releases/all');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const formik = useFormik<FeaturedReleasesSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutatetrackData ? (toMutatetrackData.id ?? null) : null,
      title: toMutatetrackData ? toMutatetrackData.title : '',
      subtitle: toMutatetrackData ? toMutatetrackData.subtitle : '',
      link: toMutatetrackData ? toMutatetrackData.link : '',
      video: toMutatetrackData ? null : null,
      release: toMutatetrackData?.release
        ? {
            label: toMutatetrackData.release.title,
            value: toMutatetrackData.release.id.toString(),
          }
        : { value: '', label: '' },
    },
    validate: validateForm,
    onSubmit,
  });

  const loadPaginatedRelease = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    dispatch(
      releaseApi.endpoints.getAllReleases.initiate({
        pageNumber: (allRelease.pagination.current_page + 1).toString(),
        searchString: searchQuery as string,
      })
    );
    return {
      options: allReleaseMod,
      hasMore: allRelease?.pagination.next != null,
    };
  };
  const hanldelVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      formik.setFieldValue('video', e.target.files[0]);
    }
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
            {!!formik.errors.title && (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            {allRelease && (
              <Selector
                id="release"
                options={allReleaseMod}
                loadPaginatedOptions={loadPaginatedRelease}
                type="AsyncPaginate"
                label="Release"
                value={formik.values.release}
                placeholder="Select release"
                className="flex-1"
                handleChange={(e) => {
                  formik.setFieldValue('release', e);
                }}
                name="release"
              ></Selector>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="subtitle"
              type="text"
              label="Subtitle"
              required
              className="flex-1"
              {...formik.getFieldProps('subtitle')}
            />
            {!!formik.errors.subtitle && (
              <div className="text-red-500 text-sm">
                {formik.errors.subtitle}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <TextField
              id="link"
              type="text"
              label="Link"
              className="flex-1"
              {...formik.getFieldProps('link')}
            />
            {!!formik.errors.link && (
              <div className="text-red-500 text-sm">{formik.errors.link}</div>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <ImageInput
              id="Video"
              label="Video"
              className="flex-1 font-normal"
              value={formik.values.video}
              onChange={hanldelVideoChange}
            />
            {!!formik.errors.video && (
              <div className="text-red-500 text-sm">{formik.errors.video}</div>
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
