import { UserFavoriteRestaurant } from "@prisma/client";

export const isRestaurantFavorited = (
  restaurantId: string,
  userFavoriteRestaurants: UserFavoriteRestaurant[],
) =>
  userFavoriteRestaurants.some(
    (favorite) => favorite.restaurantId === restaurantId,
  );
