import CategoryList from "@/components/category-list";
import Header from "@/components/header";
import ProductsList from "@/components/product-list";
import PromoBanner from "@/components/promo-banner";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import { ChevronRightIcon } from "lucide-react";

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
          <Button
            variant="ghost"
            className="h-fit p-0 text-primary hover:bg-transparent"
          >
            Ver todos
            <ChevronRightIcon size={16} />
          </Button>
        </div>
        <ProductsList products={products} />
      </div>

      <div className="px-5 pt-6">
        <PromoBanner
          src="/promo_banner2.png"
          alt="Lanches a partir de R$ 17,90"
        />
      </div>
    </>
  );
}
