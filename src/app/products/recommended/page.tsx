import Header from "@/components/header";
import ProductItem from "@/components/product-item";
import RestaurantItem from "@/components/restaurant-item";
import { db } from "@/lib/prisma";

const RecommendedProductsPage = async () => {
  const products = await db.product.findMany({
    include: {
      restaurant: { select: { name: true } },
    },
  });

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold">Pedidos Recomendados</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              className="min-w-full"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RecommendedProductsPage;
