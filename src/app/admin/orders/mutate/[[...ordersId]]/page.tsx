'use client';
import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import { SelectorDataType } from '@/core/types/selectorType';
import Selector from '@/core/ui/components/Selector';
import { Button, FormCard, FormGroup, TextField } from '@/core/ui/zenbuddha/src';
import ordersApi from '@/modules/orders/ordersApi';
import { ordersSchema, OrdersSchemaType, OrdersType } from '@/modules/orders/ordersType';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import { ZodError } from 'zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const param = useParams();
  const ordersId = param.ordersId && param.ordersId[0];
  const dispatch = useAppDispatch();

  const STATUS_TYPES: Array<SelectorDataType> = [
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'downloadable', label: 'Downloadable' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
  ];

  useEffect(() => {
    if (ordersId) {
      dispatch(ordersApi.endpoints.getEachOrders.initiate(ordersId));
    }
  }, [ordersId, dispatch]);

  const toMutateOrdersData = useGetApiResponse<OrdersType>(
    `getEachOrders("${ordersId ?? ''}")`
  );

  const onSubmit = async (values: OrdersSchemaType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const data = ordersId
        ? await dispatch(
          ordersApi.endpoints.updateOrders.initiate({
            id: Number(ordersId),
            ...values,
          })
        ).unwrap()
        : await dispatch(
          ordersApi.endpoints.addOrders.initiate(values)
        ).unwrap();

      if (data) router.push('/admin/orders/all');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (values: OrdersSchemaType) => {
    try {
      ordersSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
        return error.formErrors.fieldErrors;
      }
    }
  };

  const formik = useFormik<OrdersSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutateOrdersData?.id ?? null,
      billing_address: toMutateOrdersData ? toMutateOrdersData.billing_address : '',
      billing_city: toMutateOrdersData ? toMutateOrdersData.billing_city : '',
      billing_country: toMutateOrdersData ? toMutateOrdersData.billing_country : '',
      billing_postal_code: toMutateOrdersData ? toMutateOrdersData.billing_postal_code : '',
      status: toMutateOrdersData ? toMutateOrdersData.status : '',
      total_amount: toMutateOrdersData
        ? (toMutateOrdersData.total_amount.toString() ?? '')
        : '',
    },
    validateOnChange: true,
    validate: validateForm,
    onSubmit,
  });

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Basic Type">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          {/* <div className="flex flex-col flex-1">
             {artistsData && (
              <Selector
                id="artist"
                // options={artistsData?.results.map(
                //   (artist) =>
                //     ({
                //       value: artist.id!.toString(),
                //       label: artist.name,
                //     }) as SelectorDataType
                // )}
                label="Customers"
                type="Creatable"
                placeholder="Select artist"
                className="flex-1"
                // handleChange={(e) => {
                //   formik.setFieldValue(
                //     'artist',
                //     (e as SingleValue<{ value: string; label: string }>)?.value
                //   );
                // }}
                name="artist"
                
                ></Selector>
             )} 
          </div> */}
          <div className="flex flex-col flex-1">
            <Selector
              id="status"
              label="Status"
              handleChange={(e) => {
                formik.setFieldValue(
                  'status',
                  (e as SingleValue<{ value: string; label: string }>)?.value
                );
              }}
              options={STATUS_TYPES}
              placeholder="Select status"
              value={{
                label:
                  STATUS_TYPES.find(
                    (item) => item.value === formik.values.status
                  )?.label ?? '',
                value: formik.values.status ?? '',
              }}

            ></Selector>
          </div>


        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="billing_city"
              type="text"
              label="Billing City"
              className="flex-1"
              {...formik.getFieldProps('billing_city')}
            />
            {formik.errors.billing_city && (
              <div className="text-red-500 text-sm">{formik.errors.billing_city}</div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <TextField
              id="billing_country"
              type="text"
              label="Billing Country"
              className="flex-1"
              {...formik.getFieldProps('billing_country')}
            />
            {formik.errors.billing_country && (
              <div className="text-red-500 text-sm">{formik.errors.billing_country}</div>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="billing_postal_code"
              type="text"
              label="Billing postal code"
              className="flex-1"
              {...formik.getFieldProps('billing_postal_code')}
            />
            {formik.errors.billing_postal_code && (
              <div className="text-red-500 text-sm">{formik.errors.billing_postal_code}</div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <TextField
              id="total_amount"
              type="text"
              label="Total Amounts"
              className="flex-1"
              {...formik.getFieldProps('total_amount')}
            />
            {formik.errors.total_amount && (
              <div className="text-red-500 text-sm">{formik.errors.total_amount}</div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="billing_address"
              type="text"
              label="Billing Addresss"
              className="flex-1"
              isMulti
              {...formik.getFieldProps('billing_address')}
            />
            {!!formik.errors.billing_address && (
              <div className="text-red-500 text-sm">
                {formik.errors.billing_address}
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
          onClick={() => router.back()}
        />
      </div>
    </FormCard>
  );
};

export default Page;
