import type { Meta, StoryObj } from '@storybook/react';
import { CreatePostButton } from './CreatePostButton';

const meta: Meta<typeof CreatePostButton> = {
  title: 'Community/CreatePostButton',
  component: CreatePostButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CreatePostButton>;

export const Default: Story = {};
