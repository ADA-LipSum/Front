# 이슈 기록

## [AUTH] 액세스 토큰 만료 후 로그인 유지 실패

**날짜:** 2026-04-23
**브랜치:** feature/auth

### 증상
액세스 토큰(유효시간 10분) 만료 후 페이지 새로고침 시 리프레시 토큰을 통한 재발급이 실패하여 로그인 상태가 유지되지 않음.

---

### 버그 1 (우선순위: 높음) — 만료된 토큰이 reissue 요청에 포함됨

**파일:** `src/api/axios.ts` (lines 11-17)

**원인:**
Request interceptor가 `/api/auth/reissue`를 포함한 모든 요청에 localStorage의 액세스 토큰을 Authorization 헤더에 추가한다. 결과적으로 재발급 요청 자체에 만료된 토큰이 실려 백엔드가 해당 헤더를 검증하는 경우 reissue가 실패한다.

**흐름:**
```
checkLogin → /api/auth/status → 401
interceptor → /api/auth/reissue 호출
              ↳ request interceptor가 만료된 토큰을 Authorization 헤더에 추가
              ↳ 백엔드가 헤더 검증 시 → 401 반환 → reissue 실패
```

**수정 방안:**
```typescript
// src/api/axios.ts
instance.interceptors.request.use((config) => {
  if (config.url?.includes('/auth/reissue')) return config; // 추가
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### 버그 2 (우선순위: 중간) — checkLogin catch 블록이 방금 갱신된 토큰을 삭제함

**파일:** `src/features/auth/authSlice.ts` (line 69)

**원인:**
Interceptor가 reissue에 성공하여 새 토큰을 localStorage에 저장한 뒤, 재시도 요청(`/api/auth/status`)이 서버 오류 등 비인증 이유로 실패하면 `checkLogin`의 catch 블록이 실행되어 방금 갱신된 유효한 토큰을 삭제한다. 토큰 삭제는 `axios.ts`의 interceptor catch에서 이미 처리하므로 중복이다.

**수정 방안:**
```typescript
// src/features/auth/authSlice.ts
} catch (err) {
  // localStorage.removeItem('accessToken'); ← 제거
  console.log('로그인 상태 유지 실패:', err);
  delete axios.defaults.headers.common['Authorization'];
  return rejectWithValue(null);
}
```

---

### 버그 3 (우선순위: 낮음) — interceptor catch 블록의 에러 변수 미선언 및 return 주석 처리

**파일:** `src/api/axios.ts` (lines 52-57)

**원인:**
`catch` 뒤에 에러 변수가 없고 `return Promise.reject(err)`가 주석 처리되어 있어, reissue 실패 시 명시적 반환 없이 line 60의 `return Promise.reject(error)`(원래 401 에러)로 흘러내려간다. 에러 흐름이 불명확하고 reissue 실패 원인을 알 수 없다.

**수정 방안:**
```typescript
// src/api/axios.ts
} catch (err) {                            // 변수 추가
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  delete instance.defaults.headers.common['Authorization'];
  return Promise.reject(err);              // 주석 해제 및 변수명 수정
}
```

---

### 관련 파일

- `src/api/axios.ts`
- `src/features/auth/authSlice.ts`
