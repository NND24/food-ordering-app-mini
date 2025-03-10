"use client";
import Link from "next/link";
import React from "react";
import RestaurantSlider from "./RestaurantSlider";
import { groupStoresByCategory } from "../../utils/functions";

const ListRestaurant = ({ allStore }) => {
  const groupedStores = groupStoresByCategory(allStore);

  return (
    <>
      {groupedStores.map(({ category, stores }) => (
        <div key={category._id}>
          <div className='flex items-center justify-between mb-[2px]'>
            <h3 className='text-[#4A4B4D] text-[24px] font-bold'>{category.name}</h3>
            <Link href={`/search?category=${category._id}`} className='text-[#fc6011] text-[16px]'>
              Xem tất cả
            </Link>
          </div>

          {stores.length > 6 ? (
            <>
              <RestaurantSlider reverse={true} stores={stores.slice(0, Math.ceil(stores.length / 2))} />
              <RestaurantSlider reverse={false} stores={stores.slice(Math.ceil(stores.length / 2))} />
            </>
          ) : (
            <RestaurantSlider reverse={true} stores={stores} />
          )}
        </div>
      ))}
    </>
  );
};

export default ListRestaurant;
