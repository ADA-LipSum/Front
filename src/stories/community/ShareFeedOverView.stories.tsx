import type { Meta, StoryObj } from '@storybook/react';
import {
  ShareFeedOverView,
  MOCK_FEED_WITH_IMAGES,
  MOCK_FEED_TEXT_ONLY,
} from '@/components/Page/community/ShareFeedOverView';

const meta: Meta<typeof ShareFeedOverView> = {
  title: 'Community/ShareFeedOverView',
  component: ShareFeedOverView,
};

export default meta;
type Story = StoryObj<typeof ShareFeedOverView>;

export const WithImages: Story = {
  name: '이미지 있음 (hasImage: true)',
  render: () => <ShareFeedOverView feed={MOCK_FEED_WITH_IMAGES} />,
};

export const TextOnly: Story = {
  name: '이미지 없음 (hasImage: false)',
  render: () => <ShareFeedOverView feed={MOCK_FEED_TEXT_ONLY} />,
};
