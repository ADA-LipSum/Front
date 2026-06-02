import { Eye, Paperclip } from 'lucide-react';

export type Category = '학사' | '행사' | '생활관' | '장학' | '취업' | '서비스';

export interface AnnouncementPost {
  id: number;
  isPinned: boolean;
  category: Category;
  title: string;
  isHot: boolean;
  attachmentCount: number;
  author: string;
  createdAt: string;
  viewCount: number;
  content: string;
  attachments: { name: string }[];
}

export const MOCK_POSTS: AnnouncementPost[] = [
  {
    id: 1001, isPinned: true, category: '학사',
    title: '2026학년도 1학기 중간 강의평가 시행 안내', isHot: true, attachmentCount: 1,
    author: '학사지원팀', createdAt: '2026.06.01', viewCount: 3241,
    content: '2026학년도 1학기 중간 강의평가를 아래와 같이 시행합니다. 모든 재학생은 기간 내 강의평가를 완료해야 하며, 미완료 시 성적 열람이 제한됩니다.\n\n자세한 내용은 첨부파일 및 학교 포털을 통해 확인하실 수 있습니다. 문의사항은 담당 부서로 연락 바랍니다.',
    attachments: [{ name: '학사_안내문_1.pdf' }],
  },
  {
    id: 1002, isPinned: true, category: '행사',
    title: '2026 봄 축제 "LINK PARK" 부스 운영 신청 모집', isHot: true, attachmentCount: 2,
    author: '종학생회', createdAt: '2026.05.30', viewCount: 5820,
    content: '2026 봄 축제 "LINK PARK"에 참여할 부스 운영을 신청하실 단체 및 개인을 모집합니다.\n\n신청 기간 및 운영 일정, 부스 배치 안내 등 자세한 내용은 첨부파일을 확인해 주세요.',
    attachments: [{ name: '부스_신청서.pdf' }, { name: '운영_안내.pdf' }],
  },
  {
    id: 1003, isPinned: true, category: '서비스',
    title: 'ADA 거래소 오픈 & 코인/포인트 정책 안내', isHot: false, attachmentCount: 0,
    author: '운영팀', createdAt: '2026.05.28', viewCount: 4120,
    content: 'ADA 거래소가 정식 오픈되었습니다. 코인 및 포인트 정책에 대한 상세 내용을 안내해 드립니다.\n\n거래소 이용 시 유의사항을 꼭 확인하시고, 문의사항은 운영팀으로 연락해 주세요.',
    attachments: [],
  },
  {
    id: 12, isPinned: false, category: '장학',
    title: '2026-1학기 국가장학금 2차 신청 기간 안내', isHot: false, attachmentCount: 1,
    author: '장학복지팀', createdAt: '2026.05.27', viewCount: 2890,
    content: '2026-1학기 국가장학금 2차 신청 기간을 안내해 드립니다.\n\n신청 기간 내 한국장학재단 홈페이지에서 신청하시기 바랍니다.',
    attachments: [{ name: '장학금_신청_안내.pdf' }],
  },
  {
    id: 11, isPinned: false, category: '생활관',
    title: '여름방학 기숙사 신청 및 퇴사 일정 공지', isHot: false, attachmentCount: 1,
    author: '생활관', createdAt: '2026.05.25', viewCount: 1740,
    content: '여름방학 기숙사 신청 및 퇴사 일정을 안내해 드립니다.\n\n신청 기간 및 퇴사 절차를 첨부파일에서 확인해 주세요.',
    attachments: [{ name: '기숙사_일정_안내.pdf' }],
  },
  {
    id: 10, isPinned: false, category: '취업',
    title: '2026 상반기 캠퍼스 리크루팅 데이 개최', isHot: false, attachmentCount: 3,
    author: '취업지원센터', createdAt: '2026.05.24', viewCount: 2210,
    content: '2026 상반기 캠퍼스 리크루팅 데이가 개최됩니다.\n\n참가 기업 목록 및 일정표를 첨부파일에서 확인하시고, 관심 있는 학생들의 많은 참여 바랍니다.',
    attachments: [{ name: '참가기업_목록.pdf' }, { name: '일정표.pdf' }, { name: '신청서.pdf' }],
  },
  {
    id: 9, isPinned: false, category: '학사',
    title: '2학기 수강신청 일정 및 유의사항 안내', isHot: true, attachmentCount: 1,
    author: '학사지원팀', createdAt: '2026.05.22', viewCount: 6510,
    content: '2학기 수강신청 일정 및 유의사항을 안내해 드립니다.\n\n신청 일정 및 방법을 반드시 숙지하신 후 신청해 주시기 바랍니다.',
    attachments: [{ name: '수강신청_안내.pdf' }],
  },
  {
    id: 8, isPinned: false, category: '행사',
    title: '학생회 25기 중앙운영위원 모집 공고', isHot: false, attachmentCount: 2,
    author: '종학생회', createdAt: '2026.05.20', viewCount: 1980,
    content: '학생회 25기 중앙운영위원을 모집합니다.\n\n지원 자격 및 방법은 첨부 공고문을 참고해 주세요.',
    attachments: [{ name: '모집_공고.pdf' }, { name: '지원서.pdf' }],
  },
  {
    id: 7, isPinned: false, category: '서비스',
    title: '서비스 점검에 따른 일시 접속 제한 안내', isHot: false, attachmentCount: 0,
    author: '운영팀', createdAt: '2026.05.18', viewCount: 920,
    content: '서비스 점검으로 인해 일시적으로 접속이 제한될 예정입니다.\n\n점검 시간 동안 불편을 드려 죄송합니다.',
    attachments: [],
  },
  {
    id: 6, isPinned: false, category: '장학',
    title: '교내 근로장학생 하계 모집 안내', isHot: false, attachmentCount: 1,
    author: '장학복지팀', createdAt: '2026.05.16', viewCount: 1530,
    content: '교내 근로장학생 하계 모집을 안내해 드립니다.\n\n지원 방법 및 일정은 첨부파일을 확인해 주세요.',
    attachments: [{ name: '지원서.pdf' }],
  },
  {
    id: 5, isPinned: false, category: '생활관',
    title: '기숙사 호실 내 전열기구 사용 금지 재안내', isHot: false, attachmentCount: 0,
    author: '생활관', createdAt: '2026.05.14', viewCount: 680,
    content: '기숙사 호실 내 전열기구 사용이 금지되어 있음을 재안내해 드립니다.\n\n안전사고 예방을 위해 규정을 준수해 주시기 바랍니다.',
    attachments: [],
  },
  {
    id: 4, isPinned: false, category: '취업',
    title: '2026 하반기 취업 특강 일정 안내', isHot: false, attachmentCount: 1,
    author: '취업지원센터', createdAt: '2026.05.12', viewCount: 890,
    content: '2026 하반기 취업 특강 일정을 안내해 드립니다.',
    attachments: [{ name: '특강_일정표.pdf' }],
  },
  {
    id: 3, isPinned: false, category: '서비스',
    title: '코인 충전 시스템 업데이트 안내', isHot: false, attachmentCount: 0,
    author: '운영팀', createdAt: '2026.05.10', viewCount: 1120,
    content: '코인 충전 시스템이 업데이트되었습니다.',
    attachments: [],
  },
  {
    id: 2, isPinned: false, category: '행사',
    title: '동아리 박람회 참가 신청 안내', isHot: false, attachmentCount: 1,
    author: '종학생회', createdAt: '2026.05.08', viewCount: 760,
    content: '동아리 박람회 참가 신청을 안내해 드립니다.',
    attachments: [{ name: '참가_신청서.pdf' }],
  },
  {
    id: 1, isPinned: false, category: '학사',
    title: '2025학년도 성적 이의신청 처리 결과 안내', isHot: false, attachmentCount: 0,
    author: '학사지원팀', createdAt: '2026.05.06', viewCount: 430,
    content: '2025학년도 성적 이의신청 처리 결과를 안내해 드립니다.',
    attachments: [],
  },
];

