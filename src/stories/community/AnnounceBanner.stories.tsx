import type { Meta, StoryObj } from '@storybook/react';
import AnnounceBanner from '@/components/Page/community/AnnounceBanner';

const meta: Meta<typeof AnnounceBanner> = {
  title: 'Community/AnnounceBanner',
  component: AnnounceBanner,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AnnounceBanner>;

export const Default: Story = {};
