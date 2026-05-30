import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../../pages/Auth/Login';

const meta: Meta<typeof Login> = {
  title: 'Auth/NewLogin',
  component: Login,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Login>;

export const Default: Story = {
  render: () => <Login />,
};
