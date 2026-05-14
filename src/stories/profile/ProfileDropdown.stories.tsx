import ProfileDropdown from '@/components/Page/profile/ProfileDropdown';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProfileDropdown> = {
  title: 'Profile/ProfileDropdown',
  component: ProfileDropdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProfileDropdown>;

export const Default: Story = {};
