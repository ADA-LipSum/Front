import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from '../../components/Page/community/SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Community/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {};
