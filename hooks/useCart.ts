import { create } from "zustand";

type CartItem = { _id: string; name: string; price: number; quantity: number };

type CartState = {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (_id: string) => void;
  updateQuantity: (_id: string, quantity: number) => void;
};

export const useCart = create<CartState>(set => ({
  items: [],
  addItem: (product) => set(state => {
    const exist = state.items.find(i => i._id === product._id);
    if (exist) {
      return { items: state.items.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i) };
    }
    return { items: [...state.items, { ...product, quantity: 1 }] };
  }),
  removeItem: (_id) => set(state => ({ items: state.items.filter(i => i._id !== _id) })),
  updateQuantity: (_id, quantity) => set(state => ({
    items: state.items.map(i => i._id === _id ? { ...i, quantity } : i)
  })),
}));
