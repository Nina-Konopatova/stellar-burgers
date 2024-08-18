import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Интерфейс состояния  для ленты заказа
export interface IFeedState {
  orders: TOrder[];
  // свойство, хранит общее количество заказа
  total: number | null;
  // свойство, хранит количество заказов сегодня
  totalToday: number | null;
  // свойство, хранит информацию об ошибке, если она произошла при получении данных
  error: string | null;
}

// Начальное состояние для ленты заказа
const initialState: IFeedState = {
  orders: [],
  total: null,
  totalToday: null,
  error: null
};

// Создаем асинхронный Thunk для получения данных о ленте заказов
export const fetchFeed = createAsyncThunk('feed/fetchFeed', async () => {
  const response = await getFeedsApi();
  return response;
});

// Слайс для управления состоянием ленты заказов
export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    // Селекторы для получения частей состояния
    getFeedState: (state) => state,
    getFeedOrders: (state) => state.orders,
    getErrorFeed: (state) => state.error
  },
  extraReducers: (builder) => {
    // Дополнительные обработчики для асинхронных Thunk
    builder
      .addCase(fetchFeed.pending, (state) => {
        // Обработчик для состояния "ожидание"
        state.orders = [];
        state.total = null;
        state.totalToday = null;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        // Обработчик для успешного выполнения Thunk fetchFeed
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state) => {
        // Обработчик для ошибки при выполнении Thunk fetchFeed
        state.error = 'Ошибка в листе заказов';
      });
  }
});

// Экспортируем редьюсер и селекторы
export const feedReducer = feedSlice.reducer;
export const feed = feedSlice.name;
export const { getFeedState, getFeedOrders, getErrorFeed } =
  feedSlice.selectors;
