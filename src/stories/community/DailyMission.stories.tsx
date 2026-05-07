import type { Meta, StoryObj } from '@storybook/react';
import { DailyMission } from './DailyMission';

const meta: Meta<typeof DailyMission> = {
  title: 'Community/일일 미션 사이드바',
  component: DailyMission,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DailyMission>;

export const Default: Story = {};
