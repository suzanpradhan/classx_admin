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
import artistsApi from '@/modules/artists/artistsApi';
import {
  artistsSchema,
  ArtistsSchemaType,
  ArtistsType,
} from '@/modules/artists/artistsType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { ZodError } from 'zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const slug = params.artistsSlug;
  const dispatch = useAppDispatch();

  const toMutateArtistsData = useGetApiResponse<ArtistsType>(
    `getEachArtists("${slug ?? ''}")`
  );

  useEffect(() => {
    if (slug) {
      const fetchArtist = async () => {
        try {
          await dispatch(
            artistsApi.endpoints.getEachArtists.initiate(slug.toString())
          );
        } catch (error) {
          console.error('Error fetching artist data:', error);
        }
      };

      fetchArtist();
    }
  }, [slug, dispatch]);

  const onSubmit = async (values: ArtistsSchemaType) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = slug
        ? await dispatch(
            artistsApi.endpoints.updateArtists.initiate({
              ...values,
            })
          ).unwrap()
        : await dispatch(
            artistsApi.endpoints.addArtists.initiate(values)
          ).unwrap();

      if (data) router.push('/admin/artists/all');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (values: ArtistsSchemaType) => {
    try {
      artistsSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const formik = useFormik<ArtistsSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutateArtistsData?.id ?? null,
      name: toMutateArtistsData?.name || '',
      bio: toMutateArtistsData?.bio || '',
      profile_picture: toMutateArtistsData ? null : null,
      slug: toMutateArtistsData ? toMutateArtistsData.slug : '',
    },
    validateOnChange: true,
    validate: validateForm,
    onSubmit,
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      formik.setFieldValue('profile_picture', e.target.files[0]);
    }
  };

  const handleRichTextChange = (value: string) => {
    formik.setFieldValue('bio', value);
  };

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Basic Type">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
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
              id="profile_picture"
              label="Profile Picture"
              required
              className="flex-1 font-normal"
              value={formik.values.profile_picture}
              onChange={handleImageChange}
            />
            {formik.errors.profile_picture && (
              <div className="text-red-500 text-sm">
                {formik.errors.profile_picture}
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 gap-2">
          <label
            htmlFor="bio"
            className="block text-sm mb-2 font-medium text-gray-700"
          >
            Bio
          </label>
          <ReactQuill
            theme="snow"
            className="h-60"
            value={formik.values.bio}
            onChange={handleRichTextChange}
          />
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
