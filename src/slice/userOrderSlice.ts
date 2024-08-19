import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Интерфейс состояния пользовательских заказов
export interface IOrderUserState {
  orders: TOrder[];
  error: string | null;
}

// Начальное состояние для пользовательских заказов
const initialState: IOrderUserState = {
  orders: [],
  error: null
};

// Создание асинхронного Thunk для получения заказов пользователя
export const getUserOrders = createAsyncThunk(
  'userOrders/getUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

// Создание slice для управления состоянием пользовательских заказов
const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  selectors: {
    selectUserOrdersList: (state) => state.orders,
    selectUserOrdersError: (state) => state.error
  },
  extraReducers: (builder) => {
    // Дополнительные обработчики для асинхронных Thunks
    builder
      // Добавление обработчика для состояния "ожидание" для Thunk getUserOrders
      .addCase(getUserOrders.pending, (state) => {
        state.orders = [];
        state.error = null;
      })
      // Добавление обработчика для успешного выполнения Thunk getUserOrders
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      // Добавление обработчика для ошибки при выполнении Thunk getUserOrders
      .addCase(getUserOrders.rejected, (state) => {
        state.error = 'Ошибка в истории заказов';
      });
  }
});

// Экспортируем reducer, имя slice и селекторы для использования в других частях приложения
export const userOrdersReducer = userOrdersSlice.reducer;
export const userOrders = userOrdersSlice.name;
export const { selectUserOrdersList, selectUserOrdersError } =
  userOrdersSlice.selectors;
