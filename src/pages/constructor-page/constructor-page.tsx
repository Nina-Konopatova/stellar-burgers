import { useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';
import { selectorLoading } from '../../slice/ingredientsSlice';

// компонент, который используется для отображения страницы сборки бургера
export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectorLoading);
  return (
    <>
      {/* Проверяем, загружаются ли ингредиенты, если да, то отображается Preloader */}
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        // Если ингредиенты загружены, отображаем основное содержимое страницы
        <>
          <main className={styles.containerMain}>
            <h1
              className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
            >
              Соберите бургер
            </h1>
            <div className={`${styles.main} pl-5 pr-5`}>
              <BurgerIngredients /> <BurgerConstructor />
            </div>
          </main>
        </>
      )}
    </>
  );
};
