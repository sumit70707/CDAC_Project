import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addItemToCart, getCartItems, updateCartItemQuantity, removeItemFromCart as removeApi } from '../services/cartService';

const initialState = {
  cartItems: [], // Array of products { id, name, price, qty... }
  totalQuantity: 0,
  totalAmount: 0,
};

// ASYNC THUNKS - Defined BEFORE the slice
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const items = await getCartItems();
    // Backend returns List<CartItemResponseDto>: { productId, productName, productImage, priceSnapshot, quantity }
    // We need to map it to our internal structure: { id, name, imageUrl, price, quantity, totalPrice }
    return items.map(item => ({
      id: item.productId,
      name: item.productName,
      imageUrl: item.productImage,
      price: item.priceSnapshot,
      quantity: item.quantity,
      totalPrice: item.priceSnapshot * item.quantity
    }));
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const addToCartServer = createAsyncThunk('cart/addServer', async (product, { dispatch, getState }) => {
  // Optimistic Update
  dispatch(addToCart(product));

  const { auth } = getState();
  if (auth.isAuthenticated) {
    try {
      await addItemToCart(product.id, product.quantity || 1);
    } catch (error) {
      console.error("Failed to sync add to cart", error);
      // Optionally rollback
    }
  }
});

export const removeCartServer = createAsyncThunk('cart/removeServer', async (id, { dispatch, getState }) => {
  // Optimistic Update
  dispatch(removeFromCart(id));

  const { auth } = getState();
  if (auth.isAuthenticated) {
    try {
      const state = getState();
      const item = state.cart.cartItems.find(i => i.id === id);

      if (!item) {
        // Item completely removed
        await removeApi(id);
      } else {
        // Item still there, update quantity
        await updateCartItemQuantity(id, item.quantity);
      }
    } catch (error) {
      console.error("Failed to sync remove cart", error);
    }
  }
});

export const deleteCartServer = createAsyncThunk('cart/deleteServer', async (id, { dispatch, getState }) => {
  dispatch(deleteItem(id));
  const { auth } = getState();
  if (auth.isAuthenticated) {
    try {
      await removeApi(id);
    } catch (error) { console.error(error); }
  }
});

// SLICE DEFINITION
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(item => item.id === newItem.id);

      const qtyToAdd = newItem.quantity || 1;

      state.totalQuantity += qtyToAdd;

      if (!existingItem) {
        // New item, push to array
        state.cartItems.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          imageUrl: newItem.imageUrl,
          quantity: qtyToAdd,
          totalPrice: newItem.price * qtyToAdd
        });
      } else {
        // Item exists, just increase quantity
        existingItem.quantity += qtyToAdd;
        existingItem.totalPrice = existingItem.totalPrice + (newItem.price * qtyToAdd);
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

    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;
        state.cartItems = state.cartItems.filter(item => item.id !== id);
      }
    },

    setCart: (state, action) => {
      // expect action.payload to be array of items in internal format
      const items = action.payload;
      state.cartItems = items;
      state.totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
      state.totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cartItems = action.payload;
      state.totalQuantity = action.payload.reduce((acc, item) => acc + item.quantity, 0);
      state.totalAmount = action.payload.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    });
  }
});

export const { addToCart, removeFromCart, deleteItem, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;