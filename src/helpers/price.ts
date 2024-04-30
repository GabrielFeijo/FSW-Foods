import { Product } from "@prisma/client";

export const calculateProductTotalPrice = (product: Product): number => {
  if (product.discountPercentage === 0) {
    return Number(product.price);
  }

  const discount = Number(product.price) * (product.discountPercentage / 100);

  return Number(product.price) - discount;
};

export const formatCurrency = (value: number) => {
  return Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    style: "currency",
    currency: "BRL",
  }).format(value);
};
