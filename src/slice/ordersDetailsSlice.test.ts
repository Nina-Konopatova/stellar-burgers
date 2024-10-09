import { TOrder } from '@utils-types';
import orderReducer, {
  getDetailsOrder,
  initialState
} from '../slice/ordersDetailsSlice';
import { configureStore } from '@reduxjs/toolkit';
import * as api from '@api';

// Мокируем вызов API
jest.mock('@api');
// мокируем асинхронный Thunk для получения заказов пользователя
const mockGetOrderByNumberApi =
  api.selectOrderByNumberApi as jest.MockedFunction<
    typeof api.selectOrderByNumberApi
  >;

// Вспомогательная функция для создания стора
const createOrderSliceTestStore = () =>
  configureStore({
    reducer: {
      order: orderReducer
    }
  });

const mockOrder: TOrder = {
  _id: 'order-id',
  status: 'done',
  name: '',
  createdAt: '',
  updatedAt: '',
  number: 2,
  ingredients: []
};

describe('тестируем orderSlice', () => {
  // очистка моков перед каждым тестом
  beforeEach(() => {
    mockGetOrderByNumberApi.mockReset();
  });

  describe('reducer', () => {
    test('вернуть начальное состояние', () => {
      expect(orderReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });

    // тестирование состояния "ожидание" для действия getDetailsOrder
    // проверяем, что в состоянии появляется флаг ожидания запроса и нет ошибки.
    test('тестируем getDetailsOrder.pending', () => {
      const action = { type: getDetailsOrder.pending.type };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orderRequest: true,
        errorDetailsOrder: null
      });
    });

    test('тестируем getDetailsOrder.fulfilled', () => {
      const action = {
        type: getDetailsOrder.fulfilled.type,
        payload: { orders: [mockOrder] }
      };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        order: action.payload.orders[0],
        orderRequest: false
      });
    });

    test('тестируем getDetailsOrder.rejected', () => {
      const action = { type: getDetailsOrder.rejected.type };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orderRequest: false,
        errorDetailsOrder: 'Ошибка получения деталей заказа'
      });
    });
  });

  describe('тестируем асинхронные Thunk', () => {
    beforeEach(() => {
      mockGetOrderByNumberApi.mockReset();
    });

    test('тестируем успешное выполнение getDetailsOrder', async () => {
      mockGetOrderByNumberApi.mockResolvedValue({
        success: true,
        orders: [mockOrder]
      });
      const store = createOrderSliceTestStore();
      await store.dispatch(getDetailsOrder(123) as any);
      const state = store.getState().order;
      expect(state.order).toEqual(mockOrder);
      expect(state.orderRequest).toBe(false);
    });

    test('тестируем ошибку в выполнении getDetailsOrder', async () => {
      mockGetOrderByNumberApi.mockRejectedValue(new Error('Failed to fetch'));
      const store = createOrderSliceTestStore();
      await store.dispatch(getDetailsOrder(123) as any);
      const state = store.getState().order;
      expect(state.order).toBeNull();
      expect(state.orderRequest).toBe(false);
      expect(state.errorDetailsOrder).toBe('Ошибка получения деталей заказа');
    });
  });
});
