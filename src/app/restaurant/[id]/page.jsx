"use client";
import ListDishBig from "../../../components/dish/ListDishBig";
import ListDish from "../../../components/dish/ListDish";
import Header from "../../../components/header/Header";
import Image from "next/image";
import Link from "next/link";
import Heading from "../../../components/Heading";
import { useParams } from "next/navigation";
import { useGetStoreInformationQuery } from "../../../redux/features/store/storeApi";
import { useGetAllDishQuery } from "../../../redux/features/dish/dishApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUserCartQuery } from "../../../redux/features/cart/cartApi";

const page = () => {
  const { id: storeId } = useParams();

  const [storeCart, setStoreCart] = useState(null);
  const [cartPrice, setCartPrice] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(0);

  const userState = useSelector((state) => state.user);
  const { currentUser } = userState;
  const cartState = useSelector((state) => state.cart);
  const { userCart } = cartState;

  const { refetch: refetchUserCart } = useGetUserCartQuery(null, {
    skip: !currentUser,
  });
  const { data: storeInfo, refetch: refetchStoreInfo } = useGetStoreInformationQuery(storeId);
  const { data: allDish, refetch: refetchAllDish } = useGetAllDishQuery(storeId);

  useEffect(() => {
    if (currentUser) {
      refetchUserCart();
    }
  }, [currentUser, refetchUserCart]);

  useEffect(() => {
    if (userCart) {
      setStoreCart(userCart.find((cart) => cart.store._id === storeId));
    } else {
      setStoreCart(null);
    }
  }, [userCart]);

  useEffect(() => {
    if (storeId) {
      refetchStoreInfo();
      refetchAllDish();
    }
  }, []);

  const calculateCartPrice = () => {
    const { totalPrice, totalQuantity } = storeCart.items.reduce(
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
    setCartQuantity(totalQuantity);
  };

  useEffect(() => {
    if (storeCart) {
      calculateCartPrice();
    }
  }, [storeCart]);

  return (
    <>
      {storeInfo && (
        <div className={`pb-[90px] md:pt-[34px] md:bg-[#f9f9f9]`}>
          <Heading title={storeInfo?.data?.name} description='' keywords='' />
          <div className='hidden md:block'>
            <Header />
          </div>

          <div className='fixed top-0 right-0 left-0 z-10 flex items-center justify-between px-[20px] pt-[20px] md:hidden'>
            <Image src='/assets/arrow_left_white.png' alt='' width={30} height={30} />
            <div className='flex items-center gap-[20px]'>
              <Image src='/assets/favorite_white.png' alt='' width={30} height={30} />
              <Image src='/assets/notification_white.png' alt='' width={30} height={30} />
            </div>
          </div>

          <div className='bg-[#fff] lg:w-[75%] md:w-[80%] pb-[20px] mb-[20px] md:mx-auto md:border md:border-[#a3a3a3a3] md:border-solid md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden'>
            <div className='relative pt-[50%] z-0 lg:pt-[35%] rounded-br-[8px] rounded-bl-[8px] overflow-hidden'>
              <Image src={storeInfo?.data?.cover?.url || ""} alt='' layout='fill' objectFit='cover' />
            </div>

            <div className='flex gap-[25px] my-[20px] mx-[20px] items-start bg-[#fff] translate-y-[-60%] mb-[-10%] p-[10px] rounded-[6px] shadow-[rgba(0,0,0,0.24)_0px_3px_8px]'>
              <div className='relative flex flex-col gap-[4px] w-[90px] pt-[90px] md:w-[120px] md:pt-[120px]'>
                <Image
                  src={storeInfo?.data?.avatar?.url || ""}
                  alt=''
                  layout='fill'
                  objectFit='cover'
                  className='rounded-[8px]'
                />
              </div>

              <div className='flex flex-1 items-start justify-between'>
                <div className='flex flex-col'>
                  <span className='text-[#4A4B4D] text-[20px] font-semibold'>{storeInfo?.data?.name}</span>

                  <div className='flex items-center gap-[6px]'>
                    {storeInfo?.data?.storeCategory.map((category, index) => (
                      <div className='flex items-center gap-[6px]' key={category._id}>
                        <span className='text-[#636464]'>{category.name}</span>
                        {index !== storeInfo?.data.storeCategory.length - 1 && (
                          <div className='w-[4px] h-[4px] rounded-full bg-[#fc6011]'></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className='flex items-center gap-[6px]'>
                    {storeInfo?.data?.avgRating != 0 && (
                      <>
                        <Image src='/assets/star_active.png' alt='' width={20} height={20} />
                        <span className='text-[#fc6011]'>{storeInfo?.data?.avgRating.toFixed(2)}</span>
                      </>
                    )}
                    {storeInfo?.data?.amountRating != 0 && (
                      <span className='text-[#636464]'>{`(${storeInfo?.data?.amountRating} đánh giá)`}</span>
                    )}
                  </div>

                  <span className='text-[#636464] pt-[4px]'>{storeInfo?.data?.description}</span>
                </div>
              </div>
            </div>

            <div className='md:p-[20px]'>
              <div className='mb-[20px] px-[20px] md:px-0'>
                <h3 className='text-[#4A4B4D] text-[24px] font-bold'>Dành cho bạn</h3>
                {allDish && (
                  <ListDishBig
                    storeId={storeId}
                    allDish={allDish?.data}
                    cartItems={storeCart ? storeCart?.items : []}
                  />
                )}
              </div>

              <div className='my-[20px] px-[20px] md:px-0'>
                {allDish && (
                  <ListDish storeId={storeId} allDish={allDish?.data} cartItems={storeCart ? storeCart?.items : []} />
                )}
              </div>
            </div>
          </div>
          {cartQuantity > 0 && storeCart && (
            <Link
              name='cartDetailBtn'
              href={`/restaurant/${storeId}/cart/${storeCart._id}`}
              className='fixed bottom-0 left-0 right-0 bg-[#fff] px-[20px] py-[15px] z-[100] flex items-center justify-center'
            >
              <div className='flex items-center justify-between rounded-[8px] bg-[#fc6011] text-[#fff] py-[15px] px-[20px] lg:w-[75%] md:w-[80%] w-full md:mx-auto'>
                <div className='flex items-center gap-[8px]'>
                  <span className='text-[#fff] text-[20px] font-semibold'>Giỏ hàng</span>
                  <div className='w-[4px] h-[4px] rounded-full bg-[#fff]'></div>
                  <span className='text-[#fff] text-[20px] font-semibold'>{cartQuantity} món</span>
                </div>
                <span className='text-[#fff] text-[20px] font-semibold'>
                  {Number(cartPrice.toFixed(0)).toLocaleString("vi-VN")}đ
                </span>
              </div>
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default page;
