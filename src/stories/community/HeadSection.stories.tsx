import type { Meta, StoryObj } from '@storybook/react';
import { HeadSection } from '../../components/Page/community/HeadSection';

const meta: Meta<typeof HeadSection> = {
  title: 'Community/HeadSection',
  component: HeadSection,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HeadSection>;

export const Default: Story = {};
