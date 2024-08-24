import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { Preloader } from '@ui';
import {
  selectErrorLogin,
  selectLoginUserRequest,
  loginUser
} from '../../slice/userSlice';
import { useDispatch, useSelector } from '../../services/store';

// Компонент, который используется для отображения формы входа в систему
export const Login: FC = () => {
  // Локальные состояния для email, password, начальные значения которых является пустая строка
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Получение текста  ошибки и состояния запроса на вход из Redux
  const errorText = useSelector(selectErrorLogin) || undefined;
  const registration = useSelector(selectLoginUserRequest);

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <>
      {/* Проверяем, выполняется ли регистрация */}
      {registration ? (
        // если регистрация выполняется, отображается прелоадер
        <Preloader />
      ) : (
        //  Если регистрация не выполняется, включается LoginUI
        <LoginUI
          // передает текст ошибки
          errorText={errorText}
          // передает email
          email={email}
          // передает функцию установки email
          setEmail={setEmail}
          // передает пароль
          password={password}
          // передает функцию установки пароля
          setPassword={setPassword}
          // передает функцию обратного вызова
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};
