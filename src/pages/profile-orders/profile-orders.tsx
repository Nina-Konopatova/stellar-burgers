import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import {
  getUserOrders,
  selectUserOrdersError,
  selectUserOrdersList
} from '../../slice/userOrderSlice';
import { useDispatch, useSelector } from '../../services/store';

// Компонент, который используется для отображения списка заказов пользователя
export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectUserOrdersList);
  const error = useSelector(selectUserOrdersError);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  // Если список заказов пуст, отображаем прелоадер
  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <>
      {error ? (
        <p style={{ color: 'var(--colors-interface-error)' }}>error</p>
      ) : (
        <ProfileOrdersUI orders={orders} />
      )}
    </>
  );
};
