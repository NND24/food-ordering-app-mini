"use client";
import Header from "../../../../components/header/Header";
import Heading from "../../../../components/Heading";
import OrderSummary from "../../../../components/order/OrderSummary";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetOrderDetailQuery } from "../../../../redux/features/order/orderApi";

const page = () => {
  const router = useRouter();
  const { orderId } = useParams();

  const [price, setPrice] = useState(0);

  const { data: orderDetail, refetch: refetchGetOrderDetail } = useGetOrderDetailQuery(orderId);

  useEffect(() => {
    refetchGetOrderDetail();
  }, []);

  const calculatePrice = () => {
    const { totalPrice, totalQuantity } = orderDetail.data.items.reduce(
      (acc, item) => {
        const dishPrice = (item.dish?.price || 0) * item.quantity;
        const toppingsPrice =
          (Array.isArray(item.toppings) ? item.toppings.reduce((sum, topping) => sum + (topping.price || 0), 0) : 0) *
          item.quantity;

        acc.totalPrice += dishPrice + toppingsPrice;
        acc.totalQuantity += item.quantity;

        return acc;
      },
      { totalPrice: 0, totalQuantity: 0 }
    );

    setPrice(totalPrice);
  };

  useEffect(() => {
    console.log(orderDetail);
    if (orderDetail) {
      calculatePrice();
    }
  }, [orderDetail]);

  return (
    <>
      {orderDetail && (
        <div className='pb-[140px] md:bg-[#f9f9f9] md:pt-[110px]'>
          <Heading title='Chi tiết đơn hàng' description='' keywords='' />
          <div className='hidden md:block'>
            <Header />
          </div>

          <div className='lg:w-[80%] md:w-[80%] md:mx-auto'>
            <div className='flex items-center gap-[20px] px-[20px] py-[20px] md:hidden'>
              <Image
                src='/assets/arrow_left_long.png'
                alt=''
                width={40}
                height={40}
                className='p-[8px] rounded-full bg-[#e0e0e0a3]'
              />
              <h3 className='text-[#4A4B4D] text-[24px] font-bold'>Chi tiết đơn hàng</h3>
            </div>

            <div className='bg-[#fff] flex flex-col gap-[15px] m-[20px] p-[10px] border border-[#a3a3a3a3] border-solid rounded-[8px] shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:p-[20px]'>
              <Link
                href={`/restaurant/${orderDetail.data.store._id}`}
                className='flex gap-[15px] pb-[20px]'
                style={{ borderBottom: "6px solid #e0e0e0a3" }}
              >
                <div className='relative flex flex-col gap-[4px] w-[70px] pt-[70px]'>
                  <Image
                    src={orderDetail.data.store.avatar.url}
                    alt=''
                    layout='fill'
                    objectFit='cover'
                    className='rounded-[6px]'
                  />
                </div>

                <div className='flex flex-col'>
                  <div className='flex items-center gap-[6px] cursor-pointer'>
                    <span className='text-[#4A4B4D] text-[20px] font-bold'>{orderDetail.data.store.name}</span>
                  </div>
                  <div className='flex items-center gap-[6px]'>
                    <span className='text-[#a4a5a8]'>{orderDetail.data.store.description}</span>
                  </div>
                </div>
              </Link>

              <div className='p-[20px]' style={{ borderBottom: "6px solid #e0e0e0a3" }}>
                <div className='pb-[20px] flex items-center justify-between'>
                  <span className='text-[#4A4B4D] text-[18px] font-bold'>Thông tin thanh toán</span>
                </div>

                <div className='flex gap-[15px]'>
                  <div className='relative w-[30px] pt-[30px] md:w-[20px] md:pt-[20px]'>
                    <Image src='/assets/money.png' alt='' layout='fill' objectFit='contain' />
                  </div>
                  <div className='flex flex-1 items-center justify-between'>
                    <div className='flex items-center gap-[8px]'>
                      <h3 className='text-[#4A4B4D] text-[18px] font-bold md:text-[16px]'>Tiền mặt</h3>
                    </div>
                    <div className='relative w-[30px] pt-[30px] md:w-[20px] md:pt-[20px] cursor-pointer'>
                      <Image src='/assets/button_active.png' alt='' layout='fill' objectFit='contain' />
                    </div>
                  </div>
                </div>
              </div>

              <div className='p-[20px]'>
                <OrderSummary detailItems={orderDetail.data.items} price={price} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default page;
