import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaStackOverflow } from 'react-icons/fa';
import ActivityCalendar from 'react-github-calendar';

import { Avatar } from '@/components/Avatar';
import { Icon } from '@iconify/react';
import { labels } from '@/components/githubCalendarLabels';
import BlogCarousel from '@/components/BlogCarousel';
import { Div } from '@/components/Div';
import { useAuth } from '@/auth/AuthContext';
import { fetchUserProfile } from '@/components/Profile/profileContext';

type ProfileType = {
  uuid: string;
  userRealname: string;
  profileImage?: string;
  profileBanner?: string;
  role?: string;
  intro?: string;
  techStack: string[];
  links?: {
    [key: string]: string;
  };
};

export default function MyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<number>(0);

  // 유저 값이 없을 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (user === null) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [user, navigate]);

  // 프로필 정보 불러오기
  useEffect(() => {
    if (!user?.uuid) return;

    (async () => {
      const uuid = user?.uuid;
      if (!uuid) return;

      const data = await fetchUserProfile(uuid);

      setProfile(data);
    })();
  }, [user]);

  // 로딩 중일 때
  if (user === undefined) {
    return <div className="mt-10 text-center">로딩중...</div>;
  }

  // 상태 변경 핸들러
  const handleEditClick = () => setIsEditing(!isEditing);
  const handleBannerClick = (idx: number) => setSelectedBanner(idx);
  const handleButtonClick = () => {
    console.log(`Selected banner index: ${selectedBanner}`);
    setIsEditing(false);
  };

  console.log('🔎 Profile user:', user);
  console.log('🔎 localStorage auth_user:', localStorage.getItem('auth_user'));

  // 렌더링 부분
  return (
    <div className="flex flex-col items-center h-screen">
      <Div
        className="flex w-full text-center bg-center bg-cover h-1/3 outline-1"
        src={`${banners[selectedBanner]}`}
      >
        <div className="absolute right-0 w-auto mt-2 mr-2 bg-black rounded-2xl">
          <Icon
            className="p-2 cursor-pointer"
            style={{ color: isEditing ? '#3B89FF' : 'white' }}
            icon="mdi:pencil"
            width="44"
            height="44"
            onClick={handleEditClick}
          />
        </div>
      </Div>

      <div className="flex flex-row w-full">
        {/* 프로필 섹션 */}
        <section className="relative flex flex-col w-1/3 px-16">
          <div className="pt-24 mb-6">
            <Avatar
              size="10rem"
              alt="avatar"
              src={`${profile?.profileImage || user?.profileImage}`}
              className="absolute bg-cover border-4 border-purple-300 rounded-full left-30 -top-20"
            />

            <h2 className="w-full ml-3 text-2xl font-black text-left">{user?.name}</h2>

            <p className="p-4 mt-3 font-medium text-gray-700 border border-gray-500 text-md rounded-3xl">
              {profile?.intro}
            </p>

            <div className="flex items-center gap-3 mt-2 text-gray-600">
              <FaGithub
                className="text-xl cursor-pointer hover:text-black"
                onClick={() =>
                  profile?.links?.github && window.open(profile.links.github, '_blank')
                }
              />
              <FaLinkedin
                className="text-xl cursor-pointer hover:text-sky-700"
                onClick={() =>
                  profile?.links?.linkedin && window.open(profile.links.linkedin, '_blank')
                }
              />
              <FaStackOverflow
                className="text-xl cursor-pointer hover:text-orange-500"
                onClick={() =>
                  profile?.links?.stackoverflow &&
                  window.open(profile.links.stackoverflow, '_blank')
                }
              />
            </div>
          </div>

          {/* 기술 스택 */}
          <div>
            <div className="flex flex-row flex-wrap">
              <h3 className="mb-3 text-lg font-bold">기술 스택</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {profile?.techStack?.map(tech => (
                <span
                  key={tech}
                  className="w-auto h-10 px-3 py-1 text-sm font-medium bg-gray-200 rounded-sm cursor-pointer hover:bg-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 오른쪽 영역 */}
        {!isEditing ? (
          <section className="w-2/3 p-4 pr-12">
            <div className="w-full mb-4 h-3/5">
              <h3 className="text-lg font-bold leading-9.5">블로그</h3>
              <BlogCarousel data={blogMockData} />
            </div>

            <div className="flex justify-center h-auto p-6 border rounded-2xl font-notosans">
              <ActivityCalendar
                // username={`${profile?.links?.github?.split('github.com/')[1]}`}
                username="rlaxogh76"
                blockSize={14}
                colorScheme="light"
                labels={labels}
                showWeekdayLabels={true}
                hideTotalCount={true}
              />
            </div>
          </section>
        ) : (
          <section className="w-2/3 p-4 pr-12">
            <div>
              <div className="flex flex-row justify-between mb-4">
                <div className="flex flex-row">
                  <h3 className="items-center text-lg font-bold leading-9.5">수집한 배너</h3>
                  <Icon
                    className="p-2 cursor-pointer"
                    icon="mdi-light:information"
                    width="40"
                    height="40"
                  />
                </div>

                <button
                  className="p-3 text-white bg-blue-600 rounded-lg"
                  onClick={handleButtonClick}
                >
                  변경사항 저장
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {banners.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative w-full h-32 overflow-hidden cursor-pointer rounded-xl"
                    onClick={() => handleBannerClick(idx)}
                  >
                    <img src={src} alt={`banner-${idx}`} className="object-cover w-full h-full" />
                    {selectedBanner === idx && (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: 'rgba(59, 137, 255, 0.6)' }}
                      >
                        <Icon
                          className="absolute text-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                          icon="material-symbols:check"
                          width="60"
                          height="60"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-2 mt-2">
                {[0, 1, 2, 3, 4].map(dot => (
                  <div key={dot} className={`w-2 h-2 rounded-full bg-neutral-500`} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const blogMockData = [
  {
    title: '제목1',
    description: '테스트용 더미 설명1',
    url: 'https://example.com/blog1',
  },
  {
    title: '제목2',
    description: '테스트용 더미 설명1',
    url: 'https://example.com/blog1',
  },
  {
    title: '제목3',
    description: '테스트용 더미 설명1',
    url: 'https://example.com/blog1',
  },
  {
    title: '제목4',
    description: '테스트용 더미 설명1',
    url: 'https://example.com/blog1',
  },
  {
    title: '제목5',
    description: '테스트용 더미 설명1',
    url: 'https://example.com/blog1',
  },
  {
    title: '제목6',
    description: '테스트용 더미 설명1',
    url: 'https://example.com/blog1',
  },
  {
    title: '제목7',
    description: '테스트용 더미 설명1',
    url: 'https://example.com/blog1',
  },
  {
    title: '제목8',
    description: '테스트용 더미 설명1',
    url: 'https://example.com/blog1',
  },
];

const banners = [
  'https://static.solved.ac/profile_bg/profile/kit2025b-706ff93c-5758-4136-8c62-7df54b1065ef.png',
  'https://static.solved.ac/profile_bg/profile/kit2025a-a3bae173-3be5-4451-ba7f-c1995dca9959.jpeg',
  'https://static.solved.ac/profile_bg/profile/halloween2025-34185f0e-62a4-4499-bea4-9e91d37aa15c.jpeg',
  'https://static.solved.ac/profile_bg/profile/lemoncup-c805203e-d3f6-4865-a36d-6ea5ba8dce5c.png',
  'https://static.solved.ac/profile_bg/profile/iam2025half-2523fbbd-ffa5-4445-8588-e34975e98af8.png',
  'https://static.solved.ac/profile_bg/profile/skh2025-118a72a5-6440-4ca5-aebe-75f854cf1a94.png',
  'https://static.solved.ac/profile_bg/profile/k512_2025-d13477dc-0ea4-4094-84cb-12353698ebd4.png',
  'https://static.solved.ac/profile_bg/profile/ucpc2025-2df0cbcc-0aa5-438a-8532-1a7ef2eeab44.png',
  'https://static.solved.ac/profile_bg/suapc2021w/suapc2021w.png',
];
