import CategoryList from "@/components/category-list";
import Header from "@/components/header";
import ProductsList from "@/components/product-list";
import PromoBanner from "@/components/promo-banner";
import RestaurantList from "@/components/restaurant-list";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const products = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 10,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <>
      <Header />
      <div className="px-5 pt-6">
        <Search />
      </div>

      <div className="px-5 pt-6">
        <CategoryList />
      </div>

      <div className="px-5 pt-6">
        <PromoBanner
          src="/promo_banner1.png"
          alt="Até 30% de desconto em Pizzas"
        />
      </div>

      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between px-5">
          <h2 className="font-semibold">Pedidos Recomendados</h2>
          <Link href="/products/recommended" className="cursor-pointer">
            <Button
              variant="ghost"
              className="h-fit p-0 text-primary hover:bg-transparent"
            >
              Ver todos
              <ChevronRightIcon size={16} />
            </Button>
          </Link>
        </div>
        <ProductsList products={products} />
      </div>

      <div className="px-5 pt-6">
        <PromoBanner
          src="/promo_banner2.png"
          alt="Lanches a partir de R$ 17,90"
        />
      </div>

      <div className="space-y-4 py-6">
        <div className="flex items-center justify-between px-5">
          <h2 className="font-semibold">Restaurantes Recomendados</h2>
          <Link href="/restaurants/recommended" className="cursor-pointer">
            <Button
              variant="ghost"
              className="h-fit p-0 text-primary hover:bg-transparent"
            >
              Ver todos
              <ChevronRightIcon size={16} />
            </Button>
          </Link>
        </div>
        <RestaurantList />
      </div>
    </>
  );
}
