import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(backendUrl+'/api/order/userorders',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItems = [];
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            item['status']=order.status
            item['payment']=order.payment
            item['paymentMethod']=order.paymentMethod
            item['date']=order.date
            allOrdersItems.push(item)

          })
        })
        setOrderData(allOrdersItems.reverse())

        }

        
        else {
        console.warn("loadOrderData failed:", response.data?.message);
        setOrderData([]);
      }
    } catch (error) {
      console.error("loadOrderData error:", error);
      setOrderData([]);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrderData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const formatDate = (ts) => {
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return "";
    }
  };

  const handleTrack = (orderId) => {
    // replace with real navigation or modal if you have one
    console.log("Track order:", orderId);
    // e.g. navigate(`/orders/${orderId}`);
  };

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div className="">
        {orderData.length === 0 ? (
          <p className="text-gray-500 mt-8">You have no orders yet.</p>
        ) : (
          orderData.map((item, index) => (
            <div
              key={`${item._id}-${index}`}
              className="py-4 border border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >{console.log("ORDER IMAGE:",item.image)}
              <div className="flex items-start gap-6 text-sm">
                <img
                  src={item.image?.[0] ?? "/fallback-image.png"}
                  className="w-16 sm:w-20 object-cover"
                  alt={item.name || "product"}
                />

                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-base text-gray-500">
                    <p className="text-lg">
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size : {item.size}</p>
                  </div>
                  <p className="mt-2">
                    Date: <span className="text-gray-400">{formatDate(item.date)}</span>
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Payment: {item.payment ? "Paid" : "Pending"} • Method: {item.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="md:w-1/2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>

                <button
                  onClick={() => handleTrack(item.orderId)}
                  className="border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
