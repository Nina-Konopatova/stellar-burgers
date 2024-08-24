import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../slice/ingredientsSlice';

const maxIngredients = 6;

// компонент, который отображает карточку заказа в приложении для бургеров.
export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  // Hook  для получения текущего URL-адреса
  const location = useLocation();

  /** TODO: взять переменную из стора */
  // Hook для получения списка ингредиентов из Redux store
  // Затем применяем метод filter к этому списку, чтобы оставить только те ингредиенты, которые присутствуют в заказе.
  const ingredients: TIngredient[] = useSelector(selectIngredients).filter(
    (ingredient) => order.ingredients.includes(ingredient._id)
  );

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    // Создание списка ингредиентов, которые входят в заказ
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    // Для вычисления общей стоимости ингредиентов, входящих в заказ
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    // для создания подмножества ингредиентов, которые будут отображены в карточке заказа
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    // для подсчета количества ингредиентов, которые не были отображены в карточке заказа
    // из-за ограничения на максимальное количество ингредиентов
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;
    // переменная date используется для преобразования даты создания заказа order.createdAt в объект Date
    const date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      // передаем информацию о заказе в UI-компонент
      orderInfo={orderInfo}
      // Передаем максимальное количество ингредиентов, которые могут быть отображены в UI-компонент
      maxIngredients={maxIngredients}
      // Передаем состояние с ключом, который содержит текущий URL в UI-компонент
      locationState={{ background: location }}
    />
  );
});
