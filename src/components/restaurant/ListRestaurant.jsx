"use client";
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
