import { calculateProductTotalPrice, formatCurrency } from "@/helpers/price";
import { db } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductImage from "../_components/product-image";
import DiscountBadge from "@/components/discount-badge";
import ProductDetails from "../_components/product-details";

interface ProductsPage {
  params: { id: string };
}

const ProductsPage = async ({ params: { id } }: ProductsPage) => {
  const product = await db.product.findUnique({
    where: { id },
    include: { restaurant: true },
  });

  const juices = await db.product.findMany({
    where: {
      category: {
        name: "Sucos",
      },
      restaurant: {
        id: product?.restaurant.id,
      },
    },
    include: { restaurant: true },
  });

  if (!product) {
    return notFound();
  }

  return (
    <div>
      <ProductImage product={product} />

      <ProductDetails product={product} complementaryProducts={juices} />
    </div>
  );
};

export default ProductsPage;
