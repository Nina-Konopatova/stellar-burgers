import { TConstructorIngredient, TIngredient } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Интерфейс для состояния конструктора бургера
export interface IConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

// Начальное состояние для конструктора бургера
export const initialState: IConstructorState = {
  bun: null,
  ingredients: []
};

// Слайс для управления состоянием конструктора бургера
const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredients: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        // Проверяем, является ли добавляемый ингредиент булкой
        if (action.payload.type === 'bun') {
          // Если добавляется булка, обновляем свойство bun в состоянии
          state.bun = action.payload;
        } else {
          // Иначе, если добавляемый ингредиент не является булкой, добавляем ингредиент к концу массива ingredients
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        // Создаем уникальный идентификатор для ингредиента
        const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
          /[xy]/g,
          function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
        // Возвращаем объект payload с модифицированным ингредиентом, включая новый уникальный идентификатор
        return { payload: { ...ingredient, id } };
      }
    },
    // Редьюсер для изменения порядка ингредиентов в конструкторе бургеров
    changeIngredientsOrder: (state, action) => {
      const initialElement = state.ingredients[action.payload.initialIndex];
      state.ingredients[action.payload.initialIndex] =
        state.ingredients[action.payload.finishIndex];
      state.ingredients[action.payload.finishIndex] = initialElement;
    },
    // reducer для удаления ингредиентов из конструктора бургера
    removeIngredients: (state, action) => {
      state.ingredients = state.ingredients.filter(
        // фильтруем элементы массива, оставляя только те, у которых идентификатор (id) не совпадает с идентификатором,
        // переданным в action.payload. Это позволяет удалить ингредиент с указанным идентификатором из списка ингредиентов.
        (item) => item.id !== action.payload
      );
    },
    // Редьюсер для очистки конструктора
    clearIngredients: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  // Селектор для получения ингредиентов из конструктора
  selectors: {
    selectIngredients: (state) => state
  }
});

// Экспорт частей slice для использования в других частях приложения
export const burgerConstructorReducer = burgerConstructorSlice.reducer;
export const burgerConstructor = burgerConstructorSlice.name;
export const {
  addIngredients,
  changeIngredientsOrder,
  removeIngredients,
  clearIngredients
} = burgerConstructorSlice.actions;
export const { selectIngredients } = burgerConstructorSlice.selectors;
export const BurgerConstructorActions = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
