"use client";
import Cart from "@/components/cart";
import DeliveryInfo from "@/components/delivery-info";
import DiscountBadge from "@/components/discount-badge";
import ProductList from "@/components/product-list";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CartContext } from "@/contexts/cart";
import { formatCurrency, calculateProductTotalPrice } from "@/helpers/price";
import { Prisma } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addProductToCart, products } = useContext(CartContext);

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev: number) => prev - 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev: number) => prev + 1);
  };

  const addToCart = ({ emptyCart }: { emptyCart?: boolean }) => {
    addProductToCart({ product: { ...product, quantity }, emptyCart });
    setIsCartOpen(true);
  };

  const handleAddToCartClick = () => {
    const hasDifferentRestaurantProduct = products.some(
      (cartProduct) => cartProduct.restaurantId !== product.restaurantId,
    );

    if (hasDifferentRestaurantProduct) {
      return setIsConfirmationDialogOpen(true);
    }

    addToCart({ emptyCart: false });
  };

  return (
    <>
      <div className="relative z-10 -mt-6 rounded-tl-3xl rounded-tr-3xl bg-white py-5 ">
        <section className="px-5">
          <div className="flex items-center gap-[0.375rem] ">
            <Image
              src={product.restaurant.imageUrl}
              alt={product.restaurant.name}
              width={0}
              height={0}
              className="size-6 rounded-full object-cover"
              quality={100}
            />
            <span className="text-xs">{product.restaurant.name}</span>
          </div>

          <h1 className="my-1 text-xl font-semibold">{product.name}</h1>

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
          <DeliveryInfo restaurant={product.restaurant} />
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold">Sobre</h3>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>
        </section>

        <div className="mt-6 space-y-3">
          <h3 className="px-5 font-semibold">Sucos</h3>
          <ProductList products={complementaryProducts} />
        </div>
        <div className="mt-6 px-5">
          <Button
            className="w-full font-semibold"
            onClick={handleAddToCartClick}
          >
            Adicionar à sacola
          </Button>
        </div>
      </div>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-[90vw]">
          <SheetHeader>
            <SheetTitle className="text-left">Sacola</SheetTitle>
          </SheetHeader>
          <Cart setIsOpen={setIsCartOpen} />
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Você só pode adicionar itens de uma restaurante por vez
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Tem certeza que deseja adicionar este item? Isto limpará a sua
              sacola atual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => addToCart({ emptyCart: true })}>
              Esvaziar sacola e adicionar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductDetails;
