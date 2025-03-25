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
  TextField,
} from '@/core/ui/zenbuddha/src';
import artistInfosApi from '@/modules/artists/artist_infosApi';
import artistsApi from '@/modules/artists/artistsApi';
import {
  artistInfosSchema,
  ArtistInfosSchemaType,
  ArtistInfosType,
  ArtistsType,
} from '@/modules/artists/artistsType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { ZodError } from 'zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const artist_infosId = params.artist_infosId && params.artist_infosId[0];
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(artistsApi.endpoints.getAllArtists.initiate({ pageNumber: '1' }));
    if (artist_infosId) {
      dispatch(
        artistInfosApi.endpoints.getEachArtistInfos.initiate(artist_infosId)
      );
    }
  }, [artist_infosId, dispatch]);

  const toMutateArtistsData = useGetApiResponse<ArtistInfosType>(
    `getEachArtistInfos("${artist_infosId ?? ''}")`
  );

  const allArtists = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllArtists`]
        ?.data as PaginatedResponseType<ArtistsType>
  );

  const allArtitstMod = allArtists?.results.map((item) => {
    return { label: item.name, value: item.slug.toString() };
  });

  const onSubmit = async (values: ArtistInfosSchemaType) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = artist_infosId
        ? await dispatch(
            artistInfosApi.endpoints.updateArtistInfos.initiate({
              ...values,
            })
          ).unwrap()
        : await dispatch(
            artistInfosApi.endpoints.addArtistInfos.initiate(values)
          ).unwrap();

      if (data) router.push('/admin/artists/artist_infos/all');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (values: ArtistInfosSchemaType) => {
    try {
      artistInfosSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const formik = useFormik<ArtistInfosSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutateArtistsData?.id ?? null,
      about: toMutateArtistsData?.about || '',
      feat_text: toMutateArtistsData?.feat_text || '',
      artist: toMutateArtistsData
        ? {
            value: toMutateArtistsData.artist.slug,
            label: toMutateArtistsData.artist.name,
          }
        : { value: '', label: '' },
      book_artist: toMutateArtistsData?.book_artist || '',
      text_one: toMutateArtistsData?.text_one || '',
      text_two: toMutateArtistsData?.text_two || '',
    },
    validateOnChange: true,
    validate: validateForm,
    onSubmit,
  });

  const handleRichTextChangeAbout = (value: string) => {
    formik.setFieldValue('about', value);
  };
  const handleRichTextChangeFeat = (value: string) => {
    formik.setFieldValue('feat_text', value);
  };
  const handleRichTextChangeBookArtists = (value: string) => {
    formik.setFieldValue('book_artist', value);
  };

  const loadPaginatedArtists = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    dispatch(
      artistsApi.endpoints.getAllArtists.initiate({
        pageNumber: (allArtists.pagination.current_page + 1).toString(),
        searchString: searchQuery as string,
      })
    );
    return {
      options: allArtitstMod,
      hasMore: allArtists?.pagination.next != null,
    };
  };

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Basic Info">
        <div className="flex flex-col flex-1 mb-2">
          {allArtists && (
            <Selector
              id="artist"
              options={allArtitstMod}
              loadPaginatedOptions={loadPaginatedArtists}
              type="AsyncPaginate"
              label="Artist"
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
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="text_one"
              type="text"
              label="Text One"
              className="flex-1"
              isMulti
              {...formik.getFieldProps('text_one')}
            />
            {formik.errors.text_one && (
              <div className="text-red-500 text-sm">
                {formik.errors.text_one}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <TextField
            id="text_two"
            type="text"
            label="Text Two"
            className="flex-1"
            isMulti
            {...formik.getFieldProps('text_two')}
          />
          {formik.errors.text_two && (
            <div className="text-red-500 text-sm">{formik.errors.text_two}</div>
          )}
        </div>
        <div className="mt-3 gap-2">
          <label
            htmlFor="about"
            className="block text-sm mb-2 font-medium text-gray-700"
          >
            About
          </label>
          <ReactQuill
            theme="snow"
            className="h-60"
            value={formik.values.about}
            onChange={handleRichTextChangeAbout}
          />
        </div>
        <div className="mt-3 gap-2">
          <label
            htmlFor="feat_text"
            className="block text-sm mb-2 font-medium text-gray-700"
          >
            Feat text
          </label>
          <ReactQuill
            theme="snow"
            className="h-60"
            value={formik.values.feat_text}
            onChange={handleRichTextChangeFeat}
          />
        </div>
        <div className="mt-3 gap-2">
          <label
            htmlFor="bio"
            className="block text-sm mb-2 font-medium text-gray-700"
          >
            Book artist
          </label>
          <ReactQuill
            theme="snow"
            className="h-60"
            value={formik.values.book_artist}
            onChange={handleRichTextChangeBookArtists}
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
