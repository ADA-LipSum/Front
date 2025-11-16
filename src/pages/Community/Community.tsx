// src/pages/Community/CommunityList.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ⭐ 추가
import { api } from '../../api/client';

type Post = {
    postUuid: string;
    title: string;
    writer: string | null;
    writerProfileImage: string | null; // ⭐ 추가
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
    const size = 10;

    const navigate = useNavigate(); // ⭐ 추가

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const res = await api.get('/post/list', {
                    params: { page, size },
                });

                const data: PageResponse = res.data.data;
                setPosts(data.content);
                setTotalPages(data.totalPages);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page]);

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
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* 제목 + 검색 + 버튼 */}
            <div className="bg-white rounded-xl px-6 py-5 mb-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">커뮤니티</h1>
                        <p className="text-xl text-gray-500 mt-1">24,191,804 검색 결과</p>
                    </div>

                    {/* 오른쪽 끝 정렬 */}
                    <div className="flex flex-col items-end gap-2 w-80">
                        {/* 검색창 */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="검색어를 입력해 주세요"
                                className="w-full rounded-md border border-gray-300 py-2 px-4 text-sm focus:outline-none text-gray-400"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">🔍</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* 필터 버튼 */}
                            <button className="border rounded-full px-3 py-1 text-xs bg-white hover:bg-gray-100">
                                필터
                            </button>

                            {/* 새 글 */}
                            <button className="rounded-full bg-blue-600 text-white px-4 py-1.5 text-xs font-semibold hover:bg-blue-700">
                                새 글 작성
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 게시글 리스트 */}
            <div className="mt-2 space-y-4">
                {loading && (
                    <div className="bg-white rounded-xl px-6 py-6 text-center text-gray-500 text-sm shadow-[0_4px_4px_0_#E1E1E1]">
                        로딩 중...
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <div className="bg-white rounded-xl px-6 py-6 text-center text-gray-500 text-sm shadow-[0_4px_4px_0_#E1E1E1]">
                        게시글이 없습니다.
                    </div>
                )}

                {!loading &&
                    posts.map((post) => (
                        <div
                            key={post.postUuid}
                            onClick={() => navigate(`/community/${post.postUuid}`)} // ⭐ 클릭 시 상세로 이동
                            className="flex items-start gap-4 px-6 py-4 bg-white rounded-xl hover:bg-gray-50 transition shadow-[0_4px_4px_0_#E1E1E1] cursor-pointer"
                        >
                            {/* 왼쪽 프로필 이미지 */}
                            {post.writerProfileImage ? (
                                <img
                                    src={post.writerProfileImage}
                                    alt="프로필 이미지"
                                    className="w-12 h-12 rounded-xl border"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                            )}

                            {/* 본문 */}
                            <div className="flex-1">
                                <h2 className="text-sm font-semibold">{post.title}</h2>
                                <p className="text-xs text-gray-500 mt-1">
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

                            {/* 우측 수치 */}
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
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    disabled={page === 0}
                    className="px-4 py-1 border rounded-full text-xs bg-white disabled:bg-gray-100 disabled:text-gray-400"
                >
                    이전
                </button>

                <div className="flex gap-1">
                    {pageNumbers.map((p) => (
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
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                    disabled={page === totalPages - 1}
                    className="px-4 py-1 border rounded-full text-xs bg-white disabled:bg-gray-100 disabled:text-gray-400"
                >
                    다음
                </button>
            </div>
        </div>
    );
}
