'use client';
import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { SelectorDataType } from '@/core/types/selectorType';
import Selector from '@/core/ui/components/Selector';
import { Button, FormCard, FormGroup, MusicUploader, TextField } from '@/core/ui/zenbuddha/src';
import artistsApi from '@/modules/artists/artistsApi';
import { ArtistsType } from '@/modules/artists/artistsType';
import genresApi from '@/modules/genres/genresApi';
import { GenresType } from '@/modules/genres/genresType';
import releaseApi from '@/modules/releases/releasesApi';
import { ReleasesType } from '@/modules/releases/releasesType';
import tracksApi from '@/modules/tracks/tracksApi';
import { TrackRequestType, trackSchema, TrackSchemaType, Trackstype } from '@/modules/tracks/trackType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import { ZodError } from 'zod';

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const param = useParams();
  const tracksId = param.tracksId && param.tracksId[0];
  const dispatch = useAppDispatch();

 
  useEffect(() => {
    dispatch(genresApi.endpoints.getAllGenres.initiate('1'));
    dispatch(artistsApi.endpoints.getAllArtists.initiate(1)); 
    dispatch(releaseApi.endpoints.getAllReleases.initiate(1)); 
    if (tracksId) {
      dispatch(
        tracksApi.endpoints.getEachTracks.initiate(
          tracksId
        )
      );
    }
  }, [tracksId, dispatch]);

  const toMutatetrackData = useGetApiResponse<Trackstype>(
    `getEachTracks("${tracksId ? tracksId : undefined}")`
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
  
  const releasesData = useAppSelector(
    (state: RootState) => 
      state.baseApi.queries[`getAllReleases`]
        ?.data as PaginatedResponseType<ReleasesType>
  );
  
   
  const validateForm = (values: TrackSchemaType) => {
    try {
      trackSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const onSubmit = async (values: TrackSchemaType) => {
    var finalRequestData: TrackRequestType = {
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
      if (param.tracksId && param.tracksId[0]) {
        data = await Promise.resolve(
          dispatch(
            tracksApi.endpoints.updateTracks.initiate({
              id: parseInt(param.tracksId[0]),
              ...finalRequestData,
            })
          )
        );
      } else {
        // eslint-disable-next-line no-unused-vars
        data = await Promise.resolve(
          dispatch(
            tracksApi.endpoints.addTracks.initiate(finalRequestData)
          )
        );
      }

    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  
  const formik = useFormik<TrackSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutatetrackData
        ? (toMutatetrackData.id ?? null)
        : null,
      title: toMutatetrackData ? toMutatetrackData.title : '',
      duration: toMutatetrackData ? toMutatetrackData.duration: '',
      slug: toMutatetrackData ? toMutatetrackData.slug: '',
      release: toMutatetrackData ? toMutatetrackData.release.toString() ?? "0" : "0",
      intro_track: toMutatetrackData ? null : null,
      artist: toMutatetrackData ? toMutatetrackData.artist.toString() ?? "0" : "0",
        genres:
        toMutatetrackData?.genres?.map((genres) => ({
          value: genres.id!.toString(),
          label: genres.name,
        })) ?? [],
    
    },
    validate: validateForm,
    onSubmit,
  });  

  const handleAudioChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("intro_track", file); 
    }
  };
  

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
          <TextField
              id="slug"
              type="text"
              label="Slug"
              className="flex-1"
              {...formik.getFieldProps('slug')}
            />
             {!!formik.errors.title && (
              <div className="text-red-500 text-sm">{formik.errors.slug}</div>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
        <div className="flex flex-col flex-1">
        <TextField
              id="duration"
              type="text"
              label="Duration"
              className="flex-1"
              {...formik.getFieldProps('duration')}
            />
             {!!formik.errors.title && (
              <div className="text-red-500 text-sm">{formik.errors.duration}</div>
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
                // type="Creatable"
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
        {releasesData && (
              <Selector
                id="release"
                options={releasesData?.results.map(
                  (release) =>
                    ({
                      value: release.id!.toString(),
                      label: release.title,
                    }) as SelectorDataType
                )}
                label="Release"
                placeholder="Select release"
                className="flex-1"
                handleChange={(e) => {
                  formik.setFieldValue(
                    'release',
                    (e as SingleValue<{ value: string; label: string }>)?.value
                  );
                }}
                name="release"

                
                ></Selector>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
   
          <div className="flex flex-col flex-1">
            <MusicUploader
              id="intro_track"
              label="Audio Track"
              required
              className="flex-1 font-normal"
              value={formik.values.intro_track} 
              onChange={handleAudioChange} 
            />
             {!!formik.errors.intro_track && (
              <div className="text-red-500 text-sm">{formik.errors.intro_track}</div>
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
