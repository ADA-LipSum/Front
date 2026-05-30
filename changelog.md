# Changelog

---

## 1차 개선 — 인증 상태 유지 문제 해결 (Redux + Axios Interceptor 도입)

### 문제 🚨

- 초기에는 JWT Access Token을 `localStorage`에만 저장하는 구조로 구현하여, 페이지 새로고침 시 Redux 스토어가 초기화되면서 로그인 상태가 유지되지 않는 문제가 발생했습니다.
- 또한 인증 상태가 전역적으로 일관되게 관리되지 않아, 컴포넌트 간 로그인 상태 동기화가 어려운 구조였습니다.

### 해결 과정

- Redux Toolkit의 `createAsyncThunk`를 활용하여 인증 로직을 비동기 액션으로 캡슐화하고, `isLoggedIn`, `user` 상태를 전역 스토어에서 관리하도록 구조를 개선하였습니다.
- 앱 초기 렌더링 시 `checkLogin` 액션을 실행하여 `localStorage`의 Access Token 존재 여부를 확인하고, 사용자 정보 조회 API를 통해 인증 상태를 복원하도록 구현하였습니다.
- **Axios Interceptor**를 적용하여 Access Token 만료(401 응답) 시 토큰 재발급 API를 요청하고, 재발급된 토큰을 `localStorage` 및 `Authorization` 헤더에 재설정한 후 기존 요청을 재시도하도록 구현하였습니다.
- Refresh Token을 HttpOnly 쿠키에 저장하여 JavaScript 접근을 차단함으로써 XSS 공격을 통한 토큰 탈취를 방지하였습니다.

### 개선 결과

- 새로고침 및 페이지 이동 시에도 인증 상태가 안정적으로 유지되는 구조로 개선되었습니다.
- Access Token 만료 상황에서도 자동 재발급이 이루어져 사용자 경험이 끊기지 않도록 개선되었습니다.
- 인증 로직을 Redux 비동기 흐름으로 통합하여 코드 복잡도를 줄이고 유지보수성을 향상시켰습니다.
- Redux DevTools를 활용하여 상태 변화를 추적하며 디버깅함으로써, 인증 흐름의 안정성을 검증하였습니다.

---

## 2차 개선 — accessToken 메모리 저장 및 Redux → Zustand 마이그레이션

### 문제 🚨

#### **① Access Token의 localStorage 저장 방식은 보안에 취약**

1차 개선에서 자동 재발급 후 토큰을 다시 `localStorage`에 저장하는 구조가 남아 있었습니다.
`localStorage`는 동일 출처의 모든 JavaScript에서 자유롭게 접근이 가능하기 때문에,
XSS(Cross-Site Scripting) 공격이 발생할 경우 악성 스크립트가 토큰을 탈취할 수 있는 위험이 존재합니다.

```typescript
// 문제가 된 코드 — src/api/axios.ts (1차 개선 당시)
const refreshRes = await instance.post('/api/auth/reissue', {});
const newAccessToken = refreshRes.data.accessToken;

localStorage.setItem('accessToken', newAccessToken); // ← XSS 시 탈취 가능
instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
```

```typescript
// 문제가 된 코드 — src/features/auth/authSlice.ts (1차 개선 당시)
export const login = createAsyncThunk('api/auth/login', async ({ id, password }) => {
  const res = await loginApi(id, password);
  const { accessToken } = res.data;

  localStorage.setItem('accessToken', accessToken); // ← XSS 시 탈취 가능
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  // ...
});
```

#### **② Redux 보일러플레이트로 인한 코드 복잡도**

Redux Toolkit은 강력하지만, 비교적 단순한 전역 상태를 관리하는 데도 `configureStore`, `createSlice`, `createAsyncThunk`, `RootState`, `AppDispatch` 등 여러 파일과 타입 정의가 필요하여 코드량이 불필요하게 많아졌습니다.

```typescript
// 기존 구조 — src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import profileReducer from '@/features/auth/profileSlice';

export const store = configureStore({
  reducer: { auth: authReducer, profile: profileReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// 기존 구조 — 컴포넌트에서의 Redux 사용
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { login } from '@/features/auth/authSlice';

const dispatch = useDispatch<AppDispatch>();
const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

await dispatch(login({ id, password })).unwrap(); // dispatch + unwrap 패턴 필수
```

