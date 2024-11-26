'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/responseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import ordersApi from '@/modules/orders/ordersApi';
import { OrdersType } from '@/modules/orders/ordersType';
import { Eye, PencilSimpleLine, TrashSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';

const OrdersTableLisiting = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(ordersApi.endpoints.getAllOrders.initiate(pageIndex));
  }, [dispatch, pageIndex]);

  const orderseData = useAppSelector(
    (state: RootState) => 
      state.baseApi.queries[`getAllOrders`]
        ?.data as PaginatedResponseType<OrdersType>
  );


  console.log(orderseData,"data")
  return (
    <>
        <>
          <AlertDialog
            isOpen={deleteModelOpen}
            deleteContent={onDelete}
            onClickNo={() => {
              toggleDeleteModel(false);
            }}
            onClickYes={async () => {
              if (onDelete) {
                await Promise.resolve(
                  dispatch(
                    ordersApi.endpoints.deleteOrders.initiate(onDelete as string)
                  )
                );
              }
              toggleDeleteModel(false);
              setOnDelete(undefined);
            }}
          />
          <TableCard
            footer={
                orderseData && orderseData?.results.length > 0 ?  (
                <PaginationNav
                  gotoPage={setPageIndex}
                  canPreviousPage={pageIndex > 0}
                  canNextPage={pageIndex < orderseData.pagination.total_page}
                  pageCount={orderseData.pagination.total_page}
                  pageIndex={orderseData.pagination.current_page - 1}
                />
              ) : (
                <></>
              )
            }
          >
            <thead>
              <tr className={tableStyles.table_thead_tr}>
                <th className={tableStyles.table_th}>S.N.</th>
                <th className={tableStyles.table_th}>Customer</th>
                <th className={tableStyles.table_th}>Billing Address</th>
                <th className={tableStyles.table_th}>Billing City</th>
                <th className={tableStyles.table_th}>Billing Country</th>
                <th className={tableStyles.table_th}>Total Amount</th>
                <th className={tableStyles.table_th}>Status</th>
                <th className={tableStyles.table_th}>Action</th>
                
              </tr>
            </thead>
            <tbody>
            {orderseData?.results.map((item, index) => (
            <tr key={index} className={tableStyles.table_tbody_tr}>
              <td className={tableStyles.table_td}>{item.id}</td>
              <td className={tableStyles.table_td}>{item.customer.profile?.full_name}</td>
                <td className={tableStyles.table_td}>{item.billing_address}</td>
                <td className={tableStyles.table_td}>{item.billing_city}</td>
                <td className={tableStyles.table_td}>{item.billing_country}</td>
                <td className={tableStyles.table_td}>{item.total_amount}</td>
                <td className={tableStyles.table_td}>
                  <span
                    className={`text-white text-xs px-2 py-1 rounded-sm capitalize ${
                      item.status === 'pending'
                        ? 'bg-blue-500'
                        : item.status === 'shipped'
                          ? 'bg-green-500'
                          : item.status === 'delivered'
                            ? 'bg-purple-500'
                          : item.status === 'downloadable'
                            ? 'bg-slate-600'
                            : item.status === 'cancelled'
                              ? 'bg-red-500'
                              : 'bg-gray-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

              <td className={tableStyles.table_td + ` flex gap-2 max-w-xs`}>
              <Button
                  className="h-8 w-8"
                   type="link"
                   href={`/admin/orders/${item.id}`}
                  buttonType="bordered"
                  prefix={<Eye size={18} weight="duotone" />}

                />
                <Button
                        className="h-8 w-8"
                        type="link"
                        href={`/admin/orders/mutate/${item.id}`}
                        prefix={<PencilSimpleLine size={15} weight="duotone" />}
                      />
                <Button
                  className="h-8 w-8"
                  kind="danger"
                  type="button"
                  onClick={() => {
                    setOnDelete(item.id?.toString());
                    toggleDeleteModel(true);
                  }}
                  prefix={<TrashSimple size={18} weight="duotone" />}
                 
                />
              </td>
            </tr>
          ))}
             
                  
            </tbody>
          </TableCard>
        </>
    </>
  );
};

export default OrdersTableLisiting;
