import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from '@/components/Page/exchange/SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Exchange/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {};
