"use client";
import { calculateProductTotalPrice } from "@/helpers/price";
import { Prisma, Product } from "@prisma/client";
import { ReactNode, createContext, useMemo, useState } from "react";

export interface CartProduct
  extends Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: { id: true; deliveryFee: true; deliveryTimeMinutes: true };
      };
    };
  }> {
  quantity: number;
}

interface ICartContext {
  products: CartProduct[];
  subtotalPrice: number;
  totalPrice: number;
  totalDiscounts: number;
  totalQuantity: number;
  addProductToCart: (
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: { id: true; deliveryFee: true; deliveryTimeMinutes: true };
        };
      };
    }>,
    quantity: number,
    emptyCart?: boolean,
  ) => void;
  changeProductQuantity: (productId: string, type: "add" | "remove") => void;
  removeProductFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<ICartContext>({
  products: [],
  subtotalPrice: 0,
  totalPrice: 0,
  totalDiscounts: 0,
  totalQuantity: 0,
  addProductToCart: () => {},
  changeProductQuantity: () => {},
  removeProductFromCart: () => {},
  clearCart: () => {},
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

  const totalQuantity = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + product.quantity;
    }, 0);
  }, [products]);

  const totalDiscounts =
    subtotalPrice -
    totalPrice +
    Number(products[0]?.restaurant?.deliveryFee || 0);

  const clearCart = () => {
    return setProducts([]);
  };

  const addProductToCart = (
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: { id: true; deliveryFee: true; deliveryTimeMinutes: true };
        };
      };
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
        totalQuantity,
        clearCart,
        addProductToCart,
        changeProductQuantity,
        removeProductFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
