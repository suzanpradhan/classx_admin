import { OrdersType } from '@/modules/orders/ordersType';

const OrdersDetails = ({ orders }: { orders: OrdersType }) => {
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div
        className={`h-fit grid md:grid-rows-none grid-rows-3 md:grid-cols-2 mt-4 gap-4`}
      >
        {/* <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
              <div className="text-sm text-black">Customer</div>
              <div className="text-base capitalize text-black">{orders.customer}</div>
            </div> */}
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Status</div>
          <div className="text-base text-black">{orders.status}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Billing Address</div>
          <div className="text-base text-black">{orders.billing_address}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Billing City</div>
          <div className="text-base text-black">{orders.billing_city}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Billing Country</div>
          <div className="text-base text-black">{orders.billing_country}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Billing Postal Code</div>
          <div className="text-base text-black">
            {orders.billing_postal_code}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Total Amount</div>
          <div className="text-base text-black">{orders.total_amount}</div>
        </div>
      </div>
    </div>
  );
};

export default OrdersDetails;
