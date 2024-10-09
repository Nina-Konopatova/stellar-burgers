import { TOrder } from '@utils-types';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { selectOrderByNumberApi, orderBurgerApi } from '@api';

// Интерфейс состояния для описания состояния заказа
interface IOrderDetailsState {
  order: TOrder | null;
  orderRequest: boolean;
  errorDetailsOrder: string | null;
  errorMakeOrder: string | null;
}

// Начальное состояние для заказа
export const initialState: IOrderDetailsState = {
  order: null,
  orderRequest: false,
  errorDetailsOrder: null,
  errorMakeOrder: null
};

// Создаем асинхронный Thunk для получения деталей заказа
export const getDetailsOrder = createAsyncThunk(
  'order/getDetailsOrder',
  async (numberOrder: number, { dispatch }) => {
    dispatch(clearOrderState());
    return selectOrderByNumberApi(numberOrder);
  }
);

// Создаем асинхронный Thunk для создания нового заказа
export const makeOrder = createAsyncThunk(
  'order/makeOrder',
  async (data: string[], { dispatch }) => {
    dispatch(clearOrderState());
    const dataOrder = await orderBurgerApi(data);
    return dataOrder;
  }
);

// Создаем слайс для управления состоянием заказа
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.order = null;
      state.errorDetailsOrder = null;
      state.errorMakeOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Дополнительные обработчики для асинхронных Thunks

      // Обработчик для состояния "ожидание" для Thunk getDetailsOrder
      .addCase(getDetailsOrder.pending, (state) => {
        state.errorDetailsOrder = null;
        state.orderRequest = true;
      })
      // Обработчик для успешного выполнения Thunk getDetailsOrder
      .addCase(getDetailsOrder.fulfilled, (state, action) => {
        state.order = action.payload.orders[0];
        state.orderRequest = false;
      })
      // Обработчик для ошибки при выполнении Thunk getDetailsOrder
      .addCase(getDetailsOrder.rejected, (state) => {
        state.errorDetailsOrder = 'Ошибка получения деталей заказа';
        state.orderRequest = false;
      })
      // Обработчики состояний для создания нового заказа
      .addCase(makeOrder.pending, (state) => {
        state.errorMakeOrder = null;
        state.orderRequest = true;
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(makeOrder.rejected, (state) => {
        state.errorMakeOrder = 'Make order Error';
        state.orderRequest = false;
      });
  }
});

// Создает селектор для выбора заказа и флага заявки на заказ из состояния
export const selectOrder = createSelector(
  (state: { orderDetail: IOrderDetailsState }) => state.orderDetail,
  (orderDetail) => orderDetail.order
);
export const selectOrderRequest = createSelector(
  (state: { orderDetail: IOrderDetailsState }) => state.orderDetail,
  (orderRequest) => orderRequest.order
);

// Экспорт действия, reducer и имя slice
export const { clearOrderState } = orderSlice.actions;
export const orderDetailsReducer = orderSlice.reducer;
export const orderDetail = orderSlice.name;

export default orderSlice.reducer;
