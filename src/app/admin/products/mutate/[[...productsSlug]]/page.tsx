'use client';
import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import { SelectorDataType } from '@/core/types/selectorType';
import Selector from '@/core/ui/components/Selector';
import { Button, FormCard, FormGroup, ImageInput, TextField } from '@/core/ui/zenbuddha/src';
import RichTextField from '@/core/ui/zenbuddha/src/components/RichTextField';
import artistsApi from '@/modules/artists/artistsApi';
import { ArtistsType } from '@/modules/artists/artistsType';
import productsApi from '@/modules/products/productsApi';
import { productsSchema, ProductsSchemaType, ProductsType } from '@/modules/products/productType';
import releaseApi from '@/modules/releases/releasesApi';
import { ReleasesType } from '@/modules/releases/releasesType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { MultiValue, SingleValue } from 'react-select';
import { ZodError } from 'zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const slug = params.productsSlug;
  const dispatch = useAppDispatch();

  const Product_type: Array<SelectorDataType> = [
    { value: 'merch', label: 'Merchandise' },
    { value: 'digital', label: 'Digital Audio' },
  ];
  
  useEffect(() => {
    dispatch(releaseApi.endpoints.getAllReleases.initiate(1));
    dispatch(artistsApi.endpoints.getAllArtists.initiate(1)); 
    dispatch(releaseApi.endpoints.getAllReleases.initiate(1)); 
    if (slug) {
      dispatch(productsApi.endpoints.getEachProducts.initiate(slug.toString()));
    }
  }, [slug, dispatch ]);

  const toMutateProductsData = useGetApiResponse<ProductsType>(
    `getEachProducts("${slug ? slug : undefined}")`
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


  const onSubmit = async (values: ProductsSchemaType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      var data = slug
        ? await Promise.resolve(
            dispatch(
              productsApi.endpoints.updateProducts.initiate({
                ...values,
                // artist: {}
              })
            )
          )
        : await Promise.resolve(
            dispatch(productsApi.endpoints.addProducts.initiate(values))
          );
      if (data) router.push('/admin/products/all');
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = (values: ProductsSchemaType) => {
    try {
      productsSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };
  const formik = useFormik<ProductsSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutateProductsData?.id ?? null,
      title: toMutateProductsData ? toMutateProductsData.title : '',
      product_type: toMutateProductsData ? toMutateProductsData.product_type: '',
      description: toMutateProductsData ? toMutateProductsData.description: '',
      slug: toMutateProductsData ? toMutateProductsData.slug: '',
      release: toMutateProductsData ? toMutateProductsData.release.toString() ?? "0" : "0",
      thumbnail: toMutateProductsData ? null : null,
      artist: {
        label: toMutateProductsData
          ? toMutateProductsData.artist.name
          : '',
        value: toMutateProductsData?.artist.id
          ? (toMutateProductsData.artist.id?.toString() )
          : "0",
      },
      price: toMutateProductsData ? toMutateProductsData.price : '',

      stock: toMutateProductsData? toMutateProductsData.stock.toString() : '', 
    },
    validate: validateForm,
    onSubmit,
  });

  const selectedArtist = useAppSelector(
    (state: RootState) => 
      state.baseApi.queries[`getEachArtists("${formik.values.artist.value}")`]
        ?.data as ArtistsType
  );

  // useEffect(() => {
  //   if(selectedArtist?.id) {
  //     formik.setFieldValue('artists.label', selectedArtist.id);
  //     formik.setFieldValue('artists.value', selectedArtist.name);
  //   }
  //   console.log("selectedArtist", selectedArtist);
  // },[selectedArtist?.id])

  useEffect(() => {
    if (formik.values.artist.value != '0') {
      dispatch(artistsApi.endpoints.getEachArtists.initiate(formik.values.artist.value.toString()));
    }
  }, [dispatch, formik.values.artist.value ]);
  // console.log("selectedArtist", selectedArtist, formik.values.artist.value);


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      formik.setFieldValue('thumbnail', e.target.files[0]);
    }
  };

  const handleRichTextChange = (value: string) => {
    formik.setFieldValue('description', value);
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
            {formik.errors.title && (
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
            {formik.errors.slug && (
              <div className="text-red-500 text-sm">{formik.errors.slug}</div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-2 max-sm:flex-col">
        <div className="flex flex-col flex-1">
            <ImageInput
              id="thumbnail"
              label="Thumbnail"
              required
              className="flex-1 font-normal"
              value={formik.values.thumbnail}
              onChange={handleImageChange}
            />
            {formik.errors.thumbnail && (
              <div className="text-red-500 text-sm">{formik.errors.thumbnail}</div>
            )}
          </div>
          <div className="flex flex-col flex-1">
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
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="stock"
              type="text"
              label="Stocks"
              className="flex-1"
              {...formik.getFieldProps('stock')}
            />
            {formik.errors.stock && (
              <div className="text-red-500 text-sm">{formik.errors.stock}</div>
            )}
          </div>
          <div className="flex flex-col flex-1">
          {artistsData && (
             <Selector
             id="artist"
             options={artistsData.results.map((artist) => ({
               value: artist.id.toString(),
               label: artist.name,
             }))}
             label="Artists"
             placeholder="Select artist"
             className="flex-1"
             handleChange={(
              selectedArtist: SingleValue<{ value: string; label: string; extra?: string; __isNew__?: boolean }> 
                 | MultiValue<{ value: string; label: string; extra?: string; __isNew__?: boolean }>
             ) => {
               formik.setFieldValue("artist.id", selectedArtist)
             }}
             name="artist"
             isMulti={false}
           />
           
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
        <div className="flex flex-col flex-1">
            <Selector
             id="product_type"
             label="Products Type"
             handleChange={(e) => {
               formik.setFieldValue(
                 'product_type',
                 (e as SingleValue<{ value: string; label: string }>)?.value
               );
             }}
             options={Product_type}
             placeholder="Select source"
             value={{
               label:
               Product_type.find(
                   (item) => item.value === formik.values.product_type
                 )?.label ?? '',
               value: formik.values.product_type ?? '',
             }}
             
            ></Selector>
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
                />
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <RichTextField
            id="description"
            label="Discription"
            value={formik.values.description}
            onChange={handleRichTextChange}
          />
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
          onClick={() => router.back()}
        />
      </div>
    </FormCard>
  );
};

export default Page;
