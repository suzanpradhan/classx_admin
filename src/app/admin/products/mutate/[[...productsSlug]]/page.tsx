'use client';
import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import { Button, FormCard, FormGroup, ImageInput, TextField } from '@/core/ui/zenbuddha/src';
import artistsApi from '@/modules/artists/artistsApi';
import productsApi from '@/modules/products/productsApi';
import { productsSchema, ProductsSchemaType, ProductsType } from '@/modules/products/productType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { ZodError } from 'zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const slug = params.productsSlug;
  const dispatch = useAppDispatch();

  // const Product_type: Array<SelectorDataType> = [
  //   { value: 'merch', label: 'Merchandise' },
  // ];

  const toMutateProductsData = useGetApiResponse<ProductsType>(
    `getEachProducts("${slug || undefined}")`
  );

  useEffect(() => {
    // dispatch(releaseApi.endpoints.getAllReleases.initiate(1));
    dispatch(artistsApi.endpoints.getAllArtists.initiate({ pageNumber: '1' }));

  }, [dispatch]);

  useEffect(() => {
    if (slug) {
      dispatch(productsApi.endpoints.getEachProducts.initiate(slug.toString()));
    }

  }, [slug, dispatch]);

  // useEffect(() => {
  //   if (toMutateProductsData?.release)
  //     dispatch(releaseApi.endpoints.getEachReleases.initiate(toMutateProductsData.release.toString()));
  // }, [toMutateProductsData?.release, dispatch]);

  // const artistsData = useAppSelector(
  //   (state: RootState) =>
  //     state.baseApi.queries[`getAllArtists`]
  //       ?.data as PaginatedResponseType<ArtistsType>
  // );
  // const releasesData = useAppSelector(
  //   (state: RootState) =>
  //     state.baseApi.queries[`getAllReleases`]
  //       ?.data as PaginatedResponseType<ReleasesType>
  // );

  // const eachRealese = useAppSelector(
  //   (state: RootState) =>
  //     state.baseApi.queries[`getEachReleases("${toMutateProductsData?.release?.toString()}")`]
  //       ?.data as ReleasesType
  // );

  const onSubmit = async (values: ProductsSchemaType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const data = slug
        ? await Promise.resolve(
          dispatch(
            productsApi.endpoints.updateProducts.initiate({
              ...values,
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
      product_type: 'merch',
      description: toMutateProductsData ? toMutateProductsData.description : '',
      slug: toMutateProductsData ? toMutateProductsData.slug : '',
      release: '',
      artist: '',
      thumbnail: toMutateProductsData ? null : null,
      price: toMutateProductsData ? toMutateProductsData.price : '',
      stock: toMutateProductsData ? toMutateProductsData.stock.toString() : '',
    },
    validate: validateForm,
    onSubmit,
  });


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      formik.setFieldValue('thumbnail', e.target.files[0]);
    }
  };

  const handleRichTextChange = (value: string) => {
    formik.setFieldValue('description', value);
  };
  // console.log(formik.values.release.value, "formik realses value")
  // console.log(toMutateProductsData?.release, "ToMuted realses value")

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Basic Type">
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
            {formik.errors.title && (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            )}
          </div>
          {/* <div className="flex flex-col flex-1">
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
          </div> */}
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
          {/* <div className="flex flex-col flex-1">
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
          </div> */}
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          {/* <div className="flex flex-col flex-1">
            <Selector
              id="product_type"
              label="Products Type"
              handleChange={(e) => {
                const selectedValue = (e as SingleValue<{ value: string; label: string }>)?.value;
                formik.setFieldValue('product_type', selectedValue);

                if (selectedValue === 'merch') {
                  formik.setFieldValue('release', { value: '', label: '' });
                }
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
            />

          </div> */}
          {/* {formik.values.product_type === 'digital' && (
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
                    formik.setFieldValue('release', e as SingleValue<{ value: string; label: string }>);
                  }}
                  name="release"
                  value={formik.values.release}
                />
              )}
            </div>
          )} */}
        </div>


        <div className='mt-3 gap-2'>
          <label htmlFor="description" className="block text-sm mb-2 font-medium text-gray-700">
            Description
          </label>
          <ReactQuill theme="snow" className='h-60' value={formik.values.description} onChange={handleRichTextChange}
          />
        </div>

        <div className='flex gap-2 mb-2 max-sm:flex-col'>
          {/* <div className='flex flex-col flex-1'>
            <ColorSelector
              id="colorPicker"
              type="color"
              label="Choose a Color"
              required
              className="mb-4"
            />

          </div> */}

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