```typescript
// 기존 구조 — axios.ts에서 Redux store 직접 접근
import { store } from '@/store/store';
import { setAccessToken, clearCredentials } from '@/features/auth/authSlice';

const token = store.getState().auth.accessToken;  // store 직접 접근
store.dispatch(setAccessToken({ accessToken: newToken })); // store 직접 dispatch
store.dispatch(clearCredentials());
```

---

### 해결 과정

#### **① Access Token을 메모리(Zustand store)에만 저장**

Access Token을 `localStorage`에 전혀 저장하지 않고 JavaScript 런타임 메모리, 즉 Zustand 스토어의 상태 값으로만 보유하도록 변경하였습니다.
메모리에 저장된 값은 XSS 스크립트가 `localStorage.getItem()`으로 꺼낼 수 없으며,
페이지 새로고침 시 소멸되더라도 HttpOnly 쿠키에 담긴 Refresh Token으로 자동 재발급(`checkLogin`)하는 흐름으로 복원이 가능합니다.

```
┌──────────────────────────────────────────────────────┐
│  브라우저 메모리 (JS Heap)                            │
│  ┌─────────────────────┐                             │
│  │  Zustand authStore  │  ← accessToken 여기에만 존재 │
│  │  accessToken: "..."  │     XSS로 꺼낼 수 없음      │
│  └─────────────────────┘                             │
│                                                      │
│  localStorage / sessionStorage  ← 토큰 없음          │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  브라우저 쿠키 저장소                                 │
│  refreshToken (HttpOnly) ← JS 접근 불가               │
│                            서버 요청 시 자동 첨부     │
└──────────────────────────────────────────────────────┘
```

#### **② Redux → Zustand 마이그레이션**

상태와 액션을 하나의 `create()` 호출로 정의할 수 있는 Zustand로 전환하여 보일러플레이트를 대폭 줄였습니다.
`configureStore`, `createSlice`, `createAsyncThunk`, `RootState`, `AppDispatch` 등의 타입/파일이 모두 제거되었습니다.

**authStore.ts — 인증 상태 + 액션 통합**

```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import axios from '@/api/axios';
import { login as loginApi } from '@/api/auth';

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  loading: true,
  user: null,
  accessToken: null, // localStorage 미사용 — 메모리에만 존재

  login: async (id, password) => {
    const res = await loginApi(id, password);
    const { accessToken } = res.data;
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    const me = await axios.get('/api/auth/status');
    set({ isLoggedIn: true, loading: false, user: me.data.data, accessToken });
    //                                                              ↑ 메모리(Zustand)에만 저장
  },

  checkLogin: async () => {
    // HttpOnly 쿠키의 Refresh Token이 withCredentials로 자동 전송됨
    try {
      const refreshRes = await axios.post('/api/auth/reissue', {}, { withCredentials: true });
      const { accessToken } = refreshRes.data.data ?? refreshRes.data;
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const me = await axios.get('/api/auth/status');
      set({ isLoggedIn: true, loading: false, user: me.data.data, accessToken });
    } catch {
      // 재발급 실패 → 비로그인 처리 (토큰 탈취 여지 없음)
      delete axios.defaults.headers.common['Authorization'];
      set({ isLoggedIn: false, loading: false, user: null, accessToken: null });
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } finally {
      delete axios.defaults.headers.common['Authorization'];
      set({ isLoggedIn: false, user: null, accessToken: null });
    }
  },

  setAccessToken: (accessToken) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    set({ accessToken });
  },

  clearCredentials: () => {
    set({ accessToken: null, isLoggedIn: false, user: null });
  },
}));
```

**profileStore.ts — 프로필 상태 + 액션 통합**

```typescript
// src/store/profileStore.ts
import { create } from 'zustand';
import { getProfile, getUserByUsername, editProfile, uploadProfileImage as uploadProfileImageApi } from '@/api/profile';
import { useAuthStore } from './authStore';

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfileByUsername: async (username) => {
    set({ loading: true, error: null });
    try {
      const data = await getUserByUsername(username);
      set({ loading: false, profile: data });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || '프로필 조회 실패' });
    }
  },

  uploadProfileImage: async (uuid, file) => {
    const imageUrl = await uploadProfileImageApi(uuid, file);
    set((state) => ({
      profile: state.profile ? { ...state.profile, profileImage: imageUrl } : state.profile,
    }));
    // 프로필 이미지 변경 시 auth store의 user 정보도 동기화
    useAuthStore.getState().updateUserProfileImage(imageUrl);
  },

  // ... fetchProfile, updateProfile, clearProfile
}));
```

