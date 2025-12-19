import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])

  const fetch = async () => {
    if (!token) return null
    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      )

      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async(event,orderId)=>{
    try {
      const response = await axios.post(backendUrl+'/api/order/status',{orderId,status:event.target.value},{headers:{token}})
      if(response.data.success)
      {
        await fetch()
      }
      
    } catch (error) {
      console.log(error)
      toast.error(response.data.message)
      
    }
  }

  useEffect(() => {
    fetch()
  }, [token])

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-6">Order Page</h3>

      <div className="flex flex-col gap-6">
        {orders.map((order, index) => {
          return (
            <div
              key={index}
              className="border rounded-md p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-white shadow-sm"
            >
              {/* LEFT */}
              <div className="flex gap-4 items-start">
                <img
                  src={assets.parcel_icon}
                  alt=""
                  className="w-12 h-12 object-contain"
                />

                <div>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return (
                        <p key={index} className="text-sm text-gray-700">
                          {item.name} x {item.quantity}{' '}
                          <span className="text-gray-500">({item.size})</span>
                        </p>
                      )
                    } else {
                      return (
                        <p key={index} className="text-sm text-gray-700">
                          {item.name} x {item.quantity}{' '}
                          <span className="text-gray-500">({item.size})</span>,
                        </p>
                      )
                    }
                  })}
                </div>
              </div>

              {/* ADDRESS */}
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-800">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p>{order.address.street},</p>
                <p>
                  {order.address.city}, {order.address.state},{' '}
                  {order.address.country}, {order.address.zipcode}
                </p>
                <p>{order.address.phone}</p>
              </div>

              {/* ORDER INFO */}
              <div className="text-sm text-gray-600">
                <p>Items: {order.items.length}</p>
                <p>Method: {order.paymentMethod}</p>
                <p>
                  Payment:{' '}
                  <span
                    className={`font-medium ${
                      order.payment ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {order.payment ? 'Done' : 'Pending'}
                  </span>
                </p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>

              {/* PRICE + STATUS */}
              <div className="flex flex-col gap-2 items-start lg:items-end">
                <p className="font-semibold text-lg">
                  {currency}
                  {order.amount}
                </p>

                <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className="border px-3 py-1 text-sm rounded-md outline-none cursor-pointer">
                  <option value="OrderPlaced">OrderPlaced</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out For Delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders
