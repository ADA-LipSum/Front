---
title: 프론트엔드 공통 컨벤션
description: ADA 프론트엔드 팀원과 협업하기 위한 공통 컨벤션
---

> ADA 프론트엔드 팀원과 함께 **협업**하기 위한 **컨벤션**입니다.

## 1. 기본 폴더 구조

### app

> 프로젝트 핵심 설정 파일들 관리

---

### components

> 재사용 가능한 컴포넌트들을 관리

```
components/
├─ common/      # 공통 컴포넌트 (Button, Input, Modal 등)
├─ layout/      # 레이아웃 관련 컴포넌트 (Header, Footer, Sidebar)
└─ features/    # 기능/도메인별 컴포넌트
   └─ home/
      ├─ HomeAnnouncement.tsx  # 홈 페이지 공지사항
      └─ HomeBanner.tsx        # 홈 페이지 배너
```

- **common/**: 프로젝트 전반에서 공통으로 사용하는 UI 컴포넌트
- **layout/**: 페이지 레이아웃을 구성하는 컴포넌트
- **features/**: 기능(도메인) 단위로 컴포넌트를 구조화하여 관리

---

### lib

> 프로젝트의 유틸리티 함수, API 호출 함수, 헬퍼 등을 관리

```
lib/
├─ apis/        # API 관련 함수 (파일명: *.api.ts)
├─ hooks/       # 커스텀 훅
└─ utils/       # 유틸리티 함수 (파일명: *.util.ts)
```

---

### pages

> 사용자에게 보여지는 주요 페이지를 라우팅 경로와 함께 관리

```
pages/
├─ HomePage.tsx
└─ dashboard/
   └─ DashboardPage.tsx
```

---

### 상태 관리 및 타입

```
├─ contexts/            # Context API 관련 파일
│  └─ auth/
│     ├─ auth.context.ts
│     ├─ auth.reducer.ts
│     └─ AuthProvider.ts
├─ store/               # 전역 상태 관리 (*.slice.ts)
├─ types/               # 타입 정의
│  ├─ dto/
│  │  └─ *.dto.ts
│  └─ *.type.ts
└─ data/                # 상수 데이터 (*.constant.ts)
```

- **contexts/**: Context API 관련 로직 관리
- **store/**: Redux 등 전역 상태 관리 파일
- **types/**: TypeScript 타입 및 DTO 정의
- **data/**: 상수 데이터 관리

---

## 2. 네이밍 및 코드 컨벤션

- 함수 선언: `const` 사용
- 컴포넌트 / 타입 네이밍: **PascalCase**

---

## 3. Tailwind CSS 스타일 관리 전략

### 3.1 기본 원칙

- Tailwind CSS는 **CSS 파일을 페이지마다 생성하지 않는다**
- 스타일은 **컴포넌트 단위로 JSX 안에서 관리**한다
- 재사용 가능한 스타일은 **컴포넌트 또는 스타일 상수로 추상화**한다

---

### 3.2 페이지 전용 스타일 관리

#### 스타일 상수 파일 분리

```
pages/
├─ HomePage.tsx
└─ HomePage.styles.ts
```

##### HomePage.styles.ts

```ts
export const homePageStyles = {
  container: 'mx-auto max-w-7xl px-6 py-10',
  title: 'text-3xl font-bold text-gray-900',
  section: 'mt-8 grid gap-6 md:grid-cols-2',
};
```

##### HomePage.tsx

```tsx
import { homePageStyles as s } from './HomePage.styles';

export default function HomePage() {
  return (
    <div className={s.container}>
      <h1 className={s.title}>홈</h1>
      <section className={s.section}>{/* feature components */}</section>
    </div>
  );
}
```

---

### 3.3 재사용 가능한 스타일 관리 기준

#### 공통 UI → components/common

- Button, Input, Modal 등은 컴포넌트 자체로 스타일을 캡슐화

#### 반복되는 스타일 패턴 -> styles 상수화

```
lib/styles/
└─ card.styles.ts
```

#### 상태/variant 많은 컴포넌트 → cva 사용

- Button, Badge, Tag 등에 권장

#### 전역 스타일 → 최소한만 사용

- `globals.css`의 `@layer components`는 디자인 시스템 수준에서만 허용

---
