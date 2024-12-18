/* eslint-disable no-unused-vars */
'use client';
import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import Selector from '@/core/ui/components/Selector';
import { Button, FormCard, FormGroup, ImageInput, TextField } from '@/core/ui/zenbuddha/src';
import digital_downloadApi from '@/modules/digital_download/digital_downloadApi';
import { digital_downloadSchema, Digital_DownloadSchemaType, Digital_DownloadType } from '@/modules/digital_download/digital_downloadType';
import releaseApi from '@/modules/releases/releasesApi';
import { ReleasesType } from '@/modules/releases/releasesType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ZodError } from 'zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const param = useParams();
  const digital_downloadId = param.digital_downloadId && param.digital_downloadId[0];
  const dispatch = useAppDispatch();
  // console.log(genresId)

  useEffect(() => {
    dispatch(releaseApi.endpoints.getAllReleases.initiate({ pageNumber: '1' }));
    if (digital_downloadId) {
      const fetchArtist = async () => {
        try {
          await dispatch(
            digital_downloadApi.endpoints.getEachDigital.initiate(digital_downloadId)
          );
        } catch (error) {
          console.error("Error fetching digital data:", error);
        }
      };

      fetchArtist();
    }
  }, [digital_downloadId, dispatch]);

  const toMutateDigitalData = useGetApiResponse<Digital_DownloadType>(
    `getEachDigital("${digital_downloadId ? digital_downloadId : undefined}")`
  );

  const allRelease = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllReleases`]
        ?.data as PaginatedResponseType<ReleasesType>
  );
  const allReleaseMod = allRelease?.results.map((item) => { return { label: item.title, value: item.id.toString() } })

  const onSubmit = async (values: Digital_DownloadSchemaType) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = digital_downloadId
        ? await dispatch(
          digital_downloadApi.endpoints.updatedigital.initiate({
            id: Number(digital_downloadId),
            ...values,
          })
        ).unwrap()
        : await dispatch(
          digital_downloadApi.endpoints.addigital.initiate(values)
        ).unwrap();

      if (data) router.push('/admin/digital_download/all');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const validateForm = (values: Digital_DownloadSchemaType) => {
    try {
      digital_downloadSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const formik = useFormik<Digital_DownloadSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutateDigitalData ? (toMutateDigitalData.id ?? null) : null,
      file: toMutateDigitalData ? null : null,
      max_downloads: toMutateDigitalData ? toMutateDigitalData.max_downloads : 0,
      release: toMutateDigitalData ? { value: toMutateDigitalData.release?.id.toString(), label: toMutateDigitalData.release?.title } : { value: '', label: '' },
    },
    validate: validateForm,
    onSubmit,
  });

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("file", file);
    }
  };

  const loadPaginatedRelease = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    dispatch(
      releaseApi.endpoints.getAllReleases.initiate(
        { pageNumber: (allRelease.pagination.current_page + 1).toString(), searchString: searchQuery as string }
      )
    );
    return {
      options: allReleaseMod,
      hasMore:
        allRelease?.pagination.next != null,
    };
  };



  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Basic Type">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            {allRelease && (
              <Selector
                id="release"
                options={allReleaseMod}
                loadPaginatedOptions={loadPaginatedRelease}
                type='AsyncPaginate'
                label="Release"
                value={formik.values.release}
                placeholder="Select release"
                className="flex-1"
                handleChange={(e) => {
                  formik.setFieldValue(
                    'release',
                    e
                  );
                }}
                name="release"
              ></Selector>
            )}
            {formik.errors.release && (
              <div className="text-red-500 text-sm">{formik.errors.release}</div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <TextField
              id="max_downloads"
              type="number"
              label="Max Download"
              className="flex-1"
              {...formik.getFieldProps('max_downloads')}
            />
            {formik.errors.max_downloads && (
              <div className="text-red-500 text-sm">{formik.errors.max_downloads}</div>
            )}
          </div>


        </div>
        <div className="flex flex-col flex-1">
          <ImageInput
            id="file"
            label="File"
            required
            className="flex-1 font-normal"
            value={formik.values.file}
            onChange={handleFileChange}
          />
          {formik.errors.file && (
            <div className="text-red-500 text-sm">{formik.errors?.file}</div>
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
          onClick={() => {
            router.back();
          }}
        />
      </div>
    </FormCard>
  );
};

export default Page;
