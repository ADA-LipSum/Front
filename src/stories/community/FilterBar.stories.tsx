import type { Meta, StoryObj } from '@storybook/react';
import { FilterBar } from '../../components/Page/community/FilterBar';

const meta: Meta<typeof FilterBar> = {
  title: 'Community/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {};
