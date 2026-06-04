import { SetBannerModal } from '@/components/Page/setting/SetBannerModal';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SetBannerModal> = {
  title: 'Community/SetBannerModal',
  component: SetBannerModal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SetBannerModal>;

export const Default: Story = {};
