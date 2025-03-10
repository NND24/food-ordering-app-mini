"use client";
import Header from "../../components/header/Header";
import MobileHeader from "../../components/header/MobileHeader";
import Heading from "../../components/Heading";
import NavBar from "../../components/NavBar";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useLogoutUserMutation } from "../../redux/features/auth/authApi";
import { useSelector } from "react-redux";
import ConfirmToast from "../../components/ConfirmToast";

const page = () => {
  const [showConfirm, setShowConfirm] = useState(false);

  const [logoutUser] = useLogoutUserMutation();

  const userState = useSelector((state) => state?.user);
  const { currentUser } = userState;

  return (
    <>
      <div className='pt-[30px] pb-[100px] md:pt-[75px] md:mt-[20px] md:px-0 md:bg-[#f9f9f9]'>
        <Heading title='Tài khoản' description='' keywords='' />
        <div className='hidden md:block'>
          <Header page='account' />
        </div>

        <MobileHeader text='Tài khoản' />
        <div className='bg-[#fff] lg:w-[75%] px-[20px] md:w-[80%] pb-[20px] mb-[20px] md:mx-auto md:border md:border-[#a3a3a3a3] md:border-solid md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden'>
          <Link href='/account/profile' className='flex gap-[15px] my-[20px] cursor-pointer'>
            <div className='relative w-[60px] pt-[60px]'>
              <Image
                src={currentUser?.avatar?.url || ""}
                alt=''
                layout='fill'
                objectFit='cover'
                className='rounded-[6px]'
              />
            </div>
            <div className='flex flex-1 justify-between items-center'>
              <div className=''>
                <p className='text-[#4A4B4D] text-[22px] font-semibold'>{currentUser?.name}</p>
                <p className='text-[#636464] text-[16px]'>{currentUser?.phonenumber}</p>
              </div>

              <div className='relative w-[30px] pt-[30px]'>
                <Image src='/assets/pencil.png' alt='' layout='fill' objectFit='contain' />
              </div>
            </div>
          </Link>

          <Link
            href='/orders'
            className='bg-[#fff] flex items-center justify-between border-b-[1px] border-t-[0px] border-x-[0px] border-b-[#a3a3a3] border-solid px-[8px] py-[12px] my-[20px]'
          >
            <div className='flex items-center gap-[10px]'>
              <div className='relative w-[30px] pt-[30px] md:w-[25px] md:pt-[25px]'>
                <Image src='/assets/order.png' alt='' layout='fill' objectFit='contain' />
              </div>
              <span className='text-[#4A4B4D] text-[20px] font-semibold'>Đơn hàng</span>
            </div>
            <div className='relative w-[25px] pt-[25px] md:w-[20px] md:pt-[20px]'>
              <Image src='/assets/arrow_right.png' alt='' layout='fill' objectFit='contain' />
            </div>
          </Link>

          <Link
            href='/carts'
            className='bg-[#fff] flex items-center justify-between border-b-[1px] border-t-[0px] border-x-[0px] border-b-[#a3a3a3] border-solid px-[8px] py-[12px] my-[20px]'
          >
            <div className='flex items-center gap-[10px]'>
              <div className='relative w-[30px] pt-[30px] md:w-[25px] md:pt-[25px]'>
                <Image src='/assets/cart.png' alt='' layout='fill' objectFit='contain' />
              </div>
              <span className='text-[#4A4B4D] text-[20px] font-semibold'>Giỏ hàng</span>
            </div>
            <div className='relative w-[25px] pt-[25px] md:w-[20px] md:pt-[20px]'>
              <Image src='/assets/arrow_right.png' alt='' layout='fill' objectFit='contain' />
            </div>
          </Link>

          {!currentUser?.isGoogleLogin && (
            <Link
              href='/account/change-password'
              className='bg-[#fff] flex items-center justify-between border-b-[1px] border-t-[0px] border-x-[0px] border-b-[#a3a3a3] border-solid px-[8px] py-[12px] my-[20px]'
            >
              <div className='flex items-center gap-[10px]'>
                <div className='relative w-[30px] pt-[30px] md:w-[25px] md:pt-[25px]'>
                  <Image src='/assets/lock.png' alt='' layout='fill' objectFit='contain' />
                </div>
                <span className='text-[#4A4B4D] text-[20px] font-semibold'>Đổi mật khẩu</span>
              </div>
              <div className='relative w-[25px] pt-[25px] md:w-[20px] md:pt-[20px]'>
                <Image src='/assets/arrow_right.png' alt='' layout='fill' objectFit='contain' />
              </div>
            </Link>
          )}

          <button
            onClick={() => setShowConfirm(true)}
            className='bg-[#fc6011] text-[#fff] font-semibold w-full p-[20px] rounded-full my-[10px] cursor-pointer shadow-[rgba(0,0,0,0.24)_0px_3px_8px]'
          >
            Đăng Xuất
          </button>
        </div>

        <div className='block md:hidden'>
          <NavBar page='account' />
        </div>
      </div>
      {showConfirm && (
        <ConfirmToast
          message='Bạn có chắc chắn muốn đăng xuất?'
          onConfirm={() => {
            logoutUser();
          }}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

export default page;
