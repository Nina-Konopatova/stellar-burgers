import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { getFeedState } from '../../slice/feedSlice';
import { useSelector } from '../../services/store';

// Функция, которая фильтрует массив заказов orders по статусу status и возвращает первые 20 номеров заказов
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

// компонент, который отображает информацию о заказах в приложении для бургеров
export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  // Hook  для получения состояния из Redux store
  const { orders, total, totalToday } = useSelector(getFeedState);
  // Объект, который содержит общие данные о количестве заказов и количестве заказов за сегодня
  const feed = { total, totalToday };

  // Вызываем функцию getOrders, чтобы получить номера выполненных заказов
  const readyOrders = getOrders(orders, 'done');

  // Вызываем функцию getOrders, чтобы получить номера заказов в ожидании выполнения
  const pendingOrders = getOrders(orders, 'pending');

  return (
    // UI-компонент для представления информации о заказах
    <FeedInfoUI
      // передает массив номеров выполненных заказов в UI-компонент
      readyOrders={readyOrders}
      // передает массив номеров заказов в ожидании выполнения
      pendingOrders={pendingOrders}
      // передает объект с общими данными о заказах
      feed={feed}
    />
  );
};
