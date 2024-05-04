import { toggleFavoriteRestaurant } from "@/actions/restaurant";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UseToggleFavoriteRestaurantProps {
  userId?: string;
  restaurantId: string;
  restaurantIsFavorited?: boolean;
}

const useToggleFavoriteRestaurant = ({
  userId,
  restaurantId,
  restaurantIsFavorited,
}: UseToggleFavoriteRestaurantProps) => {
  const router = useRouter();
  const handleFavoriteClick = async () => {
    if (!userId) return;

    try {
      await toggleFavoriteRestaurant(userId, restaurantId);

      toast(
        restaurantIsFavorited
          ? "Restaurante removido dos favoritos!"
          : "Restaurante favoritado com sucesso!",
        {
          action: {
            label: "Ver favoritos",
            onClick: () => {
              router.push("/my-favorite-restaurants");
            },
          },
        },
      );
    } catch (error) {
      toast.error("Erro ao favoritar o restaurante.");
    }
  };

  return { handleFavoriteClick };
};

export default useToggleFavoriteRestaurant;
