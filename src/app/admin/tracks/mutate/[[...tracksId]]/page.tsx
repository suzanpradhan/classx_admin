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
  MusicUploader,
} from '@/core/ui/zenbuddha/src';
import DurationInput from '@/core/ui/zenbuddha/src/components/Duration';
import TextField from '@/core/ui/zenbuddha/src/components/TextField2';
import artistsApi from '@/modules/artists/artistsApi';
import { ArtistsType } from '@/modules/artists/artistsType';
import genresApi from '@/modules/genres/genresApi';
import { GenresType } from '@/modules/genres/genresType';
import releaseApi from '@/modules/releases/releasesApi';
import { ReleasesType } from '@/modules/releases/releasesType';
import tracksApi from '@/modules/tracks/tracksApi';
import {
  TrackRequestType,
  trackSchema,
  TrackSchemaType,
  Trackstype,
} from '@/modules/tracks/trackType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ZodError } from 'zod';

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const param = useParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newGenreName, setNewGenreName] = useState('');
  const tracksId = param.tracksId && param.tracksId[0];
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(genresApi.endpoints.getAllGenres.initiate({ pageNumber: '1' }));
    dispatch(artistsApi.endpoints.getAllArtists.initiate({ pageNumber: '1' }));
    dispatch(releaseApi.endpoints.getAllReleases.initiate({ pageNumber: '1' }));
    if (tracksId) {
      dispatch(tracksApi.endpoints.getEachTracks.initiate(tracksId));
    }
  }, [tracksId, dispatch]);

  const toMutatetrackData = useGetApiResponse<Trackstype>(
    `getEachTracks("${tracksId ? tracksId : undefined}")`
  );

  const allGenres = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllGenres`]
        ?.data as PaginatedResponseType<GenresType>
  );

  const allGenresMod = allGenres?.results.map((item) => {
    return { label: item.name, value: item.id.toString() };
  });

  const allArtists = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllArtists`]
        ?.data as PaginatedResponseType<ArtistsType>
  );

  const allArtitstMod = allArtists?.results.map((item) => {
    return { label: item.name, value: item.id.toString() };
  });

  const allRelease = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllReleases`]
        ?.data as PaginatedResponseType<ReleasesType>
  );
  const allReleaseMod = allRelease?.results.map((item) => {
    return { label: item.title, value: item.id.toString() };
  });

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
        data = await dispatch(
          tracksApi.endpoints.updateTracks.initiate({
            id: parseInt(param.tracksId[0]),
            ...finalRequestData,
          })
        ).unwrap();
      } else {
        data = await dispatch(
          tracksApi.endpoints.addTracks.initiate(finalRequestData)
        ).unwrap();
        // data = await Promise.resolve(
        //   dispatch(
        //     genresApi.endpoints.addGenres.initiate(values)
        //   )
        // )
      }
      if (data) router.push('/admin/tracks/all');
    } catch (error) {
      console.log('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeDurationToSchemaType = (duration: string) => {
    const durationArray = duration.split(':');
    switch (durationArray.length) {
      case 3: {
        const [hour, minutes, seconds] = durationArray;
        return {
          hour: parseInt(hour),
          minutes: parseInt(minutes),
          seconds: parseInt(seconds),
        };
      }
      case 2: {
        const [minutes, seconds] = durationArray;
        return {
          hour: 0,
          minutes: parseInt(minutes),
          seconds: parseInt(seconds),
        };
      }
      case 1: {
        const seconds = duration;
        return {
          hour: 0,
          minutes: 0,
          seconds: parseInt(seconds),
        };
      }
      default: {
        return {
          hour: 0,
          minutes: 0,
          seconds: 0,
        };
      }
    }
  };

  const secondsToDurationSchemaType = (seconds: number) => {
    const hour = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);
    return {
      hour: hour,
      minutes: minutes,
      seconds: sec,
    };
  };

  const formik = useFormik<TrackSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutatetrackData ? (toMutatetrackData.id ?? null) : null,
      title: toMutatetrackData ? toMutatetrackData.title : '',
      duration: toMutatetrackData
        ? changeDurationToSchemaType(toMutatetrackData.duration)
        : changeDurationToSchemaType('00:00:00'),
      slug: toMutatetrackData ? toMutatetrackData.slug : '',
      intro_track: toMutatetrackData ? null : null,
      youtube: toMutatetrackData?.youtube || '',
      spotify: toMutatetrackData?.spotify || '',
      artist: toMutatetrackData
        ? {
            value: toMutatetrackData.artist.id.toString(),
            label: toMutatetrackData.artist.name,
          }
        : { value: '', label: '' },
      release: toMutatetrackData
        ? {
            value: toMutatetrackData.release.id.toString(),
            label: toMutatetrackData.release.title,
          }
        : { value: '', label: '' },
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
      formik.setFieldValue('intro_track', file);
      const audio = document.createElement('audio');
      audio.src = URL.createObjectURL(file);

      audio.addEventListener('loadedmetadata', () => {
        const { hour, minutes, seconds } = secondsToDurationSchemaType(
          audio.duration
        );

        formik.setFieldValue('duration[hour]', hour);
        formik.setFieldValue('duration[minutes]', minutes);
        formik.setFieldValue('duration[seconds]', seconds);
      });
    }
  };

  const loadPaginatedGenres = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    dispatch(
      genresApi.endpoints.getAllGenres.initiate({
        pageNumber: (allGenres.pagination.current_page + 1).toString(),
        searchString: searchQuery as string,
      })
    );
    return {
      options: allGenresMod,
      hasMore: allGenres?.pagination.next != null,
    };
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

  const handleCreateGenre = async (inputValue: string) => {
    dispatch(
      genresApi.endpoints.addGenres.initiate({
        name: inputValue,
      })
    );
  };

  // console.log("allGenres", allGenres)

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Track Info">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          {/* <div className="flex flex-col flex-1">
            <DurationInput
              id="duration"
              name="duration"
              required
              label="Duration"
              className="flex-1 font-normal"
              value={formik.values.duration ?? ''}
              handleChange={(event) => {
                formik.setFieldValue('duration', event.target.value);
              }}
            />
          </div> */}
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

          <div className="flex flex-col flex-1 relative">
            {allGenres && (
              <>
                <Selector
                  id="genres"
                  options={allGenresMod}
                  loadPaginatedOptions={loadPaginatedGenres}
                  onCreateOption={handleCreateGenre}
                  label="Genres"
                  isMulti
                  type="AsyncPaginateCreatable"
                  placeholder="Select genres"
                  className="flex-1"
                  handleChange={(selectedOptions) =>
                    formik.setFieldValue('genres', selectedOptions)
                  }
                  name="genres"
                  value={formik.values.genres}
                />
              </>
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
              <div className="text-red-500 text-sm">
                {formik.errors.intro_track}
              </div>
            )}
          </div>
          <div className="basis-24 grow-0 shrink-0">
            <DurationInput
              id="duration"
              name="duration"
              required
              disabled
              label="Duration"
              className="flex-1 font-normal"
              value={formik.values.duration ?? ''}
              // handleHourChange={(event) => {
              // formik.setFieldValue('duration[hour]', event.target.value);
              // }}
              // handleMinChange={(event) => {
              // formik.setFieldValue('duration[minutes]', event.target.value);
              // }}
              // handleSecChange={(event) => {
              // formik.setFieldValue('duration[seconds]', event.target.value);
              // }}
            />
            {!!formik.errors.duration && (
              <div className="text-red-500 text-sm">
                {formik.errors.duration.seconds}
              </div>
            )}
          </div>
        </div>
      </FormGroup>
      <FormGroup title="Other Info">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            {allArtists && (
              <Selector
                id="artist"
                options={allArtitstMod}
                loadPaginatedOptions={loadPaginatedArtists}
                label="Artist"
                type="AsyncPaginate"
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
              id="youtube"
              type="text"
              label="Youtube "
              className="flex-1"
              {...formik.getFieldProps('youtube')}
            />
            {formik.errors.youtube && (
              <div className="text-red-500 text-sm">
                {formik.errors.youtube}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <TextField
              id="spotify"
              type="text"
              label="Spotify "
              className="flex-1"
              {...formik.getFieldProps('spotify')}
            />
            {formik.errors.spotify && (
              <div className="text-red-500 text-sm">
                {formik.errors.spotify}
              </div>
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
