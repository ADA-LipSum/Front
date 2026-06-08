import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { markdownComponents } from '@/components/Library/React-Markdown-Syntax/MarkdownComponents';
import { createGeneralPost, createDevPost } from '@/api/community';
import type { CreateDevPostPollInput } from '@/api/community';
import { Eye, EyeOff, Plus, X, Image, Video, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import {
  ShowSuccessToast,
  ShowErrorToast,
  ShowWarningToast,
} from '@/components/Library/Toast/Toast';

type CommunityType = 'general' | 'dev';
type DevSubTag = 'QUESTION' | 'PROJECT' | 'MEME' | 'RESOURCE_SHARING';

const DEV_SUBTAGS: { value: DevSubTag; label: string }[] = [
  { value: 'QUESTION', label: '질문' },
  { value: 'PROJECT', label: '프로젝트' },
  { value: 'MEME', label: '밈' },
  { value: 'RESOURCE_SHARING', label: '자료 공유' },
];

const POPULAR_TECH_TAGS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'Spring',
  'Node.js',
  'Next.js',
  'Docker',
  'Go',
];

const MD_SHORTCUTS: { label: string; title: string; syntax: string }[] = [
  { label: 'B', title: '굵게 (Ctrl+B)', syntax: '**텍스트**' },
  { label: 'I', title: '기울임 (Ctrl+I)', syntax: '*텍스트*' },
  { label: 'H2', title: '제목', syntax: '## 제목\n' },
  { label: 'H3', title: '소제목', syntax: '### 소제목\n' },
  { label: '{ }', title: '코드 블록', syntax: '```\n코드\n```' },
  { label: '`', title: '인라인 코드', syntax: '`코드`' },
  { label: '"', title: '인용', syntax: '> ' },
  { label: '—', title: '구분선', syntax: '\n---\n' },
  { label: '-', title: '목록', syntax: '- ' },
  { label: '1.', title: '순서 있는 목록', syntax: '1. ' },
];

