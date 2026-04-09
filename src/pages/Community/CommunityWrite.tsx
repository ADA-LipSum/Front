import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { RecruitStatus } from '@/types/community';
import { createCommunityPost } from '@/api/posts';

export const CommunityWrite = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [status, setStatus] = useState<RecruitStatus>('recruiting');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsStr
      .split(/[\s,]+/)
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const devTags = tags.join(',');

    const run = async () => {
      try {
        setSubmitting(true);
        const postUuid = await createCommunityPost({
          title: title.trim(),
          content: content.trim(),
          isDev: true,
          devTags,
        });
        navigate(`/community/${postUuid}`);
      } catch (err) {
        console.error(err);
        alert('게시글 등록에 실패했습니다.');
      } finally {
        setSubmitting(false);
      }
    };

    void run();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button
          type="button"
          onClick={() => navigate('/community')}
          className="flex items-center gap-2 text-[#4A4A4A] font-medium hover:text-black mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          목록으로
        </button>

        <h1 className="text-2xl font-bold text-black mb-6">스터디 모집 글 쓰기</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
              maxLength={100}
              className="w-full px-4 py-3 border border-[#E0E0E0] rounded outline-none focus:border-[#4A4A4A]"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-black mb-2">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="스터디 소개, 일정, 조건 등을 작성해주세요."
              required
              rows={10}
              className="w-full px-4 py-3 border border-[#E0E0E0] rounded outline-none focus:border-[#4A4A4A] resize-y"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-black mb-2">
              태그 (쉼표 또는 공백으로 구분)
            </label>
            <input
              id="tags"
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="예: React, TypeScript, 스터디"
              className="w-full px-4 py-3 border border-[#E0E0E0] rounded outline-none focus:border-[#4A4A4A]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">모집 상태</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RecruitStatus)}
              className="w-full max-w-xs px-4 py-3 border border-[#E0E0E0] rounded outline-none focus:border-[#4A4A4A]"
            >
              <option value="recruiting">모집중</option>
              <option value="closed">모집완료</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-[#4A4A4A] text-white font-medium rounded hover:bg-[#3A3A3A] transition disabled:opacity-60"
            >
              {submitting ? '등록 중...' : '등록하기'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/community')}
              className="px-6 py-3 border border-[#E0E0E0] text-black font-medium rounded hover:bg-[#FAFAFA] transition"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