**axios.ts — Zustand getState()로 토큰 접근**

```typescript
// src/api/axios.ts
import { useAuthStore } from '@/store/authStore';

// 요청 인터셉터 — Zustand 메모리에서 토큰 읽기
instance.interceptors.request.use((config) => {
  if (config.url?.includes('/auth/reissue')) return config; // 재발급 요청엔 토큰 불필요

  const token = useAuthStore.getState().accessToken; // 메모리에서 읽기
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답 인터셉터 — 401 시 토큰 재발급 후 메모리에만 저장
instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && ...) {
      originalRequest._retry = true;
      try {
        const res = await instance.post('/api/auth/reissue', {});
        const newAccessToken = res.data.data?.accessToken ?? res.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken); // 메모리(Zustand)에만 저장
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return instance(originalRequest); // 원래 요청 재시도
      } catch (err) {
        useAuthStore.getState().clearCredentials();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);
```

**컴포넌트 — dispatch 없이 직접 호출**

```typescript
// 변경 전 (Redux)
const dispatch = useDispatch<AppDispatch>();
const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

await dispatch(login({ id, password })).unwrap();
dispatch(fetchProfileByUsername(customId));
dispatch(clearProfile());

// 변경 후 (Zustand)
const { isLoggedIn, user, login } = useAuthStore();
const { fetchProfileByUsername, clearProfile } = useProfileStore();

await login(id, password);
fetchProfileByUsername(customId);
clearProfile();
```

**main.tsx — Redux Provider 제거**

```tsx
// 변경 전
import { Provider } from 'react-redux';
import { store } from './store/store';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>   {/* ← 제거됨 */}
      <App />
    </Provider>
  </BrowserRouter>,
);

// 변경 후
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
```

---

### 개선 결과

#### 보안

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| Access Token 저장 위치 | `localStorage` (JS 접근 가능) | Zustand 메모리 (JS 힙 내부, `getItem` 불가) |
| Refresh Token 저장 위치 | HttpOnly 쿠키 | HttpOnly 쿠키 (유지) |
| XSS 시 Access Token 탈취 가능 여부 | **가능** | **불가** |
| XSS 시 Refresh Token 탈취 가능 여부 | 불가 | 불가 (유지) |

- Access Token이 `localStorage`에서 완전히 제거되어 XSS 공격으로 인한 토큰 탈취 경로가 차단되었습니다.
- 페이지 새로고침 시 Access Token은 소멸되지만, HttpOnly 쿠키의 Refresh Token으로 `checkLogin`이 자동으로 재발급하므로 사용자 경험에 영향이 없습니다.

#### 코드 구조

| 항목 | 변경 전 (Redux) | 변경 후 (Zustand) |
|------|----------------|------------------|
| 상태 관리 파일 수 | `store.ts` + `authSlice.ts` + `profileSlice.ts` (3개) | `authStore.ts` + `profileStore.ts` (2개) |
| 필요한 타입 정의 | `RootState`, `AppDispatch` | 없음 |
| 컴포넌트 훅 | `useSelector` + `useDispatch` 조합 | `useAuthStore` 단일 훅 |
| 비동기 액션 | `createAsyncThunk` + `extraReducers` + `.unwrap()` | 스토어 내 `async` 함수 직접 호출 |
| Provider 래핑 | `<Provider store={store}>` 필요 | 불필요 |

- Redux의 `createSlice` / `createAsyncThunk` / `extraReducers` 패턴이 제거되어 코드량이 크게 줄었습니다.
- `dispatch(action()).unwrap()` 대신 스토어 함수를 `await`으로 직접 호출할 수 있어 가독성이 향상되었습니다.
- `RootState`, `AppDispatch` 타입 정의 및 `Provider` 래핑이 불필요해져 진입 장벽이 낮아졌습니다.
