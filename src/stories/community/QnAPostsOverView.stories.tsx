import type { Meta, StoryObj } from '@storybook/react';
import { MOCK_POSTS, QnAPostsOverView } from '../../components/Page/community/QnAPostsOverView';

const meta: Meta<typeof QnAPostsOverView> = {
  title: 'Community/QnAPostsOverView',
  component: QnAPostsOverView,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'light', values: [{ name: 'light', value: '#f9fafb' }] },
  },
  decorators: [
    (Story) => (
      <div className="max-w-9xl mx-auto p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof QnAPostsOverView>;

export const Default: Story = {
  args: {
    posts: MOCK_POSTS,
  },
};

export const FourPosts: Story = {
  args: {
    posts: MOCK_POSTS.slice(0, 4),
  },
};

export const TwoPosts: Story = {
  args: {
    posts: MOCK_POSTS.slice(0, 2),
  },
};

export const Empty: Story = {
  args: {
    posts: [],
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-16 text-gray-400 text-sm">게시물이 없습니다.</div>
        <Story />
      </div>
    ),
  ],
};
