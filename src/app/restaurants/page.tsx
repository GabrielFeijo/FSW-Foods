"use client";
import { Restaurant } from "@prisma/client";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchForRestaurants } from "./_actions/search";
import Header from "@/components/header";
import RestaurantItem from "@/components/restaurant-item";

const RestaurantsPage = () => {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const searchFor = searchParams.get("search");

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!searchFor) return;

      const restaurants = await searchForRestaurants(searchFor);
      setRestaurants(restaurants);
    };

    fetchRestaurants();
  }, [searchFor]);

  if (!searchFor) return notFound();

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold">Restaurante Encontrados</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {restaurants.map((restaurant) => (
            <RestaurantItem
              key={restaurant.id}
              restaurant={restaurant}
              className=" min-w-full  "
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RestaurantsPage;
