import {
  TLoginData,
  TRegisterData,
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

// Интерфейс состояния для аутентификации пользователя
interface IAuthUser {
  userData: TUser | null;
  isAuthChecked: boolean;
  loginUserRequest: boolean;
  errorRegistration: string | null;
  errorLogin: string | null;
  errorUpdate: string | null;
  errorLogout: string | null;
}

// Начальное состояние для аутентификации пользователя
const initialState: IAuthUser = {
  userData: null,
  isAuthChecked: false,
  loginUserRequest: false,
  errorRegistration: null,
  errorLogin: null,
  errorUpdate: null,
  errorLogout: null
};

// Создаем асинхронный Thunk для получения данных пользователя
export const fetchUserData = createAsyncThunk(
  'authUser/fetchUserData',
  async () => {
    const response = await getUserApi();
    return response;
  }
);

// Создаем асинхронный Thunk для проверки аутентификации пользователя
export const verifyUserAuth = createAsyncThunk(
  'authUser/verifyUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      await dispatch(fetchUserData());
    }
    dispatch(setAuthChecked());
  }
);

// Создаем асинхронный Thunk для входа пользователя
export const loginUser = createAsyncThunk(
  'authUser/loginUser',
  async (loginData: TLoginData, { rejectWithValue }) => {
    const data = await loginUserApi(loginData);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

// Создаем асинхронный Thunk для регистрации пользователя
export const registerUser = createAsyncThunk(
  'authUser/registerUser',
  async (registerData: TRegisterData, { rejectWithValue }) => {
    const data = await registerUserApi(registerData);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

// Создаем асинхронный Thunk для обновления данных пользователя
export const updateUser = createAsyncThunk(
  'authUser/updateUser',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    return response;
  }
);

// Создаем асинхронный Thunk для запроса сброса пароля
export const forgotPassword = createAsyncThunk(
  'authUser/forgotPassword',
  async (data: { email: string }) => {
    const response = await forgotPasswordApi(data);
    return response;
  }
);

// Создаем асинхронный Thunk для  сброса пароля
export const resetPassword = createAsyncThunk(
  'authUser/resetPassword',
  async (data: { password: string; token: string }) => {
    const response = await resetPasswordApi(data);
    return response;
  }
);

// Создаем асинхронный Thunk для выхода пользователя
export const logoutUser = createAsyncThunk('authUser/logoutUser', async () => {
  const response = await logoutApi();
  return response;
});

// Создаем slice для управления состоянием аутентификации пользователя
const userSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    // дополнительные обработчики для асинхронных Thunks
    builder
      // обработчик для успешного выполнения Thunk fetchUserData
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload.user;
      })
      // обработчик для состояния "ожидание" для Thunk verifyUserAuth
      .addCase(verifyUserAuth.pending, (state) => {
        state.errorLogin = null;
        state.errorRegistration = null;
        state.errorLogout = null;
      })
      // обработчик для состояния "ожидание" для Thunk loginUser
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.errorLogin = null;
      })
      // обработчик для успешного выполнения Thunk loginUser
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthChecked = true;
        state.loginUserRequest = false;
        state.errorLogin = null;
      })
      // обработчик для ошибки при выполнении Thunk loginUser
      .addCase(loginUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.errorLogin = 'Ошибка доступа к личному кабинету';
        state.loginUserRequest = false;
      })
      // обработчик для состояния "ожидание" для Thunk registerUser
      .addCase(registerUser.pending, (state) => {
        state.loginUserRequest = true;
        state.errorRegistration = null;
      })
      // обработчик для успешного выполнения Thunk registerUser
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loginUserRequest = false;
      })
      // обработчик для ошибки при выполнении Thunk registerUser
      .addCase(registerUser.rejected, (state) => {
        state.errorRegistration = 'Ошибка регистрации';
        state.loginUserRequest = false;
      })
      // обработчик для состояния "ожидание" для Thunk updateUser
      .addCase(updateUser.pending, (state) => {
        state.loginUserRequest = true;
        state.userData = null;
        state.errorUpdate = null;
      })
      // обработчик для успешного выполнения Thunk updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.userData = action.payload.user;
      })
      // обработчик для ошибки при выполнении Thunk updateUser
      .addCase(updateUser.rejected, (state) => {
        state.loginUserRequest = false;
        state.errorUpdate = 'Ошибка обновления пользовательских данных';
      })
      // обработчик для состояния "ожидание" для Thunk logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.loginUserRequest = true;
        state.errorLogout = null;
      })
      // обработчик для успешного выполнения Thunk logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.loginUserRequest = false;
        state.userData = null;
        localStorage.clear();
        deleteCookie('accessToken');
      })
      // обработчик для ошибки при выполнении Thunk logoutUser
      .addCase(logoutUser.rejected, (state) => {
        state.loginUserRequest = false;
        state.errorLogout = 'Ошибка выхода из системы';
      });
  }
});

// Создание селекторов для доступа к различным свойствам состояния аутентификации пользователя с помощью createSelector из Redux Toolkit
export const selectUserData = createSelector(
  (state: { authUser: IAuthUser }) => state.authUser,
  (authUser) => authUser.userData
);

export const selectAuthChecked = createSelector(
  (state: { authUser: IAuthUser }) => state.authUser,
  (authUser) => authUser.isAuthChecked
);

export const selectLoginUserRequest = createSelector(
  (state: { authUser: IAuthUser }) => state.authUser,
  (authUser) => authUser.loginUserRequest
);

export const selectErrorRegistration = createSelector(
  (state: { authUser: IAuthUser }) => state.authUser,
  (authUser) => authUser.errorRegistration
);

export const selectErrorLogin = createSelector(
  (state: { authUser: IAuthUser }) => state.authUser,
  (authUser) => authUser.errorLogin
);

export const selectErrorUpdate = createSelector(
  (state: { authUser: IAuthUser }) => state.authUser,
  (authUser) => authUser.errorUpdate
);

// Экспорт reducer, действия, slice
export const authUserReducer = userSlice.reducer;
export const { setAuthChecked } = userSlice.actions;
export const authUser = userSlice.name;
