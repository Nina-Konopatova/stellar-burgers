import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed, getErrorFeed, getFeedOrders } from '../../slice/feedSlice';

// Компонент, который используется для отображения ленты заказов
export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  // Hook для получения списка заказов
  const orders: TOrder[] = useSelector(getFeedOrders);
  // Hook для получения ошибки загрузки заказов
  const ordersError = useSelector(getErrorFeed);
  // Hook для доступа к диспатчеру Redux actions
  const dispatch = useDispatch();

  // эффект, который выполняется при каждом рендеринге компонента
  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);
  // Если есть ошибка загрузки заказов, отображаем сообщение об ошибке
  if (ordersError) {
    return (
      <p style={{ color: 'var(--colors-interface-error)' }}>{ordersError}</p>
    );
  }
  // Если пустой список заказов, отображаем Preloader
  if (!orders.length) {
    return <Preloader />;
  }

  // Если заказы успешно загружены, отображаем компонент FeedUI
  return (
    <>
      <FeedUI
        // Передаем список заказов в FeedUI
        orders={orders}
        // Функция обратного вызова, которая будет вызвана для повторной загрузки ленты заказов
        handleGetFeeds={() => {
          dispatch(fetchFeed());
        }}
      />
      <Outlet />
    </>
  );
};
