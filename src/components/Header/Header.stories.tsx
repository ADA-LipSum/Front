// src/components/Header.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";
import { AuthContext } from "../../auth/AuthContext";
import "../../index.css"; // Tailwind 전역 스타일

type User = { id: string; role?: string } | null;

const meta: Meta<typeof Header> = {
  title: "Layout/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;

type Story = StoryObj<typeof Header>;

// ✅ 스토리북 전용 MockAuthProvider (localStorage, axios 전혀 안 건드림)
const MockAuthProvider: React.FC<{ user: User }> = ({ user, children }) => {
  const value = {
    user,
    login: async () => true,
    logout: () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 비로그인 상태 스토리
export const LoggedOut: Story = {
  name: "비로그인 상태",
  render: () => (
    <MemoryRouter>
      <MockAuthProvider user={null}>
        <Header />
      </MockAuthProvider>
    </MemoryRouter>
  ),
};

// 로그인 상태 스토리
export const LoggedIn: Story = {
  name: "로그인 상태",
  render: () => (
    <MemoryRouter>
      <MockAuthProvider user={{ id: "storybook-user", role: "USER" }}>
        <Header />
      </MockAuthProvider>
    </MemoryRouter>
  ),
};