export const CATEGORY_COLORS: Record<string, string> = {
  '학사': 'bg-blue-100 text-blue-600',
  '행사': 'bg-pink-100 text-pink-600',
  '생활관': 'bg-teal-100 text-teal-600',
  '장학': 'bg-orange-100 text-orange-600',
  '취업': 'bg-amber-100 text-amber-700',
  '서비스': 'bg-cyan-100 text-cyan-700',
};

interface AnnouncementOverViewProps {
  posts: AnnouncementPost[];
  selectedPost: AnnouncementPost | null;
  onSelectPost: (post: AnnouncementPost) => void;
}

export const AnnouncementOverView = ({ posts, selectedPost, onSelectPost }: AnnouncementOverViewProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-[72px_88px_1fr_100px_76px] text-xs text-gray-400 font-medium px-5 py-2.5 border-b border-gray-100 bg-gray-50/60">
        <span>번호</span>
        <span>분류</span>
        <span>제목</span>
        <span className="text-center">등록일</span>
        <span className="text-center">조회</span>
      </div>

      {posts.map(post => {
        const isSelected = selectedPost?.id === post.id;
        return (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className={`relative grid grid-cols-[72px_88px_1fr_100px_76px] items-center px-5 py-3.5 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
              isSelected ? 'bg-blue-50/40' : 'hover:bg-gray-50'
            }`}
          >
            {isSelected && (
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gray-900 rounded-r-sm" />
            )}

            <div>
              {post.isPinned ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-500 border border-red-100">
                  고정
                </span>
              ) : (
                <span className="text-sm text-gray-500">{post.id}</span>
              )}
            </div>

            <div>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${CATEGORY_COLORS[post.category]}`}>
                {post.category}
              </span>
            </div>

            <div className="min-w-0 pr-4">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-800 truncate">{post.title}</span>
                {post.isHot && (
                  <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white leading-none">
                    HOT
                  </span>
                )}
                {post.attachmentCount > 0 && (
                  <span className="shrink-0 flex items-center gap-0.5 text-[11px] text-gray-400">
                    <Paperclip size={11} />
                    {post.attachmentCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{post.author}</p>
            </div>

            <div className="text-center">
              <span className="text-xs text-gray-500">{post.createdAt}</span>
            </div>

            <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
              <Eye size={12} />
              <span>{post.viewCount.toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
