import { CartContext } from "@/contexts/cart";
import { useContext } from "react";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "@/helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const Cart = () => {
  const { products, subtotalPrice, totalPrice, totalDiscounts } =
    useContext(CartContext);

  return (
    <div className="flex h-full flex-col justify-between   py-5">
      <div className="space-y-4">
        {products.map((product) => (
          <CartItem key={product.id} cartProduct={product} />
        ))}
      </div>

      <div>
        <Card>
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between text-xs ">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>{formatCurrency(subtotalPrice)}</span>
            </div>
            <Separator />

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Descontos:</span>
              <span>-{formatCurrency(totalDiscounts)}</span>
            </div>
            <Separator />

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Entrega:</span>

              {Number(products[0].restaurant.deliveryFee) === 0 ? (
                <span className="uppercase text-primary">Grátis</span>
              ) : (
                <span>
                  {formatCurrency(Number(products[0].restaurant.deliveryFee))}
                </span>
              )}
            </div>
            <Separator />

            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Total:</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </CardContent>
        </Card>

        <Button className="mt-6 w-full">Finalizar pedido</Button>
      </div>
    </div>
  );
};

export default Cart;
