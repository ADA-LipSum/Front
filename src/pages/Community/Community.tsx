/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { api } from '@/api/client';

type Post = {
  seq: number;
  postUuid: string;
  title: string;
  writer: string | null;
  writerProfileImage: string | null;
  writedAt: string;
  likes: number;
  views: number;
  comments: number;
  isDev: boolean;
  devTags: string | null;
  tag: string;
};

type PageResponse = {
  content: Post[];
  totalPages: number;
  number: number;
};

export default function CommunityList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태

  const size = 10;
  const navigate = useNavigate();

  // 게시글 / 검색 리스트 호출
  const fetchPosts = async () => {
    try {
      setLoading(true);

      const res = await api.get('/api/posts', {
        params: {
          page,
          size,
          search: searchTerm || undefined, // 검색어가 없으면 제외
        },
      });

      if (!res.data || !res.data.data) {
        console.error('Invalid response:', res.data);
        setPosts([]);
        setTotalPages(1);
        return;
      }

      const data: PageResponse = res.data.data;
      setPosts(data.content ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // page 또는 searchTerm 이 바뀔 때마다 다시 요청
  useEffect(() => {
    fetchPosts();
  }, [page, searchTerm]);

  // 검색 실행 함수
  const handleSearch = () => {
    setPage(0); // 검색 시 1페이지로 초기화
    fetchPosts();
  };

  // 엔터키 검색
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, idx) => idx);

  return (
    <div className="max-w-4xl px-4 py-6 mx-auto">
      {/* 제목 + 검색 + 버튼 */}
      <div className="px-6 py-5 mb-5 bg-white rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">커뮤니티</h1>
            <p className="mt-1 text-xl text-gray-500">{posts.length} 검색 결과</p>
          </div>
          <div className="flex flex-col items-end gap-2 w-80">
            {/* 검색창 */}
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="검색어를 입력해 주세요"
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="absolute text-xs text-gray-500 -translate-y-1/2 right-3 top-1/2"
              >
                🔍
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* 필터 버튼 */}
              <button className="px-3 py-1 text-xs bg-white border rounded-full hover:bg-gray-100">
                필터
              </button>

              {/* 새 글 */}
              <Link to="/community/write">
                <button className="rounded-full bg-blue-600 text-white px-4 py-1.5 text-xs font-semibold hover:bg-blue-700">
                  새 글 작성
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 게시글 리스트 */}
      <div className="mt-2 space-y-4">
        {loading &&
          Array.from({ length: size }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 px-6 py-4 bg-white shadow rounded-xl animate-pulse"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-3xl" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 rounded" />
                <div className="w-1/2 h-3 bg-gray-100 rounded" />
              </div>
              <div className="flex flex-col items-end gap-2 text-[10px]">
                <div className="w-10 h-3 bg-gray-100 rounded" />
                <div className="w-10 h-3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}

        {!loading && posts.length === 0 && (
          <div className="px-6 py-6 text-sm text-center text-gray-500 bg-white shadow rounded-xl">
            검색 결과가 없습니다.
          </div>
        )}

        {!loading &&
          posts.map(post => (
            <div
              key={post.postUuid}
              onClick={() => navigate(`/community/${post.seq}`)}
              className="flex items-start gap-4 px-6 py-4 transition bg-white shadow cursor-pointer rounded-xl hover:bg-gray-50"
            >
              {post.writerProfileImage ? (
                <img src={post.writerProfileImage} className="w-12 h-12 border rounded-3xl" />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-3xl" />
              )}

              <div className="flex-1">
                <h2 className="text-sm font-semibold">{post.title}</h2>
                <p className="mt-1 text-xs text-gray-500">
                  {post.writer ?? '익명'} · {formatDate(post.writedAt)}
                </p>

                <div className="flex gap-1 mt-2 text-[10px]">
                  {post.isDev && post.devTags && (
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                      {post.devTags.toUpperCase()}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full">{post.tag}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 text-[10px] text-gray-500">
                <span>👍 {post.likes}</span>
                <span>💬 {post.comments}</span>
                <span>👁 {post.views}</span>
              </div>
            </div>
          ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-4 py-1 text-xs bg-white border rounded-full disabled:bg-gray-100 disabled:text-gray-400"
        >
          이전
        </button>

        <div className="flex gap-1">
          {pageNumbers.map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-full text-xs border flex items-center justify-center ${
                p === page
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {p + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
          className="px-4 py-1 text-xs bg-white border rounded-full disabled:bg-gray-100 disabled:text-gray-400"
        >
          다음
        </button>
      </div>
    </div>
  );
}
