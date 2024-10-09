import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from '../services/store';
import { getIngredientsApi } from '@api';

// Интерфейс состояния для ингредиентов
interface IIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

// Начальное состояние для инградиентов
export const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

// Асинхронный Thunk для получения данных ингредиентов
export const getIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

// Создаем слайс для управления состоянием ингредиентов
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    // Селекторы для получения частей состояния
    selectIngredients: (state) => state.ingredients,
    selectorLoading: (state) => state.isLoading,
    selectorIngredientsError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      // Дополнительные обработчики для асинхронных Thunks
      // Добавляем обработчик для состояния "ожидание" для Thunk getIngredients
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Добавляем обработчик для успешного выполнения Thunk getIngredients
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      // Добавляем обработчик для ошибки при выполнении Thunk getIngredients
      .addCase(getIngredients.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка в получении инградиентов';
      });
  }
});

// Экспортируем reducer и селекторы для использования в других частях приложения
export const ingredientsReducer = ingredientsSlice.reducer;
export const ingredients = ingredientsSlice.name;
export const { selectIngredients, selectorLoading, selectorIngredientsError } =
  ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
