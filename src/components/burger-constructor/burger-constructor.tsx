import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  clearIngredients,
  selectIngredients
} from '../../slice/burgerConstructorSlice';
import { selectUserData } from '../../slice/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderState,
  makeOrder,
  selectOrder,
  selectOrderRequest
} from '../../slice/ordersDetailsSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(selectIngredients);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrder);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(selectUserData);

  // Обработчик клика на кнопку заказа
  const onOrderClick = () => {
    // Проверяем, есть ли в списке ингредиентов булочка и не был ли уже отправлен запрос на заказ
    // Если условие не выполняется, функция возвращается без выполнения дальнейших действий
    if (!constructorItems.bun || orderRequest) return;
    // Проверяем, есть ли данные пользователя.
    if (!userData) {
      // Если данных нет, перенаправляем пользователя на страницу входа, текущий маршрут должен быть заменен новым, а не добавлен в историю браузера
      navigate('/login', { replace: true });
      return;
    }
    const ingredientsId = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id)
    ];
    dispatch(makeOrder(ingredientsId))
      .unwrap()
      .then(() => {
        // Очищаем список ингредиентов в конструкторе бургера
        dispatch(clearIngredients());
      })
      .catch((error) => {
        console.error('Не удалось оформить заказ:', error);
      });
  };
  //Функция для закрытия модального окна
  const closeOrderModal = () => {
    // Очищаем состояние заказа
    dispatch(clearOrderState());
  };

  //Вычисление общей стоимости заказа
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      // Передаем общую стоимость заказа в UI компонент
      price={price}
      // orderRequest={orderRequest}
      // Передаем состояние запроса на заказ в UI компонент, значение false для предотвращения отображения модального окна заказа, если оно не требуется
      orderRequest={false}
      // Передаем список ингредиентов в UI компонент
      constructorItems={constructorItems}
      // Передаем данные для модального окна заказа в UI компонент
      orderModalData={orderModalData}
      // Передаем функцию  для обработки кликов по кнопке заказа в UI компонент
      onOrderClick={onOrderClick}
      // Передаем функцию для закрытия модального окна в UI компонент
      closeOrderModal={closeOrderModal}
    />
  );
};
