import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addIngredients } from '../../slice/burgerConstructorSlice';
import { useDispatch } from '../../services/store';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    // Используем Hook для получения текущего пути в маршрутизаторе React Router DOM, чтобы передать его в состояние при навигации
    const location = useLocation();
    // Инициализируем экземпляр диспетчера Redux с помощью Hook useDispatch для отправки действий в стор
    const dispatch = useDispatch();
    // Обработчик добавления ингредиента в список
    const handleAdd = () => {
      // отправляет действие addIngredients в Redux store, передавая ему ингредиент, который нужно добавить
      dispatch(addIngredients(ingredient));
    };

    return (
      <BurgerIngredientUI
        // Передаем ингредиент в UI компонент
        ingredient={ingredient}
        // Передаем количество ингредиента в UI компонент
        count={count}
        // Передаем состояние локации в UI компонент, для использования в модальном окне заказа
        locationState={{ background: location }}
        // Передаем функцию в UI компонент для добавления ингредиента
        handleAdd={handleAdd}
      />
    );
  }
);
