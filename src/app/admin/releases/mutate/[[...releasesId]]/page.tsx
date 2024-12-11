/* eslint-disable no-unused-vars */
'use client';
import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { SelectorDataType } from '@/core/types/selectorType';
import Selector from '@/core/ui/components/Selector';
import { Button, FormCard, FormGroup, ImageInput, TextField } from '@/core/ui/zenbuddha/src';
import DateSelector from '@/core/ui/zenbuddha/src/components/DateSelector';
import artistsApi from '@/modules/artists/artistsApi';
import { ArtistsType } from '@/modules/artists/artistsType';
import genresApi from '@/modules/genres/genresApi';
import { GenresType } from '@/modules/genres/genresType';
import productsApi from '@/modules/products/productsApi';
import { ProductsSchemaType, ProductsType } from '@/modules/products/productType';
import releaseApi from '@/modules/releases/releasesApi';
import { ReleasesRequestType, releasesSchema, ReleasesSchemaType, ReleasesType } from '@/modules/releases/releasesType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { SingleValue } from 'react-select';
import { ZodError } from 'zod';


const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const param = useParams();
  const [uploadedImage, setUploadedImage] = useState("");
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
    dispatch(productsApi.endpoints.getAllProducts.initiate({}));
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

  const productData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllProducts`]
        ?.data as ProductsType
  )
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
      var releaseData;
      if (param.releasesId && param.releasesId[0]) {
        releaseData = await Promise.resolve(
          dispatch(
            releaseApi.endpoints.updateReleases.initiate({
              id: parseInt(param.releasesId[0]),
              ...finalRequestData,
            })
          )
        );
      } else {
        releaseData = await Promise.resolve(
          dispatch(releaseApi.endpoints.addReleases.initiate(finalRequestData))
        );
        // console.log(releaseData.data, "After submitting form")
        if (releaseData && releaseData.data != undefined) {
          const productData: ProductsSchemaType = {
            title: values.title!,
            thumbnail: values.cover!,
            price: values.price!,
            description: values.description ?? '',
            product_type: "digital",
            stock: '',
            artist: values.artist,
            release: releaseData.data.id
          };
          console.log("productData", productData)
          const productResponse = await Promise.resolve(
            dispatch(productsApi.endpoints.addProducts.initiate(productData))
          );

          if (productResponse) {
            console.log("Product added successfully:", productResponse);
          }
        }
      }

      router.push('/admin/releases/all');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
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
      artist: toMutateReleasesData ? { value: toMutateReleasesData.artist.id.toString(), label: toMutateReleasesData.artist.name } : { value: '', label: '' },
      release_date: dateTiemString,
      price: toMutateReleasesData ? toMutateReleasesData.price : '',
      description: toMutateReleasesData ? toMutateReleasesData.description : '',
      cover_url: toMutateReleasesData?.cover,
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
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue('cover', file);
    }
  };
  const handleRichTextChange = (value: string) => {
    formik.setFieldValue('description', value);
  };



  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4 !max-w-full">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1">
          <FormGroup title="">
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
                    label="Artist"
                    value={formik.values.artist}
                    placeholder="Select artist"
                    className="flex-1"
                    handleChange={(e) => {
                      formik.setFieldValue(
                        'artist',
                        e
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
            <div className="mt-3 gap-2">
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
                Description
              </label>
              <ReactQuill theme="snow" className="h-60 bg-whiteShade" value={formik.values.description ?? ''} onChange={handleRichTextChange} />
            </div>
          </FormGroup>
        </div>

        <div className="max-w-md w-full">
          <FormGroup title="">
            <div className="flex flex-col gap-2">
              <TextField
                id="price"
                type="text"
                label="Price"
                className="flex-1"
                {...formik.getFieldProps('price')}
              />
              {formik.errors.price && (
                <div className="text-red-500 text-sm">{formik.errors.price}</div>
              )}

              <div className=''>
                <ImageInput
                  id="cover"
                  label="Cover"
                  required
                  className="flex-1  gap-3 py-3 font-normal"
                  value={formik.values.cover}
                  onChange={handleImageChange}
                />
                {!!formik.errors.cover && (
                  <div className="text-red-500 text-sm">{formik.errors.cover}</div>
                )}
                <div
                  className={`flex-1 h-64 border rounded-md bg-slate-50 text-sm focus:outline-none w-full ${formik.values.cover_url ? "border-gray-300" : "border-gray-300"
                    }`}
                  style={{
                    backgroundImage: formik.values.cover ? `url(${URL.createObjectURL(formik.values.cover)})` : `url(${formik.values.cover_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",

                  }}
                >
                </div>
              </div>

            </div>
          </FormGroup>
        </div>
      </div>

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
