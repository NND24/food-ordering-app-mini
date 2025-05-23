"use client";
import Header from "../../../../../components/header/Header";
import Heading from "../../../../../components/Heading";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useGetDishQuery, useGetToppingFromDishQuery } from "../../../../../redux/features/dish/dishApi";
import ToppingItem from "../../../../../components/dish/ToppingItem";
import { useGetUserCartQuery, useUpdateCartMutation } from "../../../../../redux/features/cart/cartApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const page = () => {
  const router = useRouter();
  const { id: storeId, dishId } = useParams();

  const [storeCart, setStoreCart] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [cartItem, setCartItem] = useState(null);
  const [toppings, setToppings] = useState([]);
  const [toppingsValue, setToppingsValue] = useState([]);
  const [price, setPrice] = useState(0);
  const [checkpoint, setCheckpoint] = useState(false);

  const userState = useSelector((state) => state.user);
  const { currentUser } = userState;
  const cartState = useSelector((state) => state.cart);
  const { userCart } = cartState;

  const { refetch: refetchUserCart } = useGetUserCartQuery(null, {
    skip: !currentUser,
  });
  const { data: dishInfo } = useGetDishQuery(dishId);
  const { data: toppingGroups, refetch: refetchToppingGroups } = useGetToppingFromDishQuery(dishId);
  const [updateCart, { isSuccess: updateCartSuccess }] = useUpdateCartMutation();

  useEffect(() => {
    if (currentUser) {
      refetchUserCart();
    }
  }, [currentUser, refetchUserCart]);

  useEffect(() => {
    if (userCart) {
      setStoreCart(userCart.find((cart) => cart.store._id === storeId));
    }
  }, [userCart]);

  useEffect(() => {
    if (storeCart) {
      const item = storeCart.items.find((item) => item.dish._id === dishId);

      setCartItem(item);
      setQuantity(item?.quantity || 0);

      if (item?.toppings.length > 0) {
        item.toppings.forEach((topping) => {
          setToppings((prev) => {
            if (prev.includes(topping._id)) {
              return [...prev];
            } else {
              return [...prev, topping._id];
            }
          });

          setToppingsValue((prev) => {
            if (prev.some((id) => id._id === topping._id)) {
              return [...prev];
            } else {
              return [...prev, topping];
            }
          });
        });
      }
    }
  }, [storeCart]);

  useEffect(() => {
    if (cartItem) {
      const dishPrice = Number(cartItem.dish?.price || 0) * Number(cartItem.quantity);
      const toppingsPrice =
        (Array.isArray(cartItem.toppings)
          ? cartItem.toppings.reduce((sum, topping) => sum + Number(topping.price || 0), 0)
          : 0) * Number(cartItem.quantity);

      const totalPrice = dishPrice + toppingsPrice;

      setPrice(totalPrice);
    }
  }, [cartItem]);

  useEffect(() => {
    if (updateCartSuccess && checkpoint) {
      toast.success("Cập nhật giỏ hàng thành công");
      setCheckpoint(false);
      router.push(`/restaurant/${storeId}`);
    }
  }, [checkpoint, updateCartSuccess]);

  const handleChangeQuantity = (qnt) => {
    let priceChange = 0;
    priceChange = qnt * dishInfo.data.price;

    toppingsValue.forEach((value) => {
      priceChange += qnt * value.price;
    });

    setPrice((prev) => prev + priceChange);

    setQuantity((prev) => {
      const newQuantity = Math.max(prev + qnt, 0);
      return newQuantity;
    });
  };

  useEffect(() => {
    refetchToppingGroups();
  }, []);

  const handleChooseTopping = (topping, toppingPrice) => {
    let priceChange = 0;
    if (toppings.some((id) => id === topping._id)) {
      priceChange = -toppingPrice * quantity;
    } else {
      priceChange = toppingPrice * quantity;
    }

    setPrice((prevPrice) => prevPrice + priceChange);

    setToppings((prev) => {
      if (prev.some((id) => id === topping._id)) {
        return prev.filter((id) => id !== topping._id);
      } else {
        return [...prev, topping._id];
      }
    });

    setToppingsValue((prev) => {
      if (prev.some((item) => item._id === topping._id)) {
        return prev.filter((tp) => tp._id !== topping._id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const handleAddToCart = async () => {
    if (currentUser) {
      await updateCart({ storeId, dishId, quantity, toppings });
      setCheckpoint(true);
    } else {
      toast.error("Vui lòng đăng nhập để tiếp tục đặt hàng!");
    }
  };

  const handleRemoveFromCart = async () => {
    if (currentUser) {
      await updateCart({ storeId, dishId, quantity: 0, toppings });
      setCheckpoint(true);
    } else {
      toast.error("Vui lòng đăng nhập để tiếp tục đặt hàng!");
    }
  };

  return (
    <>
      {dishInfo && (
        <>
          <div className='pb-[120px] md:pt-[75px] md:mt-[20px] md:bg-[#f9f9f9]'>
            <Heading title={dishInfo.data.name} description='' keywords='' />
            <div className='hidden md:block'>
              <Header />
            </div>

            <div className='relative bg-[#fff] lg:w-[60%] md:w-[80%] md:mx-auto md:border md:border-[#a3a3a3a3] md:border-solid md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden'>
              <div className='absolute top-0 right-0 left-0 z-10 flex items-center justify-between px-[20px] pt-[20px]'>
                <Link
                  href={`/restaurant/${storeId}`}
                  className='relative w-[40px] pt-[40px] rounded-full bg-[#e0e0e0a3] overflow-hidden'
                >
                  <Image src='/assets/arrow_left_white.png' alt='' layout='fill' className='p-[8px]' />
                </Link>
              </div>

              <div className='relative pt-[50%] z-0 md:pt-[40%] lg:pt-[35%]'>
                {dishInfo.data?.image && (
                  <Image src={dishInfo.data.image.url || ""} alt='' layout='fill' objectFit='cover' />
                )}
              </div>

              <div className='p-[20px]' style={{ borderBottom: "6px solid #e0e0e0a3" }}>
                <div className='flex justify-between'>
                  <h3 className='text-[#4A4B4D] text-[28px] font-bold' name='dishName'>
                    {dishInfo.data.name}
                  </h3>
                  <span className='text-[#4A4B4D] text-[28px] font-bold' name='dishPrice'>
                    {Number(dishInfo.data.price).toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <p className='text-[#a4a5a8]'>{dishInfo.data.description}</p>
              </div>

              {toppingGroups && (
                <div className='p-[20px]' style={{ borderBottom: "6px solid #e0e0e0a3" }}>
                  {toppingGroups?.data?.map((toppingGroup) => (
                    <div key={toppingGroup._id}>
                      <div className='flex gap-[10px]'>
                        <h3 className='text-[#4A4B4D] text-[20px] font-bold'>{toppingGroup.name}</h3>
                        <span className='text-[#a4a5a8]'>Không bắt buộc</span>
                      </div>
                      {toppingGroup.toppings.map((topping) => (
                        <ToppingItem
                          name='toppingItems'
                          key={topping._id}
                          topping={topping}
                          cartItem={cartItem}
                          handleChooseTopping={handleChooseTopping}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}

              <div className='p-[20px] flex items-center justify-center gap-[5px]'>
                <Image
                  name='decreaseQuantityBtn'
                  src='/assets/minus.png'
                  alt=''
                  width={50}
                  height={50}
                  onClick={(e) => {
                    e.preventDefault();
                    handleChangeQuantity(-1);
                  }}
                  className='border border-[#a3a3a3a3] border-solid rounded-[6px] p-[8px] shadow-[rgba(0,0,0,0.24)_0px_3px_8px] cursor-pointer'
                />
                <input
                  type='number'
                  value={quantity}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  readOnly
                  name='quantity'
                  id=''
                  className='text-[#4A4B4D] text-[24px] font-bold w-[60px] text-center'
                />
                <Image
                  name='increaseQuantityBtn'
                  src='/assets/plus_active.png'
                  alt=''
                  width={50}
                  height={50}
                  onClick={(e) => {
                    e.preventDefault();
                    handleChangeQuantity(1);
                  }}
                  className='border border-[#a3a3a3a3] border-solid rounded-[6px] p-[8px] shadow-[rgba(0,0,0,0.24)_0px_3px_8px] cursor-pointer'
                />
              </div>
            </div>
          </div>

          <div className='fixed bottom-0 left-0 right-0 bg-[#fff] px-[20px] md:px-0 py-[15px] z-[100] flex items-center justify-center'>
            {quantity > 0 ? (
              <div
                name='addCartBtn'
                className='flex items-center justify-center gap-[6px] rounded-[8px] bg-[#fc6011] text-[#fff] py-[15px] px-[20px] lg:w-[60%] md:w-[80%] w-full md:mx-auto cursor-pointer'
                onClick={handleAddToCart}
              >
                <span className='text-[#fff] text-[20px] font-semibold'>Thêm vào giỏ hàng</span>
                <span className='text-[#fff] text-[20px] font-semibold'>-</span>
                <span className='text-[#fff] text-[20px] font-semibold' name='totalPrice'>
                  {Number(price.toFixed(0)).toLocaleString("vi-VN")}đ
                </span>
              </div>
            ) : (
              <div className='flex items-center gap-[10px] lg:w-[60%] md:w-[80%] w-full md:mx-auto '>
                <Link
                  href={`restaurant/${storeId}`}
                  className='flex items-center justify-center gap-[6px] rounded-[8px] bg-[#fc6011] text-[#fff] py-[15px] px-[20px] cursor-pointer w-[65%] md:w-[80%]'
                >
                  <span className='text-[#fff] text-[20px] font-semibold'>Quay lại thực đơn</span>
                </Link>

                <div
                  className='flex items-center justify-center gap-[6px] rounded-[8px] bg-[#c9c8c8] text-[#fff] py-[15px] px-[20px] cursor-pointer w-[35%] md:w-[20%]'
                  onClick={handleRemoveFromCart}
                >
                  <span className='text-[#4a4b4d] text-[20px] font-semibold'>Bỏ chọn</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default page;
