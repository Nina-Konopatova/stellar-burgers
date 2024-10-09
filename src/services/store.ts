import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { feedReducer } from '../slice/feedSlice';
import { userOrdersReducer } from '../slice/userOrderSlice';
import { authUserReducer } from '../slice/userSlice';
import { orderDetailsReducer } from '../slice/ordersDetailsSlice';
import { ingredientsReducer } from '../slice/ingredientsSlice';
import { burgerConstructorReducer } from '../slice/burgerConstructorSlice';

// объединение нескольких reducers  в один объект
export const rootReducer = combineReducers({
  feed: feedReducer,
  userOrders: userOrdersReducer,
  authUser: authUserReducer,
  orderDetail: orderDetailsReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
