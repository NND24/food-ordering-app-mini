"use client";
import Header from "../../../../../components/header/Header";
import Heading from "../../../../../components/Heading";
import OrderSummary from "../../../../../components/order/OrderSummary";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCompleteCartMutation, useGetDetailCartQuery } from "../../../../../redux/features/cart/cartApi";
import { toast } from "react-toastify";

const page = () => {
  const router = useRouter();

  const { id: storeId, cardId } = useParams();
  const [cartPrice, setCartPrice] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [completeCart, { isSuccess: completeCartSuccess }] = useCompleteCartMutation();

  const {
    data: detailCart,
    refetch: refetchDetailCart,
    isSuccess: getDetailCartSuccess,
  } = useGetDetailCartQuery(storeId);

  useEffect(() => {
    refetchDetailCart();
  }, []);

  useEffect(() => {
    if (detailCart) {
      calculateCartPrice();
    }
  }, [detailCart]);

  const calculateCartPrice = () => {
    const { totalPrice, totalQuantity } = detailCart.data.items.reduce(
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

    setCartPrice(totalPrice);
  };

  const handleCompleteCart = async () => {
    if (deliveryAddress) {
      await completeCart({ storeId, paymentMethod: "cash", deliveryAddress, location: [-74.0059, 40.7127] });
    } else {
      toast.error("Vui lòng nhập địa chỉ");
    }
  };

  useEffect(() => {
    if (completeCartSuccess) {
      toast.success("Đặt thành công");
      router.push("/home");
    }
  }, [completeCartSuccess]);

  return (
    <>
      <div className='pt-[20px] pb-[140px] md:bg-[#f9f9f9] md:pt-[110px]'>
        <Heading title='Giỏ hàng' description='' keywords='' />
        <div className='hidden md:block'>
          <Header />
        </div>

        <div className='bg-[#fff] lg:w-[60%] md:w-[80%] md:mx-auto md:border md:border-[#a3a3a3a3] md:border-solid md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden'>
          {detailCart && (
            <Link
              href={`/restaurant/${detailCart.data.store._id}`}
              className='fixed top-0 right-0 left-0 z-10 flex items-center gap-[40px] bg-[#fff] h-[85px] px-[20px] md:static md:gap-[20px]'
            >
              <div className='relative w-[30px] pt-[30px] md:hidden'>
                <Image src='/assets/arrow_left_long.png' alt='' layout='fill' objectFit='contain' />
              </div>
              <div className='relative w-[70px] pt-[70px] hidden md:block'>
                <Image
                  src={detailCart.data.store.avatar.url}
                  alt=''
                  layout='fill'
                  objectFit='cover'
                  className='rounded-[8px]'
                />
              </div>
              <div>
                <h3 className='text-[#4A4B4D] text-[24px] font-bold'>{detailCart.data.store.name}</h3>
                <p className='text-[#636464]'>{detailCart.data.store.description}</p>
              </div>
            </Link>
          )}

          <div
            className='p-[20px] mt-[85px] md:mt-0'
            style={{ borderBottom: "6px solid #e0e0e0a3", borderTop: "6px solid #e0e0e0a3" }}
          >
            <p className='text-[#4A4B4D] text-[18px] font-bold pb-[20px]'>Giao tới</p>

            <div
              className={`relative flex items-center bg-[#f5f5f5] text-[#636464] rounded-[15px] gap-[8px] border border-solid border-[#7a7a7a] overflow-hidden`}
            >
              <Image
                src='/assets/location.png'
                alt=''
                width={20}
                height={20}
                className='absolute top-[50%] left-[10px] translate-y-[-50%]'
              />
              <input
                type='text'
                name='deliveryAddress'
                placeholder='Nhập địa chỉ giao hàng'
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className='bg-[#f5f5f5] text-[18px] py-[10px] pr-[10px] pl-[35px] w-full'
              />
            </div>
          </div>

          {detailCart && (
            <div className='p-[20px]' style={{ borderBottom: "6px solid #e0e0e0a3" }}>
              <OrderSummary detailItems={detailCart.data.items} price={cartPrice} />
            </div>
          )}

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

          <div className='p-[20px]' style={{ borderBottom: "6px solid #e0e0e0a3" }}>
            <span className='text-[#4A4B4D] text-[16px]'>
              Bằng việc đặt đơn này, bạn đã đồng ý Điều khoản Sử dụng và Quy chế hoạt động của chúng tôi
            </span>
          </div>
        </div>

        <div className='fixed bottom-0 left-0 right-0 bg-[#fff] p-[15px] shadow-[rgba(0,0,0,0.24)_0px_3px_8px]'>
          <div className='flex items-center justify-between pb-[8px] lg:w-[60%] md:w-[80%] md:mx-auto'>
            <span className='text-[#000] text-[18px]'>Tổng cộng</span>
            <span className='text-[#4A4B4D] text-[24px] font-semibold'>
              {Number(cartPrice.toFixed(0)).toLocaleString("vi-VN")}đ
            </span>
          </div>
          <div
            onClick={handleCompleteCart}
            className='flex items-center justify-center rounded-[8px] bg-[#fc6011] text-[#fff] px-[20px] py-[10px] md:px-[10px] lg:w-[60%] md:w-[80%] md:mx-auto cursor-pointer'
          >
            <span className='text-[#fff] text-[20px] font-semibold md:text-[18px]'>Đặt đơn</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
