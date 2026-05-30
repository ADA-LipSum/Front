import ConfirmModal from '@/components/global/ConfirmModal';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ConfirmModal> = {
  title: 'Global/ConfirmModal',
  component: ConfirmModal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

export const Default: Story = {};
