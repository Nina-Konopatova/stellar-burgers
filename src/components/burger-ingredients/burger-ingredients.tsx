import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import {
  selectorIngredientsError,
  selectIngredients
} from '../../slice/ingredientsSlice';

export const BurgerIngredients: FC = () => {
  /** TODO: взять переменные из стора */
  // Получение списка ингредиентов из Redux store
  const burgerIngredients = useSelector(selectIngredients);
  // Получение ошибки ингредиентов
  const burgerIngredientsError = useSelector(selectorIngredientsError);

  // Фильтрация ингредиентов:
  //   чтобы получить только те ингредиенты, у которых тип равен 'bun'
  const buns = burgerIngredients.filter(
    (ingredient) => ingredient.type === 'bun'
  );
  // чтобы получить ингредиенты типа 'main'
  const mains = burgerIngredients.filter(
    (ingredient) => ingredient.type === 'main'
  );
  // чтобы получить ингредиенты типа 'sauce'
  const sauces = burgerIngredients.filter(
    (ingredient) => ingredient.type === 'sauce'
  );

  // Инициализация состояния компонента - текущей выбранной вкладки
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  // Создаем ref-объект для элемента <heading> с типом ингредиента 'bun' - вкладки
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  // Создаем ref-объект для элемента <heading> с типом ингредиента 'main'-вкладки
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  // Создаем ref-объект для элемента <heading> с типом ингредиента 'sauces'-вкладки
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Хуки для отслеживания видимости элементов с типами ингредиента
  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  // Hook useEffect для создания эффекта, который будет вызываться при изменении видимости элементов
  useEffect(() => {
    // Проверяем, виден ли элемент с типом ингредиента 'bun'
    if (inViewBuns) {
      setCurrentTab('bun');
      // Проверяем, виден ли элемент с типом ингредиента 'sauce'.
    } else if (inViewSauces) {
      setCurrentTab('sauce');
      // Проверяем, виден ли элемент с типом ингредиента 'main'
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
    // Указываем, что эффект должен быть вызван при изменении любого из этих трех булевых значений, которые отслеживают видимость элементов
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Функция, которая будет вызываться при клике по вкладке
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    // Если выбрана соответствующая вкладка, то прокрутка до элемента, на который ссылается titleBunRef
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Проверяем, существует ли ошибка ингредиентов. Если да, то выводим сообщение об ошибке*/}
      {burgerIngredientsError && (
        <p style={{ color: 'var(--colors-interface-error)' }}>
          {burgerIngredientsError}
        </p>
      )}
      {/* HTML-элемент для визуального представления ингредиентов бургера */}
      <BurgerIngredientsUI
        currentTab={currentTab}
        buns={buns}
        mains={mains}
        sauces={sauces}
        titleBunRef={titleBunRef}
        titleMainRef={titleMainRef}
        titleSaucesRef={titleSaucesRef}
        bunsRef={bunsRef}
        mainsRef={mainsRef}
        saucesRef={saucesRef}
        onTabClick={onTabClick}
      />
    </>
  );
};
