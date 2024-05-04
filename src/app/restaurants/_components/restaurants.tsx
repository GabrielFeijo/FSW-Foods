"use client";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import RestaurantItem from "@/components/restaurant-item";
import { searchForRestaurants } from "../_actions/search";

interface RestaurantProps {
  userFavoriteRestaurants: UserFavoriteRestaurant[];
}

const Restaurants = ({ userFavoriteRestaurants }: RestaurantProps) => {
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
              className="min-w-full"
              key={restaurant.id}
              restaurant={restaurant}
              userFavoriteRestaurants={userFavoriteRestaurants}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Restaurants;
