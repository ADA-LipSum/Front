import type { Meta, StoryObj } from '@storybook/react';
import { QnAPostsOverView } from '../../components/Page/community/QnAPostsOverView';

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

export const Default: Story = {};

export const FourPosts: Story = {};

export const TwoPosts: Story = {};

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
