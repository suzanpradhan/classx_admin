'use client';
import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { SelectorDataType } from '@/core/types/selectorType';
import Selector from '@/core/ui/components/Selector';
import { Button, FormCard, FormGroup, ImageInput, TextField } from '@/core/ui/zenbuddha/src';
import DateSelector from '@/core/ui/zenbuddha/src/components/DateSelector';
import RichTextField from '@/core/ui/zenbuddha/src/components/RichTextField';
import artistsApi from '@/modules/artists/artistsApi';
import { ArtistsType } from '@/modules/artists/artistsType';
import genresApi from '@/modules/genres/genresApi';
import { GenresType } from '@/modules/genres/genresType';
import releaseApi from '@/modules/releases/releasesApi';
import { ReleasesRequestType, releasesSchema, ReleasesSchemaType, ReleasesType } from '@/modules/releases/releasesType';
import { useFormik } from 'formik';

import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import { ZodError } from 'zod';

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const param = useParams();
  const releasesId = param.releasesId && param.releasesId[0];
  const dispatch = useAppDispatch();

  const Releases_TYPES: Array<SelectorDataType> = [
    { value: 'ALB', label: 'Album' },
    { value: 'EP', label: 'EP' },
    { value: 'SNG', label: 'Single' },
  ];
  
  useEffect(() => {
    dispatch(genresApi.endpoints.getAllGenres.initiate('1'));
    dispatch(artistsApi.endpoints.getAllArtists.initiate(1)); 
    if (releasesId) {
      dispatch(
        releaseApi.endpoints.getEachReleases.initiate(
          releasesId
        )
      );
    }
  }, [releasesId, dispatch]);

  const toMutateReleasesData = useGetApiResponse<ReleasesType>(
    `getEachReleases("${releasesId ? releasesId : undefined}")`
  );

  const genresData = useAppSelector(
    (state: RootState) => 
      state.baseApi.queries[`getAllGenres`]
        ?.data as PaginatedResponseType<GenresType>
  );

  const artistsData = useAppSelector(
    (state: RootState) => 
      state.baseApi.queries[`getAllArtists`]
        ?.data as PaginatedResponseType<ArtistsType>
  );
  
  const validateForm = (values: ReleasesSchemaType) => {
    try {
      releasesSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const onSubmit = async (values: ReleasesSchemaType) => {
    var finalRequestData: ReleasesRequestType = {
      ...values,
      genres: values.genres?.map((each) =>
        each.__isNew__
          ? { name: each.label! }
          : { id: parseInt(each.value), name: each.label }
      ),
    };
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      var data;
      if (param.releasesId && param.releasesId[0]) {
        data = await Promise.resolve(
          dispatch(
            releaseApi.endpoints.updateReleases.initiate({
              id: parseInt(param.releasesId[0]),
              ...finalRequestData,
            })
          )
        );
      } else {
        data = await Promise.resolve(
          dispatch(
            releaseApi.endpoints.addReleases.initiate(finalRequestData)
          )
        );
      }

    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const dateTiemString = toMutateReleasesData?.release_date
    ? new Date(toMutateReleasesData.release_date)
    : undefined;

  const formik = useFormik<ReleasesSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutateReleasesData
        ? (toMutateReleasesData.id ?? null)
        : null,
      title: toMutateReleasesData ? toMutateReleasesData.title : '',
      release_type: toMutateReleasesData ? toMutateReleasesData.release_type : '',
      artist: toMutateReleasesData ? toMutateReleasesData.artist.toString() ?? "0" : "0",
      release_date: dateTiemString,
        description: toMutateReleasesData ? toMutateReleasesData.description: '',
       cover: toMutateReleasesData ? null : null,
        genres:
        toMutateReleasesData?.genres?.map((genres) => ({
          value: genres.id!.toString(),
          label: genres.name,
        })) ?? [],
    
    },
    validate: validateForm,
    onSubmit,
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('cover', e.target.files?.[0]);
  };
  const handleRichTextChange = (value: string) => {
    formik.setFieldValue('description', value);
  };

  // console.log(formik.values.artist, "Artist name")
  

  return (
    <FormCard onSubmit={formik.handleSubmit}  className="m-4">
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
          <div className="flex flex-col flex-1">
            <ImageInput
              id="cover"
              label="Cover"
              required
              className="flex-1 font-normal"
              value={formik.values.cover}
              onChange={handleImageChange}
            />
             {!!formik.errors.title && (
              <div className="text-red-500 text-sm">{formik.errors.cover}</div>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
        <div className="flex flex-col flex-1">
            <DateSelector
              id="release_date"
              label="Release date"
              onChange={(selectedDay) =>
                formik.setFieldValue('release_date', selectedDay)
              }
              value={
                formik.values.release_date
                  ? new Date(formik.values.release_date)
                  : undefined
              }
            /> 
             {!!formik.errors.release_date && (
              <div className="text-red-500 text-sm">{formik.errors.release_date}</div>
            )}
          </div>
          <div className="flex flex-col flex-1">
             {genresData && (
              <Selector
                id="genres"
                options={genresData?.results.map(
                  (genres) =>
                    ({
                      value: genres.id!.toString(),
                      label: genres.name,
                    }) as SelectorDataType
                )}
                label="Genres"
                isMulti
                type="Creatable"
                placeholder="Select genres"
                className="flex-1"
                handleChange={(selectedOptions) => formik.setFieldValue('genres', selectedOptions)}
                name="genres"
                value={formik.values.genres}

                ></Selector>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
        <div className="flex flex-col flex-1">
             {artistsData && (
              <Selector
                id="artist"
                options={artistsData?.results.map(
                  (artist) =>
                    ({
                      value: artist.id!.toString(),
                      label: artist.name,
                    }) as SelectorDataType
                )}
                label="Artists"
                type="Creatable"
                placeholder="Select artist"
                className="flex-1"
                handleChange={(e) => {
                  formik.setFieldValue(
                    'artist',
                    (e as SingleValue<{ value: string; label: string }>)?.value
                  );
                }}
                name="artist"
                
                ></Selector>
            )}
          </div>
        <div className="flex flex-col flex-1">
            <Selector
             id="release_type"
             label="Releases Type"
             handleChange={(e) => {
               formik.setFieldValue(
                 'release_type',
                 (e as SingleValue<{ value: string; label: string }>)?.value
               );
             }}
             options={Releases_TYPES}
             placeholder="Select release_type"
             value={{
               label:
               Releases_TYPES.find(
                   (item) => item.value === formik.values.release_type
                 )?.label ?? '',
               value: formik.values.release_type ?? '',
             }}
             
            ></Selector>
          </div>
        </div>
        <RichTextField
          id="description"
          label="Description"
          value={formik.values.description}
          onChange={handleRichTextChange}
        />
       
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
