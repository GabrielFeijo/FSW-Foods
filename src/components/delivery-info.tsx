import { formatCurrency } from "@/helpers/price";
import { BikeIcon, TimerIcon } from "lucide-react";
import React from "react";
import { Card } from "./ui/card";
import { Restaurant } from "@prisma/client";

interface DeLiveryInfoProps {
  restaurant: Pick<Restaurant, "deliveryFee" | "deliveryTimeMinutes">;
}

const DeliveryInfo = ({ restaurant }: DeLiveryInfoProps) => {
  return (
    <Card className="mt-6 flex justify-around py-3">
      <div className="text-center">
        <div className="flex items-center gap-1 text-muted-foreground">
          <span>Entrega</span>
          <BikeIcon size={14} />
        </div>
        {Number(restaurant.deliveryFee) > 0 ? (
          <p className="text-xs font-semibold">
            {formatCurrency(Number(restaurant.deliveryFee))}
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
          {restaurant.deliveryTimeMinutes} min
        </p>
      </div>
    </Card>
  );
};

export default DeliveryInfo;
