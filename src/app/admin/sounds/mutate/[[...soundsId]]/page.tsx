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
  TextField,
} from '@/core/ui/zenbuddha/src';
import artistsApi from '@/modules/artists/artistsApi';
import { ArtistsType } from '@/modules/artists/artistsType';
import genresApi from '@/modules/genres/genresApi';
import { GenresType } from '@/modules/genres/genresType';
import soundsApi from '@/modules/sounds/soundsApi';
import {
  SoundRequestType,
  soundSchema,
  SoundSchemaType,
  SoundsType,
} from '@/modules/sounds/soundsType';
import tracksWaveApi from '@/modules/tracks/tracksWaveApi';
import { TrackWaveType } from '@/modules/tracks/trackType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ZodError } from 'zod';

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const param = useParams();
  const soundsId = param.soundsId && param.soundsId[0];
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(genresApi.endpoints.getAllGenres.initiate({ pageNumber: '1' }));
    dispatch(artistsApi.endpoints.getAllArtists.initiate({ pageNumber: '1' }));
    if (soundsId) {
      dispatch(soundsApi.endpoints.getEachSounds.initiate(soundsId));
    }
  }, [soundsId, dispatch]);

  const toMutatesoundData = useGetApiResponse<SoundsType>(
    `getEachSounds("${soundsId ? soundsId : undefined}")`
  );

  useEffect(() => {
    if (toMutatesoundData) {
      dispatch(
        tracksWaveApi.endpoints.getEachTrackWave.initiate(
          toMutatesoundData.track_wave?.toString()
        )
      );
    }
  }, [soundsId, toMutatesoundData]);

  const toMutateWaveData = useGetApiResponse<TrackWaveType>(
    `getEachTrackWave-${toMutatesoundData?.track_wave}`
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

  const validateForm = (values: SoundSchemaType) => {
    try {
      soundSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const onSubmit = async (values: SoundSchemaType) => {
    var finalRequestData: SoundRequestType = {
      ...values,
      genres: values.genres?.map((each) =>
        each.__isNew__
          ? { name: each.label! }
          : { id: parseInt(each.value), name: each.label }
      ),
    };
    const wave_data = values.wave_data!;

    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      var data;
      if (soundsId) {
        data = await dispatch(
          tracksWaveApi.endpoints.updateTrackWave.initiate({
            id: toMutateWaveData.id!,
            payload: wave_data,
          })
        );
        if (data.data?.wave_data) {
          data = await dispatch(
            soundsApi.endpoints.updateSounds.initiate({
              id: parseInt(soundsId),
              ...finalRequestData,
            })
          ).unwrap();
        }
      } else {
        data = await dispatch(
          tracksWaveApi.endpoints.addTrackWave.initiate(wave_data)
        ).unwrap();
        if (data.wave_data) {
          data = await dispatch(
            soundsApi.endpoints.addSounds.initiate({
              ...finalRequestData,
              wave_data_id: data.id,
            })
          ).unwrap();
        }
      }
      if (data) router.push('/admin/sounds/all');
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

  const formik = useFormik<SoundSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutatesoundData ? (toMutatesoundData.id ?? null) : null,
      title: toMutatesoundData ? toMutatesoundData.title : '',
      duration: toMutatesoundData
        ? changeDurationToSchemaType(toMutatesoundData.duration)
        : changeDurationToSchemaType('00:00:00'),
      track_url: toMutatesoundData ? toMutatesoundData.track : undefined,
      artist: toMutatesoundData
        ? {
            value: toMutatesoundData.artist.id.toString(),
            label: toMutatesoundData.artist.name,
          }
        : { value: '', label: '' },

      genres:
        toMutatesoundData?.genres?.map((genres) => ({
          value: genres.id!.toString(),
          label: genres.name,
        })) ?? [],
      wave_data_from_source: toMutateWaveData?.wave_data,
    },
    validate: validateForm,
    onSubmit,
  });

  const handleAudioChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue('track', file);
      const audio = document.createElement('audio');
      audio.src = URL.createObjectURL(file);

      audio.addEventListener('loadedmetadata', () => {
        const { hour, minutes, seconds } = secondsToDurationSchemaType(
          audio.duration
        );

        console.log('duration value', hour, minutes, seconds);

        formik.setFieldValue('duration[hour]', hour);
        formik.setFieldValue('duration[minutes]', minutes);
        formik.setFieldValue('duration[seconds]', seconds);
      });

      // console.log('duration value', formik.values.duration);
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

  const handleCreateGenre = async (inputValue: string) => {
    dispatch(
      genresApi.endpoints.addGenres.initiate({
        name: inputValue,
      })
    );
  };

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Beats Info">
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
              id="track"
              label="Audio Track"
              trackUrl={formik.values.track_url ?? undefined}
              required
              className="flex-1 font-normal"
              value={formik.values.track}
              duration={formik.values.duration}
              waveDataFromSource={
                formik.values.wave_data_from_source ?? undefined
              }
              waveData={formik.values.wave_data ?? undefined}
              onFileChange={(e) => {
                const file = e?.target.files?.[0];
                if (file) {
                  formik.setFieldValue('track', file);
                } else {
                  formik.setFieldValue('track', undefined);
                }
              }}
              onDurationChange={(duration) => {
                const { hour, minutes, seconds } = duration;
                formik.setFieldValue('duration[hour]', hour);
                formik.setFieldValue('duration[minutes]', minutes);
                formik.setFieldValue('duration[seconds]', seconds);
              }}
              setUrlNull={() => formik.setFieldValue('track_url', undefined)}
              onWaveDataChange={(waveData) =>
                formik.setFieldValue('wave_data', waveData)
              }
            />
            {!!formik.errors.track && (
              <div className="text-red-500 text-sm">{formik.errors.track}</div>
            )}
          </div>
          {/* <div className="basis-24 grow-0 shrink-0">
            <DurationInput
              id="duration"
              name="duration"
              required
              disabled
              label="Duration"
              className="flex-1 font-normal"
              value={formik.values.duration ?? ''}
            />
            {!!formik.errors.duration && (
              <div className="text-red-500 text-sm">
                {formik.errors.duration.seconds}
              </div>
            )}
          </div> */}
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
