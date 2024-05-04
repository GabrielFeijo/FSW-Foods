"use client";
import { formatCurrency } from "@/helpers/price";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { BikeIcon, HeartIcon, StarIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toggleFavoriteRestaurant } from "@/actions/restaurant";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface RestaurantItemProps {
  restaurant: Restaurant;
  className?: string;
  userFavoriteRestaurants: UserFavoriteRestaurant[];
}

const RestaurantItem = ({
  restaurant,
  className,
  userFavoriteRestaurants,
}: RestaurantItemProps) => {
  const { data } = useSession();

  const isFavorite = userFavoriteRestaurants.some(
    (favorite) => favorite.restaurantId === restaurant.id,
  );

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!data?.user.id) return;

    try {
      await toggleFavoriteRestaurant(data?.user.id, restaurant.id);
      toast.success(
        isFavorite
          ? "Restaurante removido dos favoritos!"
          : "Restaurante favoritado com sucesso!",
      );
    } catch (error) {
      toast.error("Erro ao favoritar o restaurante.");
    }
  };

  return (
    <Link
      className={cn("min-w-64 max-w-64 cursor-pointer space-y-3", className)}
      href={`/restaurants/${restaurant.id}`}
    >
      <div className="relative h-36 w-full">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          fill
          className="rounded-lg object-cover"
          quality={100}
        />

        <div className="absolute left-2 top-2 flex items-center gap-[2px] rounded-full bg-white px-2 py-[2px]">
          <StarIcon size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold">5.0</span>
        </div>

        {data?.user.id && (
          <Button
            className={`absolute right-2 top-2 h-7 w-7 rounded-full bg-gray-700/70 ${isFavorite && "bg-primary hover:bg-gray-700/70"}`}
            onClick={handleFavoriteClick}
            size="icon"
          >
            <HeartIcon size={16} className="fill-white" />
          </Button>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold">{restaurant.name}</h3>
        <div className="flex gap-3">
          <div className="flex items-center gap-1">
            <BikeIcon size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">
              {Number(restaurant.deliveryFee) === 0
                ? "Entrega grátis"
                : formatCurrency(Number(restaurant.deliveryFee))}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <TimerIcon size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">
              {restaurant.deliveryTimeMinutes} min
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantItem;
