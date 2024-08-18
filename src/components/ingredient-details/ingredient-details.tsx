import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../slice/ingredientsSlice';

// Компонент, который отображает подробную информацию об ингредиенте в приложении для бургеров
export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */

  // Используем Hook, чтобы получить параметр id из текущего URL
  const { id } = useParams();
  // используем Hook, чтобы получить список ингредиентов из Redux store
  // Затем применяем метод find к этому списку, чтобы найти ингредиент с идентификатором _id, равным переменной id, которую получили из URL.
  const ingredientData = useSelector(selectIngredients).find(
    (ingredient) => ingredient._id === id
  );

  // Если данные об ингредиенте не найдены, отображаем компонент Preloader
  if (!ingredientData) {
    return <Preloader />;
  }

  // Если данные об ингредиенте найдены, отображаем компонент IngredientDetailsUI с этими данными
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
