"use client";
import { Button } from "@/components/ui/button";
import { isRestaurantFavorited } from "@/helpers/restaurants";
import useToggleFavoriteRestaurant from "@/hooks/use-toggle-favorite-restaurant";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { ChevronLeftIcon, HeartIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RestaurantImageProps {
  restaurant: Pick<Restaurant, "id" | "name" | "imageUrl">;
  userFavoritedRestaurants: UserFavoriteRestaurant[];
}

const RestaurantImage = ({
  restaurant,
  userFavoritedRestaurants,
}: RestaurantImageProps) => {
  const router = useRouter();

  const { data } = useSession();

  const isFavorite = isRestaurantFavorited(
    restaurant.id,
    userFavoritedRestaurants,
  );

  const { handleFavoriteClick } = useToggleFavoriteRestaurant({
    restaurantId: restaurant.id,
    userId: data?.user.id,
    restaurantIsFavorited: isFavorite,
  });

  return (
    <div className="relative h-56 w-full">
      <Image
        src={restaurant.imageUrl}
        alt={restaurant.name}
        fill
        className="object-cover"
        quality={100}
      />
      <Button
        onClick={() => router.back()}
        className="absolute left-4 top-4 rounded-full bg-white text-foreground hover:text-white"
        size="icon"
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        onClick={handleFavoriteClick}
        className={`absolute right-4 top-4 rounded-full bg-gray-700/70 ${isFavorite && "bg-primary hover:bg-gray-700/70"}`}
        size="icon"
      >
        <HeartIcon size={20} className="fill-white" />
      </Button>
    </div>
  );
};

export default RestaurantImage;
