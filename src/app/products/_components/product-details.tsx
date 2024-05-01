"use client";
import DiscountBadge from "@/components/discount-badge";
import ProductList from "@/components/product-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, calculateProductTotalPrice } from "@/helpers/price";
import { Prisma } from "@prisma/client";
import {
  BikeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TimerIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true;
          imageUrl: true;
          deliveryFee: true;
          deliveryTimeMinutes: true;
        };
      };
    };
  }>;
  complementaryProducts: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>[];
}

const ProductDetails = ({
  product,
  complementaryProducts,
}: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev: number) => prev - 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev: number) => prev + 1);
  };

  return (
    <div className="relative z-10 -mt-6 rounded-tl-3xl rounded-tr-3xl bg-white py-5 ">
      <section className="px-5">
        <div className="flex items-center gap-[0.375rem] ">
          <Image
            src={product.restaurant.imageUrl}
            alt={product.restaurant.name}
            width={0}
            height={0}
            className="h-6 w-6 rounded-full object-cover"
            quality={100}
          />
          <span className="text-xs">{product.restaurant.name}</span>
        </div>
        <h1 className="mb-2 mt-1 text-xl font-semibold">{product.name}</h1>
        <div className="flex justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                Por: {formatCurrency(calculateProductTotalPrice(product))}
              </h2>
              <DiscountBadge product={product} />
            </div>
            {product.discountPercentage > 0 && (
              <p className="text-sm text-muted-foreground">
                De: {formatCurrency(Number(product.price))}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant={quantity > 1 ? "default" : "ghost"}
              className={
                quantity <= 1
                  ? `border border-solid border-muted-foreground`
                  : ""
              }
              onClick={decrementQuantity}
            >
              <ChevronLeftIcon />
            </Button>
            <span className="w-4 text-center">{quantity}</span>
            <Button size="icon" onClick={incrementQuantity}>
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
        <Card className="mt-6 flex justify-around py-3">
          <div className="text-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Entrega</span>
              <BikeIcon size={14} />
            </div>
            {Number(product.restaurant.deliveryFee) > 0 ? (
              <p className="text-xs font-semibold">
                {formatCurrency(Number(product.restaurant.deliveryFee))}
              </p>
            ) : (
              <p className="text-xs font-semibold">Grátis</p>
            )}
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Entrega</span>
              <TimerIcon size={14} />
            </div>
            <p className="text-xs font-semibold">
              {product.restaurant.deliveryTimeMinutes} min
            </p>
          </div>
        </Card>
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold">Sobre</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
      </section>

      <div className="mt-6 space-y-3">
        <h3 className="px-5 font-semibold">Sucos</h3>

        <ProductList products={complementaryProducts} />
      </div>
    </div>
  );
};

export default ProductDetails;
