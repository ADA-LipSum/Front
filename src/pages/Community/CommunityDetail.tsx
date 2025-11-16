// src/pages/Community/CommunityDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import ReactMarkdown from 'react-markdown';
import { markdownComponents } from '../../components/Markdown/MarkdownComponents';

type PostDetail = {
    postUuid: string;
    seq: number;
    writerUuid: string;
    title: string;
    content: string;
    images: string | null;
    videos: string | null;
    writer: string;
    writerProfileImage: string | null;
    writedAt: string;
    updatedAt: string;
    likes: number;
    views: number;
    comments: number;
    isDev: boolean;
    devTags: string | null;
};

export default function CommunityDetail() {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();

    const [post, setPost] = useState<PostDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!uuid) return;

        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await api.get('/post/view', {
                    params: { uuid },
                });

                const data: PostDetail = res.data.data;
                setPost(data);
            } catch (err) {
                console.error(err);
                setError('게시글을 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [uuid]);

    const formatDate = (iso: string) => {
        return new Date(iso).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-6">
                <div className="bg-white rounded-xl px-6 py-6 text-center text-sm text-gray-500 shadow-[0_4px_4px_0_#E1E1E1]">
                    불러오는 중...
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-6">
                <div className="bg-white rounded-xl px-6 py-6 text-center text-sm text-red-500 shadow-[0_4px_4px_0_#E1E1E1]">
                    {error ?? '게시글을 찾을 수 없습니다.'}
                </div>
                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center px-4 py-2 text-xs rounded-full border border-gray-300 bg-white hover:bg-gray-50"
                    >
                        ← 뒤로가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            {/* 뒤로 가기 */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 inline-flex items-center px-4 py-2 text-xs rounded-full border border-gray-300 bg-white hover:bg-gray-50"
            >
                ← 목록으로
            </button>

            {/* 상세 카드 */}
            <div className="bg-white rounded-xl px-6 py-6 shadow-[0_4px_4px_0_#E1E1E1]">
                {/* 프로필 이미지*/}
                <img
                    src={post.writerProfileImage || '/default-profile.png'}
                    alt="작성자 프로필"
                    className="w-10 h-10 rounded-full mb-4 object-cover"
                />

                {/* 제목 */}
                <h1 className="text-xl font-semibold">{post.title}</h1>

                {/* 작성자 / 날짜 */}
                <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                    <span>{post.writer ?? '익명'}</span>
                    <span>·</span>
                    <span>{formatDate(post.writedAt)}</span>
                    {post.updatedAt && (
                        <>
                            <span>·</span>
                            <span>수정: {formatDate(post.updatedAt)}</span>
                        </>
                    )}
                </div>

                {/* 태그 / 정보 */}
                <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-gray-600">
                    {post.isDev && post.devTags && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">{post.devTags.toUpperCase()}</span>
                    )}
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">조회 {post.views}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">좋아요 {post.likes}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">댓글 {post.comments}</span>
                </div>

                {/* 내용 */}
                <div className="mt-6 text-sm leading-relaxed text-gray-800">
                    <div className="prose prose-sm max-w-none">
                        <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
                    </div>
                </div>

                {/* 이미지 / 동영상 (문자열로 온다고 했으니, 우선 존재 여부만 체크) */}
                {post.images && <div className="mt-4 text-xs text-gray-500">첨부 이미지: {post.images}</div>}
                {post.videos && <div className="mt-2 text-xs text-gray-500">첨부 비디오: {post.videos}</div>}
            </div>
        </div>
    );
}
