import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  changeIngredientsOrder,
  removeIngredients
} from '../../slice/burgerConstructorSlice';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch(); // Инициализация экземпляра диспетчера Redux
    // Функция для перемещения ингредиента вниз
    const handleMoveDown = () => {
      dispatch(
        // отправляет действие changeIngredientsOrder с объектом параметров, указывающим начальный и конечный индексы для перемещения ингредиента
        changeIngredientsOrder({ initialIndex: index, finishIndex: index + 1 })
      );
    };

    // Функция для перемещения ингредиента вверх
    const handleMoveUp = () => {
      dispatch(
        changeIngredientsOrder({ initialIndex: index, finishIndex: index - 1 })
      );
    };

    // Функция для удаления ингредиента из конструктора
    const handleClose = () => {
      dispatch(removeIngredients(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
