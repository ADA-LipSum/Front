import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { RightSection } from '../../components/Page/auth/Right/RightSection';

const meta: Meta<typeof RightSection> = {
  title: 'Auth/RightSection',
  component: RightSection,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="relative w-full h-screen">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RightSection>;

export const Default: Story = {};
