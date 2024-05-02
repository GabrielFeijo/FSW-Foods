import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RestaurantImage from "../_components/restaurant-image";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import DeliveryInfo from "@/components/delivery-info";
import ProductList from "@/components/product-list";
import CartBanner from "../_components/cart-banner";

interface RestaurantPageProps {
  params: {
    id: string;
  };
}

const RestaurantPage = async ({ params: { id } }: RestaurantPageProps) => {
  const restaurant = await db.restaurant.findUnique({
    where: { id },
    include: {
      categories: true,
      products: {
        take: 10,
        include: {
          category: true,
        },
      },
    },
  });

  if (!restaurant) {
    return notFound();
  }

  return (
    <div>
      <RestaurantImage restaurant={restaurant} />

      <div className="relative z-10 -mt-6 flex items-center justify-between rounded-tl-3xl rounded-tr-3xl bg-white p-5 py-5 ">
        <div className="flex items-center gap-[0.375rem]">
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            width={0}
            height={0}
            className="size-8 rounded-full object-cover"
            quality={100}
          />
          <h1 className="text-xl font-semibold">{restaurant.name}</h1>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-foreground px-2 py-[2px] text-white">
          <StarIcon size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold">5.0</span>
        </div>
      </div>

      <div className="px-5">
        <DeliveryInfo restaurant={restaurant} />
      </div>

      <div className="mt-3 flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
        {restaurant.categories.map((category) => (
          <div
            key={category.id}
            className="min-w-40 rounded bg-[#F4F4F4] text-center"
          >
            <span className="text-black/80">{category.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <h2 className="px-5 font-semibold">Mais Pedidos</h2>
        <ProductList
          products={restaurant.products.map((product) => ({
            ...product,
            restaurant: { name: restaurant.name },
          }))}
        />
      </div>

      {restaurant.categories.map((category) => (
        <div className="mt-6 space-y-4" key={category.id}>
          <h2 className="px-5 font-semibold">{category.name}</h2>

          <ProductList
            products={restaurant.products
              .filter((product) => product.category.id === category.id)
              .map((product) => ({
                ...product,
                restaurant: { name: restaurant.name },
              }))}
          />
        </div>
      ))}

      <CartBanner restaurant={restaurant} />
    </div>
  );
};

export default RestaurantPage;
