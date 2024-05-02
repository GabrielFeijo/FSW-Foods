import { CartContext, CartProduct } from "@/contexts/cart";
import { calculateProductTotalPrice, formatCurrency } from "@/helpers/price";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useContext } from "react";

interface CartItemProps {
  cartProduct: CartProduct;
}

const CartItem = ({ cartProduct }: CartItemProps) => {
  const { changeProductQuantity, removeProductFromCart } =
    useContext(CartContext);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative size-20">
          <Image
            src={cartProduct.imageUrl}
            alt={cartProduct.name}
            className="rounded-lg object-cover"
            quality={100}
            fill
          />
        </div>
        <div className="space-y-1 ">
          <h3 className="text-xs">{cartProduct.name}</h3>

          <div className="flex items-center gap-1">
            <h4 className="text-sm font-semibold">
              {formatCurrency(
                calculateProductTotalPrice({
                  ...cartProduct,
                  price: (Number(cartProduct.price) *
                    cartProduct.quantity) as any,
                }),
              )}
            </h4>

            {cartProduct.discountPercentage > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(
                  Number(cartProduct.price) * cartProduct.quantity,
                )}
              </span>
            )}
          </div>

          <div className="flex items-center">
            <div className="flex flex-1 items-center justify-between gap-2">
              <Button
                size="icon"
                variant={cartProduct.quantity > 1 ? "default" : "ghost"}
                className={`size-8 disabled:cursor-not-allowed ${
                  cartProduct.quantity <= 1 &&
                  `border border-solid border-muted-foreground`
                }`}
                onClick={() => changeProductQuantity(cartProduct.id, "remove")}
                disabled={cartProduct.quantity <= 1}
              >
                <ChevronLeftIcon />
              </Button>
              <span className="text-sm">{cartProduct.quantity}</span>
              <Button
                className="size-8"
                size="icon"
                onClick={() => changeProductQuantity(cartProduct.id, "add")}
              >
                <ChevronRightIcon size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="size-8 border border-solid bg-transparent"
        onClick={() => removeProductFromCart(cartProduct.id)}
      >
        <TrashIcon size={18} />
      </Button>
    </div>
  );
};

export default CartItem;
