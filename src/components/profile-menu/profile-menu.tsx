import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../slice/userSlice';

// Компонент, который, используется для отображения меню профиля пользовател
export const ProfileMenu: FC = () => {
  // Hook для получения текущего пути в URL
  const { pathname } = useLocation();
  // Hook для доступа к диспатчеру Redux actions
  const dispatch = useDispatch();
  // Функция, которая будет вызвана для выхода из аккаунта
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
