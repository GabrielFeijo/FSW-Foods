"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartContext } from "@/contexts/cart";
import { formatCurrency } from "@/helpers/price";
import { OrderStatus, Prisma } from "@prisma/client";
import { ChevronRight, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

interface OrderItemProps {
  order: Prisma.OrderGetPayload<{
    include: {
      restaurant: true;
      products: { include: { product: true } };
    };
  }>;
}

const getOrderStatus = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.CANCELED:
      return "Cancelado";
    case OrderStatus.COMPLETED:
      return "Entregue";
    case OrderStatus.CONFIRMED:
      return "Confirmado";
    case OrderStatus.DELIVERING:
      return "Em trânsito";
    case OrderStatus.PREPARING:
      return "Preparando";
    default:
      return "Pendente";
  }
};

const OrderItem = ({ order }: OrderItemProps) => {
  const { addProductToCart } = useContext(CartContext);
  const router = useRouter();

  const handleRedoOrderClick = () => {
    for (const orderProduct of order.products) {
      addProductToCart(
        { ...orderProduct.product, restaurant: order.restaurant },
        orderProduct.quantity,
      );
    }
    router.push(`/restaurants/${order.restaurantId}`);
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div
          className={`w-fit rounded-full bg-[#EEE] px-2 py-1 ${order.status !== OrderStatus.COMPLETED && "bg-green-500 text-white"}`}
        >
          <span className="block text-xs font-semibold">
            {getOrderStatus(order.status)}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={order.restaurant.imageUrl} />
            </Avatar>

            <span className="text-sm font-semibold">
              {order.restaurant.name}
            </span>
          </div>

          <Button
            variant="link"
            size="icon"
            className="size-5 text-black"
            asChild
          >
            <Link href={`/restaurants/${order.restaurantId}`}>
              <ChevronRightIcon />
            </Link>
          </Button>
        </div>

        <Separator className="my-3" />

        <div className="space-y-2">
          {order.products.map((product) => (
            <div className="flex items-center gap-2" key={product.id}>
              <div className="flex size-5 items-center justify-center rounded-full bg-muted-foreground">
                <span className="block text-xs text-white">
                  {product.quantity}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {product.product.name}
              </span>
            </div>
          ))}
        </div>

        <Separator className="my-3" />

        <div className="flex items-center justify-between">
          <p className="text-sm">{formatCurrency(Number(order.totalPrice))}</p>

          <Button
            variant="ghost"
            className="text-xs text-primary"
            size="sm"
            disabled={order.status !== OrderStatus.COMPLETED}
            onClick={handleRedoOrderClick}
          >
            Refazer pedido
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItem;
