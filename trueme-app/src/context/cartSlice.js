import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [], // Array of products { id, name, price, qty... }
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(item => item.id === newItem.id);

      state.totalQuantity++;

      if (!existingItem) {
        // New item, push to array
        state.cartItems.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          image_url: newItem.image_url,
          quantity: 1,
          totalPrice: newItem.price
        });
      } else {
        // Item exists, just increase quantity
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }

      // Update total cart amount
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity, 0
      );
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id);

      if (existingItem) {
        state.totalQuantity--;
        state.totalAmount = state.totalAmount - existingItem.price;

        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter(item => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
        }
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    }
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;