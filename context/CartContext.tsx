import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, MenuItem } from '@/types';

interface CartState {
  items: CartItem[];
  restaurant: {
    id: string;
    name: string;
    image: string;
  } | null;
}

type CartAction =
  | {
      type: 'ADD_ITEM';
      payload: {
        menuItem: MenuItem;
        quantity: number;
        customizations: { [key: string]: string[] };
        restaurantId: string;
        restaurantName: string;
        restaurantImage: string;
      };
    }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<
  | {
      state: CartState;
      dispatch: React.Dispatch<CartAction>;
      getCartTotal: () => number;
      getCartItemCount: () => number;
    }
  | undefined
>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const {
        menuItem,
        quantity,
        customizations,
        restaurantId,
        restaurantName,
        restaurantImage,
      } = action.payload;

      // If cart has items from different restaurant, clear it
      if (state.restaurant && state.restaurant.id !== restaurantId) {
        state = { items: [], restaurant: null };
      }

      // Calculate total price including customizations
      let customizationPrice = 0;
      Object.values(customizations)
        .flat()
        .forEach((optionId) => {
          menuItem.customizations?.forEach((customization) => {
            const option = customization.options.find(
              (opt) => opt.id === optionId
            );
            if (option) customizationPrice += option.price;
          });
        });

      const totalPrice = (menuItem.price + customizationPrice) * quantity;

      const newItem: CartItem = {
        id: `${menuItem.id}-${Date.now()}`,
        menuItem,
        quantity,
        customizations,
        totalPrice,
      };

      return {
        ...state,
        items: [...state.items, newItem],
        restaurant: {
          id: restaurantId,
          name: restaurantName,
          image: restaurantImage,
        },
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity,
                totalPrice: (item.totalPrice / item.quantity) * quantity,
              }
            : item
        ),
      };
    }
    case 'CLEAR_CART':
      return {
        items: [],
        restaurant: null,
      };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    restaurant: null,
  });

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ state, dispatch, getCartTotal, getCartItemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
