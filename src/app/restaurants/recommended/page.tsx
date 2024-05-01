import Header from "@/components/header";
import RestaurantItem from "@/components/restaurant-item";
import RestaurantList from "@/components/restaurant-list";
import { db } from "@/lib/prisma";

const RecommendedRestaurants = async () => {
  const restaurants = await db.restaurant.findMany({});

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold">Restaurante Recomendados</h2>
        <div className="flex w-full flex-wrap justify-center gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantItem
              key={restaurant.id}
              restaurant={restaurant}
              className=" min-w-full sm:min-w-64 "
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RecommendedRestaurants;
