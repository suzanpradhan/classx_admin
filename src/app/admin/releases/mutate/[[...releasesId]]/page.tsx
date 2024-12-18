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
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { SingleValue } from 'react-select';
import { ZodError } from 'zod';


const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const param = useParams();
  const releasesId = param.releasesId && param.releasesId[0];
  const productSlug = param.releasesId && param.releasesId[1];
  const dispatch = useAppDispatch();

  const Releases_TYPES: Array<SelectorDataType> = [
    { value: 'ALB', label: 'Album' },
    { value: 'EP', label: 'EP' },
    { value: 'SNG', label: 'Single' },
  ];

  useEffect(() => {
    dispatch(genresApi.endpoints.getAllGenres.initiate({ pageNumber: '1' }));
    dispatch(artistsApi.endpoints.getAllArtists.initiate({ pageNumber: '1' }));
    if (releasesId) {
      dispatch(
        releaseApi.endpoints.getEachReleases.initiate(
          releasesId
        )
      );
    }
  }, [releasesId, dispatch]);


  useEffect(() => {
    if (productSlug) {
      dispatch(productsApi.endpoints.getEachProducts.initiate(productSlug));
    }
  }, [productSlug, dispatch])

  const toMutateReleasesData = useGetApiResponse<ReleasesType>(
    `getEachReleases("${releasesId ? releasesId : undefined}")`
  );

  const allGenres = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllGenres`]
        ?.data as PaginatedResponseType<GenresType>
  );
  const allGenresMod = allGenres?.results.map((item) => { return { label: item.name, value: item.id.toString() } })


  const allArtists = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllArtists`]
        ?.data as PaginatedResponseType<ArtistsType>
  );

  const allArtitstMod = allArtists?.results.map((item) => { return { label: item.name, value: item.id.toString() } })

  const productData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getEachProducts("${productSlug}")`]
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
      let releaseData;

      if (param.releasesId && param.releasesId[0]) {
        releaseData = await Promise.resolve(
          dispatch(
            releaseApi.endpoints.updateReleases.initiate({
              id: parseInt(param.releasesId[0]),
              ...finalRequestData,
            })
          )
        );

        if (releaseData && releaseData.data) {
          const productData: ProductsSchemaType = {
            title: values.title!,
            thumbnail: values.cover!,
            price: values.price!,
            slug: values.slug!,
            description: values.description ?? '',
            product_type: "digital",
            stock: '',
            artist: values.artist.value,
            release: releasesId,
          };

          const productResponse = await Promise.resolve(
            dispatch(productsApi.endpoints.updateProducts.initiate({
              id: productSlug ? parseInt(productSlug) : undefined,
              ...productData,
            }))
          );

          if (productResponse) {
            console.log("Product updated successfully:", productResponse);
          }
        }
      } else {
        releaseData = await Promise.resolve(
          dispatch(releaseApi.endpoints.addReleases.initiate(finalRequestData))
        );

        if (releaseData && releaseData.data != undefined) {
          const productData: ProductsSchemaType = {
            title: values.title!,
            thumbnail: values.cover!,
            price: values.price!,
            slug: values.slug!,
            description: values.description ?? '',
            product_type: "digital",
            stock: '',
            artist: values.artist.value,
            release: releaseData.data.id,
          };

          const productResponse = await Promise.resolve(
            dispatch(productsApi.endpoints.addProducts.initiate(productData))
          );

          if (productResponse) {
            console.log("Product added successfully:", productResponse);
          }
        }
      }

      // if (releaseData) router.push('/admin/releases/all');

      if (releaseData) {
        window.location.href = '/admin/releases/all';
      }

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
      price: productData ? productData.price : '',
      slug: productData ? productData.slug : '',
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

  const loadPaginatedOptions = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    dispatch(
      genresApi.endpoints.getAllGenres.initiate(
        { pageNumber: (allGenres.pagination.current_page + 1).toString(), searchString: searchQuery as string }
      )
    );

    return {
      options: allGenresMod,
      hasMore:
        allGenres?.pagination.next != null,
    };
  };

  const loadPaginatedArtists = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    dispatch(
      artistsApi.endpoints.getAllArtists.initiate(
        { pageNumber: (allArtists.pagination.current_page + 1).toString(), searchString: searchQuery as string }
      )
    );
    return {
      options: allArtitstMod,
      hasMore:
        allArtists?.pagination.next != null,
    };
  };

  const handleCreateGenre = async (inputValue: string) => {
    dispatch(
      genresApi.endpoints.addGenres.initiate({
        name: inputValue
      })
    );

  }

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
                {allGenres && (
                  <Selector
                    id="genres"
                    options={allGenresMod}
                    loadPaginatedOptions={loadPaginatedOptions}
                    onCreateOption={handleCreateGenre}
                    label="Genres"
                    isMulti
                    type="AsyncPaginateCreatable"
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
                {allArtists && (
                  <Selector
                    id="artist"
                    options={allArtitstMod}
                    loadPaginatedOptions={loadPaginatedArtists}
                    type='AsyncPaginate'
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

              <div className="">
                <ImageInput
                  id="cover"
                  label="Cover"
                  required
                  className="flex-1 gap-2 font-normal"
                  value={formik.values.cover}
                  onChange={handleImageChange}
                />
                {!!formik.errors.cover && (
                  <div className="text-red-500 text-sm">{formik.errors.cover}</div>
                )}
                <div className="bg-blueWhite border mt-3 border-primaryGray-300 rounded-lg overflow-hidden max-w-xl relative aspect-video">
                  {formik.values.cover || formik.values.cover_url ? (
                    <Image
                      src={
                        formik.values.cover
                          ? URL.createObjectURL(formik.values.cover)
                          : formik.values.cover_url ?? "/default-placeholder.png"
                      }
                      alt="Cover Preview"
                      layout="fill"
                      objectFit="contain"
                      quality={85}
                      onError={(e) => {
                        e.currentTarget.src = "/default-placeholder.png";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      No Image Selected
                    </div>
                  )}
                </div>
              </div>



            </div>
          </FormGroup>
        </div>
      </div>

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
