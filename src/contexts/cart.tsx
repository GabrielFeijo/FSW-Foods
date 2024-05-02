"use client";
import { calculateProductTotalPrice } from "@/helpers/price";
import { Prisma, Product } from "@prisma/client";
import { ReactNode, createContext, useMemo, useState } from "react";

export interface CartProduct
  extends Prisma.ProductGetPayload<{
    include: { restaurant: { select: { deliveryFee: true } } };
  }> {
  quantity: number;
}

interface ICartContext {
  products: CartProduct[];
  subtotalPrice: number;
  totalPrice: number;
  totalDiscounts: number;
  addProductToCart: (
    product: Prisma.ProductGetPayload<{
      include: { restaurant: { select: { deliveryFee: true } } };
    }>,
    quantity: number,
    emptyCart?: boolean,
  ) => void;
  changeProductQuantity: (productId: string, type: "add" | "remove") => void;
  removeProductFromCart: (productId: string) => void;
}

export const CartContext = createContext<ICartContext>({
  products: [],
  subtotalPrice: 0,
  totalPrice: 0,
  totalDiscounts: 0,
  addProductToCart: () => {},
  changeProductQuantity: () => {},
  removeProductFromCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);

  const subtotalPrice = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + Number(product.price) * product.quantity;
    }, 0);
  }, [products]);

  const totalPrice = useMemo(() => {
    return (
      products.reduce((acc, product) => {
        return (
          acc +
          calculateProductTotalPrice({
            ...product,
            price: (Number(product.price) * product.quantity) as any,
          })
        );
      }, 0) + Number(products[0]?.restaurant?.deliveryFee || 0)
    );
  }, [products]);

  const totalDiscounts = subtotalPrice - totalPrice;

  const addProductToCart = (
    product: Prisma.ProductGetPayload<{
      include: { restaurant: { select: { deliveryFee: true } } };
    }>,
    quantity: number,
    emptyCart?: boolean,
  ) => {
    if (emptyCart) {
      return setProducts([{ ...product, quantity: quantity }]);
    }

    const isProductAlreadyInCart = products.some(
      (cartProduct) => cartProduct.id === product.id,
    );

    if (isProductAlreadyInCart) {
      return setProducts((prev) =>
        prev.map((cartProduct) =>
          cartProduct.id === product.id
            ? { ...cartProduct, quantity: cartProduct.quantity + quantity }
            : cartProduct,
        ),
      );
    }

    setProducts((prev) => [...prev, { ...product, quantity: quantity }]);
  };

  const changeProductQuantity = (productId: string, type: "add" | "remove") => {
    const newQuantity = type === "add" ? +1 : -1;
    return setProducts((prev) =>
      prev.map((cartProduct) =>
        cartProduct.id === productId
          ? { ...cartProduct, quantity: cartProduct.quantity + newQuantity }
          : cartProduct,
      ),
    );
  };

  const removeProductFromCart = (productId: string) => {
    return setProducts((prev) =>
      prev.filter((cartProduct) => cartProduct.id !== productId),
    );
  };

  return (
    <CartContext.Provider
      value={{
        products,
        subtotalPrice,
        totalPrice,
        totalDiscounts,
        addProductToCart,
        changeProductQuantity,
        removeProductFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
