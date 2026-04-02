import type { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAsync } from '@/features/auth/authSlice';
import { ShowErrorToast, ShowSuccessToast } from '@/components/Library/Toast/Toast';
import {
  HeroBanner,
  LatestPostItem,
  MealMenu,
  NoticeCard,
  Panel,
  PartnerCard,
  SectionHeader,
} from '@/components/main/MainUi';

const NOTICE_ITEMS = [
  { title: '포스터 출력시 세부사항 확인가능', footer: '해커톤 총 시상' },
  { title: '현장실습 신청 안내', footer: '컴퓨터실 인원모집' },
  { title: '수강신청 정정기간 공지', footer: '총학생회 복지협력' },
];

const MEAL_ITEMS = ['글로컬런치 밥', '제육볶음', '유부장국', '샐러드'];

const LATEST_POSTS = [
  {
    title: 'Start to ready',
    subtitle: 'https://community.adasw.kr/post/01',
    views: 111,
    comments: 11,
    likes: 111,
  },
  {
    title: 'Start to ready',
    subtitle: 'https://community.adasw.kr/post/02',
    views: 111,
    comments: 11,
    likes: 111,
  },
  {
    title: 'Start to ready',
    subtitle: 'https://community.adasw.kr/post/03',
    views: 111,
    comments: 11,
    likes: 111,
  },
  {
    title: 'Start to ready',
    subtitle: 'https://community.adasw.kr/post/04',
    views: 111,
    comments: 11,
    likes: 111,
  },
  {
    title: 'Start to ready',
    subtitle: 'https://community.adasw.kr/post/05',
    views: 111,
    comments: 11,
    likes: 111,
  },
];

export const IsLoggedIn = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      ShowSuccessToast('로그아웃 성공!');
    } catch {
      ShowErrorToast('로그아웃 실패');
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <p>로그인 상태입니다.</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div>로그인 상태가 아닙니다.</div>
      )}
    </div>
  );
};

export const Main = () => {
  return (
    <main className="min-h-screen bg-[#F3F3F5]">
      <HeroBanner />
      <div className="mx-auto w-full max-w-330 px-6 py-10 md:px-10 md:py-12">
        <div className="space-y-10">
          <Panel>
            <SectionHeader title="공지사항" actionLabel="전체보기 ▶" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {NOTICE_ITEMS.map((notice) => (
                <NoticeCard key={notice.title} title={notice.title} footer={notice.footer} />
              ))}
            </div>
          </Panel>

          <section className="flex w-full flex-col gap-10 lg:flex-row">
            <Panel className="flex-1">
              <SectionHeader title="오늘의 급식" />
              <MealMenu period="오늘의 조식" items={MEAL_ITEMS} />
            </Panel>

            <Panel className="flex-2">
              <SectionHeader title="최신 글" />
              <div>
                {LATEST_POSTS.map((post, index) => (
                  <LatestPostItem
                    key={`${post.title}-${index}`}
                    title={post.title}
                    subtitle={post.subtitle}
                    views={post.views}
                    comments={post.comments}
                    likes={post.likes}
                  />
                ))}
              </div>
            </Panel>
          </section>

          <section>
            <SectionHeader title="산학협력 기업" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <PartnerCard key={index} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
