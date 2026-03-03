import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CommunityComment, CommunityPost } from '@/types/community';

const getTimeAgo = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return d.toLocaleDateString('ko-KR');
};

const initialPosts: CommunityPost[] = [
  {
    id: '1',
    title: '프론트엔드 스터디 모집합니다',
    content:
      'React와 TypeScript 기반으로 프론트엔드 스터디를 진행하려고 합니다. 주 2회 온라인 미팅 예정이고, 프로젝트도 함께 진행할 계획입니다. 관심 있으신 분은 댓글 남겨주세요!',
    author: 'rjsgud49',
    createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
    tags: ['React', 'Spring', 'C++'],
    status: 'recruiting',
  },
  {
    id: '2',
    title: '백엔드 스터디 모집합니다',
    content: 'Java와 Spring Boot로 REST API 설계 및 구현 스터디입니다. 기초부터 차근차근 진행합니다.',
    author: 'user2',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    tags: ['Java', 'Spring Boot'],
    status: 'recruiting',
  },
  {
    id: '3',
    title: '알고리즘 스터디 함께해요',
    content: '매일 한 문제씩 풀고 서로 풀이 공유하는 스터디입니다. 백준/프로그래머스 골드 목표!',
    author: 'user3',
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
    tags: ['Python', '알고리즘'],
    status: 'recruiting',
  },
  {
    id: '4',
    title: '영어 회화 스터디',
    content: '주 3회 30분씩 영어로만 대화하는 스터디입니다. 실력 무관 환영합니다.',
    author: 'user4',
    createdAt: new Date(Date.now() - 300 * 60000).toISOString(),
    tags: ['영어', '회화'],
    status: 'recruiting',
  },
  {
    id: '5',
    title: 'CS 기초 스터디',
    content: 'OS, 네트워크, DB 기초 이론을 함께 공부하고 발표하는 스터디입니다.',
    author: 'user5',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ['OS', '네트워크', 'DB'],
    status: 'closed',
  },
  {
    id: '6',
    title: '프로젝트 팀원 모집',
    content: '사이드 프로젝트 팀원 구합니다. React + Node.js 풀스택으로 2달 정도 진행 예정입니다.',
    author: 'user6',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    tags: ['React', 'Node.js'],
    status: 'recruiting',
  },
  ...Array.from({ length: 20 }, (_, i): CommunityPost => ({
    id: String(i + 7),
    title: `스터디 모집 글 ${i + 7}`,
    content: `스터디 모집 내용입니다. ${i + 7}번 글입니다.`,
    author: `user${(i % 5) + 1}`,
    createdAt: new Date(Date.now() - (i + 7) * 3600000).toISOString(),
    tags: ['React', 'TypeScript'].slice(0, (i % 2) + 1),
    status: i % 3 === 0 ? 'closed' : 'recruiting',
    avatarSrc: undefined,
  })),
];

const initialComments: CommunityComment[] = [
  {
    id: 'c1',
    postId: '1',
    author: 'user2',
    content: '참여하고 싶습니다! 어떤 요일로 생각하고 계신가요?',
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 'c2',
    postId: '1',
    author: 'rjsgud49',
    content: '화요일, 목요일 저녁 8시로 생각 중이에요.',
    createdAt: new Date(Date.now() - 1 * 60000).toISOString(),
  },
];

interface CommunityContextValue {
  posts: CommunityPost[];
  comments: CommunityComment[];
  getTimeAgo: (iso: string) => string;
  addPost: (post: Omit<CommunityPost, 'id' | 'createdAt'>) => CommunityPost;
  addComment: (comment: Omit<CommunityComment, 'id' | 'createdAt'>) => CommunityComment;
  getCommentsByPostId: (postId: string) => CommunityComment[];
  getPostById: (id: string) => CommunityPost | undefined;
}

const CommunityContext = createContext<CommunityContextValue | null>(null);

export const useCommunity = () => {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
};

export const CommunityProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [comments, setComments] = useState<CommunityComment[]>(initialComments);

  const addPost = useCallback((post: Omit<CommunityPost, 'id' | 'createdAt'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  }, []);

  const addComment = useCallback((comment: Omit<CommunityComment, 'id' | 'createdAt'>) => {
    const newComment: CommunityComment = {
      ...comment,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
    return newComment;
  }, []);

  const getCommentsByPostId = useCallback(
    (postId: string) =>
      [...comments].filter((c) => c.postId === postId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [comments],
  );

  const getPostById = useCallback((id: string) => posts.find((p) => p.id === id), [posts]);

  const value = useMemo<CommunityContextValue>(
    () => ({
      posts,
      comments,
      getTimeAgo,
      addPost,
      addComment,
      getCommentsByPostId,
      getPostById,
    }),
    [posts, comments, addPost, addComment, getCommentsByPostId, getPostById],
  );

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};