export const CommunityPostCreate = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [communityType, setCommunityType] = useState<CommunityType>('general');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [devSubTag, setDevSubTag] = useState<DevSubTag>('QUESTION');
  const [techTags, setTechTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [showMediaInList, setShowMediaInList] = useState(true);

  const [hasPoll, setHasPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollEndsAt, setPollEndsAt] = useState('');
  const [pollAnonymous, setPollAnonymous] = useState(false);

  const insertMarkdown = (syntax: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const selected = content.slice(start, end);
    let insertText = syntax;
    if (selected && (syntax === '**텍스트**' || syntax === '*텍스트*' || syntax === '`코드`')) {
      insertText = syntax.replace(/텍스트|코드/, selected);
    }
    const newContent = content.slice(0, start) + insertText + content.slice(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertText.length, start + insertText.length);
    }, 0);
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !techTags.includes(trimmed) && techTags.length < 5) {
      setTechTags((prev) => [...prev, trimmed]);
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    setPollOptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const validate = (): boolean => {
    if (!isLoggedIn) {
      ShowWarningToast('로그인이 필요합니다.');
      navigate('/login');
      return false;
    }
    if (!title.trim()) {
      ShowWarningToast('제목을 입력해주세요.');
      return false;
    }
    if (communityType === 'dev' && !content.trim()) {
      ShowWarningToast('내용을 입력해주세요.');
      return false;
    }
    if (hasPoll) {
      if (!pollQuestion.trim()) {
        ShowWarningToast('투표 질문을 입력해주세요.');
        return false;
      }
      if (pollOptions.some((o) => !o.trim())) {
        ShowWarningToast('투표 항목을 모두 입력해주세요.');
        return false;
      }
      if (!pollEndsAt) {
        ShowWarningToast('투표 종료 날짜를 설정해주세요.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      let postId: number;
      const poll: CreateDevPostPollInput | undefined = hasPoll
        ? {
            question: pollQuestion.trim(),
            options: pollOptions.filter((o) => o.trim()),
            endsAt: new Date(pollEndsAt).toISOString(),
            anonymous: pollAnonymous,
          }
        : undefined;

      if (communityType === 'general') {
        postId = await createGeneralPost({
          title: title.trim(),
          content: content.trim() || undefined,
          images: imageFiles,
          videos: videoFiles,
          showMediaInList,
          ...(poll && { poll }),
        });
      } else {
        postId = await createDevPost({
          title: title.trim(),
          content: content.trim(),
          techSubTag: devSubTag,
          techTags,
          ...(poll && { poll }),
        });
      }
      ShowSuccessToast('게시글이 작성되었습니다!');
      navigate(`/article/${postId}`);
    } catch {
      ShowErrorToast('게시글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDev = communityType === 'dev';

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-3xl mx-auto px-4 py-7 space-y-4">
        {/* Community type selector + submit button */}
        <div className="flex items-center justify-between">
          <div className="inline-flex bg-white border border-gray-200 rounded-2xl p-1 gap-0.5">
            <button
              onClick={() => setCommunityType('general')}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                !isDev ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              일반 커뮤니티
            </button>
            <button
              onClick={() => setCommunityType('dev')}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                isDev ? 'bg-indigo-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              개발 커뮤니티
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-5 py-2 text-sm font-semibold rounded-lg text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${
              isDev ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isSubmitting ? '게시 중...' : '게시하기'}
          </button>
        </div>

        {/* SubTag (dev only) */}
        {isDev && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">게시글 유형</p>
            <div className="flex gap-2 flex-wrap">
              {DEV_SUBTAGS.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setDevSubTag(item.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    devSubTag === item.value
                      ? 'bg-indigo-500 text-white border-indigo-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 파일 첨부 (general only) */}
        {!isDev && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-700">파일 첨부</p>

            {/* 이미지 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                  <Image size={13} />
                  이미지 추가
                </button>
                <span className="text-xs text-gray-400">jpeg, png, gif, webp, svg · 최대 15MB</span>
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                multiple
                hidden
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  setImageFiles((prev) => [...prev, ...files]);
                  e.target.value = '';
                }}
              />
              {imageFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {imageFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-600">
                      <span className="max-w-32 truncate">{file.name}</span>
                      <button onClick={() => setImageFiles((prev) => prev.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-400 transition">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 영상 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                  <Video size={13} />
                  영상 추가
                </button>
                <span className="text-xs text-gray-400">mp4 · 최대 100MB</span>
              </div>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4"
                multiple
                hidden
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  setVideoFiles((prev) => [...prev, ...files]);
                  e.target.value = '';
                }}
              />
              {videoFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {videoFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-600">
                      <span className="max-w-32 truncate">{file.name}</span>
                      <button onClick={() => setVideoFiles((prev) => prev.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-400 transition">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 목록 미디어 노출 */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
              <div>
                <span className="text-sm text-gray-700">목록에서 미디어 노출</span>
                <p className="text-xs text-gray-400 mt-0.5">끄면 상세 조회에서만 이미지·영상이 보입니다</p>
              </div>
              <button
                onClick={() => setShowMediaInList((v) => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${showMediaInList ? 'bg-green-500' : 'bg-gray-200'}`}
                role="switch"
                aria-checked={showMediaInList}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${showMediaInList ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        )}

        {/* Tech tags (dev only) */}
        {isDev && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              기술 태그 <span className="text-xs font-normal text-gray-400">(최대 5개)</span>
            </p>

            {/* Popular presets */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {POPULAR_TECH_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  disabled={techTags.includes(tag) || techTags.length >= 5}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    techTags.includes(tag)
                      ? 'bg-indigo-100 text-indigo-500 cursor-default'
                      : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Selected tag chips */}
            {techTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {techTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      onClick={() => setTechTags((prev) => prev.filter((t) => t !== tag))}
                      className="text-indigo-400 hover:text-indigo-700 transition"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Custom tag input */}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => tagInput.trim() && addTag(tagInput)}
              placeholder="태그 입력 후 Enter 또는 쉼표로 추가"
              disabled={techTags.length >= 5}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        )}

        {/* Title */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={20}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
          />
          <div className="text-right text-xs text-gray-400 mt-1.5">{title.length}/20</div>
        </div>

        {/* Content editor */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Editor header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-700">내용</span>
            <button
              onClick={() => setIsPreview((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition border border-gray-200"
            >
              {isPreview ? <EyeOff size={13} /> : <Eye size={13} />}
              {isPreview ? '편집 모드' : '미리보기'}
            </button>
          </div>

          {!isPreview ? (
            <>
              {/* Markdown toolbar */}
              <div className="flex gap-1 px-4 py-2.5 border-b border-gray-100 bg-gray-50 flex-wrap">
                {MD_SHORTCUTS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => insertMarkdown(s.syntax)}
                    title={s.title}
                    className="min-w-7 h-7 px-1.5 flex items-center justify-center text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition font-mono"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  isDev
                    ? '마크다운으로 글을 작성해 보세요.\n\n## 제목\n\n**굵게**, *기울임*\n\n```javascript\nconsole.log("Hello!");\n```'
                    : '내용을 입력하세요. 마크다운을 사용할 수 있습니다.\n\n**굵게**, *기울임*, ~~취소선~~'
                }
                className="w-full h-72 px-5 py-4 text-sm text-gray-800 placeholder-gray-300 resize-none focus:outline-none font-mono leading-relaxed"
              />
              <div className="px-5 pb-3 flex justify-between items-center">
                <p className="text-xs text-gray-400">
                  마크다운 문법을 지원합니다. 상단 툴바 버튼을 클릭하거나 직접 입력하세요.
                </p>
                <span className="text-xs text-gray-400">{content.length}자</span>
              </div>
            </>
          ) : (
            <div className="min-h-72 px-5 py-5">
              {content ? (
                <div className="markdown-preview text-sm leading-relaxed">
                  <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-gray-400">내용이 없습니다.</p>
              )}
            </div>
          )}
        </div>

        {/* Poll */}
        {(
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-gray-700">투표 추가</span>
                <p className="text-xs text-gray-400 mt-0.5">게시글에 투표를 첨부할 수 있습니다</p>
              </div>
              <button
                onClick={() => setHasPoll((p) => !p)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                  hasPoll ? 'bg-indigo-500' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={hasPoll}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                    hasPoll ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {hasPoll && (
              <div className="mt-5 space-y-3 pt-5 border-t border-gray-100">
                {/* Poll question */}
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="투표 질문을 입력하세요"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                />

                {/* Poll options */}
                <div className="space-y-2">
                  {pollOptions.map((option, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 h-5 flex items-center justify-center text-xs font-semibold text-gray-400 shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updatePollOption(idx, e.target.value)}
                        placeholder={`항목 ${idx + 1}`}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          onClick={() => setPollOptions((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition"
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {pollOptions.length < 5 && (
                  <button
                    onClick={() => setPollOptions((prev) => [...prev, ''])}
                    className="flex items-center gap-1.5 text-sm text-indigo-500 hover:text-indigo-700 font-medium transition"
                  >
                    <Plus size={15} />
                    항목 추가
                  </button>
                )}

                {/* Poll settings */}
                <div className="flex flex-col sm:flex-row gap-4 pt-1">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      투표 종료 날짜
                    </label>
                    <input
                      type="datetime-local"
                      value={pollEndsAt}
                      onChange={(e) => setPollEndsAt(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end pb-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={pollAnonymous}
                        onChange={(e) => setPollAnonymous(e.target.checked)}
                        className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600">익명 투표</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPostCreate;
