import { CategoryFilter } from '@/components/Page/exchange/CategoryFilter';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CategoryFilter> = {
  title: 'Exchange/CategoryFilter',
  component: CategoryFilter,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CategoryFilter>;

export const Default: Story = {
  args: {
    selected: '전체',
    onChange: (category: string) => console.log('Selected category:', category),
  },
};
