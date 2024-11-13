'use client';
import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import { Button, FormCard, FormGroup, TextField } from '@/core/ui/zenbuddha/src';
import genresApi from '@/modules/genres/genresApi';
import { genresSchema, GenresSchemaType, GenresType } from '@/modules/genres/genresType';
import { useFormik } from 'formik';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ZodError } from 'zod';

const Page = ({ params }: { params: { genresId: string } }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (params.genresId) {
      dispatch(
        genresApi.endpoints.getEachGenres.initiate(params.genresId)
      );
    }
  }, [params, dispatch]);

  const toMutatePropertyData = useGetApiResponse<GenresType>(
    `getEachGenres("${params.genresId ? params.genresId : undefined}")`
  );

  const onSubmit = async (values: GenresSchemaType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const data = params.genresId
        ? await dispatch(
            genresApi.endpoints.updateGenres.initiate({
              id: Number(params.genresId),
              ...values,
            })
          ).unwrap()
        : await dispatch(
            genresApi.endpoints.addGenres.initiate(values)
          ).unwrap();

      if (data) {
        router.push('/admin/genres/all');
      }
    } catch (error) {
      console.error('Failed to submit:', error);
    }

    setIsLoading(false);
  };

  const validateForm = (values: GenresSchemaType) => {
    try {
      genresSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const formik = useFormik<GenresSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutatePropertyData ? (toMutatePropertyData.id ?? null) : null,
      name: toMutatePropertyData ? toMutatePropertyData.name : '',
    },
    validateOnChange: true,
    validate: validateForm,
    onSubmit,
  });


  return (
    <FormCard onSubmit={formik.handleSubmit}  className="m-4">
      <FormGroup title="Basic Type">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
        <div className="flex flex-col flex-1">
            <TextField
              id="name"
              placeholder=""
              type="text"
              label="Name"
              className="flex-1"
              {...formik.getFieldProps('name')}
            />
            {!!formik.errors.name && (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
          </div>
        </div>
       
      </FormGroup>
      <div className="flex justify-end gap-2 m-4">
        <Button
          text="Submit"
          kind="default"
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
