import { Eye, MessageSquare, Pause, Play, ThumbsUp } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroSlide {
  subtitle: string;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

const HERO_BANNER_SLIDES: HeroSlide[] = [
  {
    subtitle: '소프트웨어마이스터고 실무 프로젝트 트랙',
    title: '현업형 개발자 양성',
    description: '기업 연계 캡스톤으로 기획부터 배포까지 직접 경험합니다.',
    gradientFrom: '#0C8F35',
    gradientTo: '#26A755',
  },
  {
    subtitle: '전공 동아리 기반 성장 사이클',
    title: 'AI · 웹 · 임베디드 집중 학습',
    description: '멘토링과 코드리뷰를 통해 팀 단위 문제 해결 역량을 강화합니다.',
    gradientFrom: '#1E5B2E',
    gradientTo: '#2C7540',
  },
  {
    subtitle: '산학협력 기반 커리어 패스',
    title: '취업 연계형 포트폴리오',
    description: '학기별 실전 과제를 누적해 채용에 바로 연결되는 결과물을 만듭니다.',
    gradientFrom: '#5A7B1F',
    gradientTo: '#769933',
  },
  {
    subtitle: '학교-기업 공동 성장 프로그램',
    title: '품격있는 SW 인재',
    description: '기초 체력부터 협업 습관까지 갖춘 개발자로 성장하는 교육 과정입니다.',
    gradientFrom: '#0A6E63',
    gradientTo: '#13887C',
  },
];

export interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
}

export const SectionHeader = ({ title, actionLabel }: SectionHeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-black text-[#202020]">{title}</h2>
      {actionLabel ? (
        <button
          type="button"
          className="rounded-full border border-[#D6D6D6] bg-white px-3 py-1 text-xs font-semibold text-[#4A4A4A] cursor-pointer text-center hover:bg-[#F5F5F5] transition"
          onClick={() => navigate('/announcement')}
        >
          {actionLabel}
        </button>
      ) : null}
    </header>
  );
};

export interface PanelProps {
  children: ReactNode;
  className?: string;
}

export const Panel = ({ children, className = '' }: PanelProps) => {
  return (
    <section className={`rounded-xl border border-[#DCDCDC] bg-white p-5 ${className}`}>
      {children}
    </section>
  );
};

export interface NoticeCardProps {
  title: string;
  footer: string;
}

export const NoticeCard = ({ title, footer }: NoticeCardProps) => {
  return (
    <article className="flex h-48 flex-col justify-between rounded-xl bg-[#E7E7E7] px-6 py-7">
      <h3 className="text-base font-semibold text-[#1F1F1F]">{title}</h3>
      <p className="text-sm font-semibold text-[#2D2D2D]">{footer}</p>
    </article>
  );
};

export interface MealMenuProps {
  period: string;
  items: string[];
}

export const MealMenu = ({ period, items }: MealMenuProps) => {
  const mealTabs = ['조식', '중식', '석식'] as const;
  const [activeTab, setActiveTab] = useState<(typeof mealTabs)[number]>('조식');
  const activeIndex = mealTabs.indexOf(activeTab);

  return (
    <>
      <div className="relative mb-5 grid w-full grid-cols-3 rounded-full border border-[#D9D9D9] p-1 text-sm font-semibold text-[#1F1F1F]">
        <span
          className="absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-green-700 transition-transform duration-300 ease-out"
          style={{ transform: `translateX(calc(${activeIndex} * 100%))` }}
        />
        {mealTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`z-10 rounded-full px-3 py-1 transition-colors duration-200 ${
              activeTab === tab ? 'text-white' : 'text-[#1F1F1F]'
            }`}
            aria-pressed={activeTab === tab}
          >
            {tab}
          </button>
        ))}
      </div>
      <p className="mb-4 text-sm font-semibold text-[#6E6E6E]">{period}</p>
      <ul className="space-y-3 text-sm text-[#323232]">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#52B66A]" />
            {item}
          </li>
        ))}
      </ul>
    </>
  );
};

export interface LatestPostItemProps {
  title: string;
  subtitle: string;
  views: number;
  comments: number;
  likes: number;
}

export const LatestPostItem = ({
  title,
  subtitle,
  views,
  comments,
  likes,
}: LatestPostItemProps) => {
  return (
    <article className="flex border-b items-center border-[#E6E6E6] px-1 py-3 last:border-b-0">
      <div className="flex-1 flex-col w-fit">
        <h3 className="flex text-lg font-semibold text-[#202020]">{title}</h3>
        <div className="flex mt-1 mb-2 text-xs text-[#B1B1B1]">{subtitle}</div>
      </div>
      <div className="flex h-fit justify-end gap-2 text-xs text-[#626262]">
        <Metric icon={<Eye size={13} />} value={views} />
        <Metric icon={<MessageSquare size={13} />} value={comments} />
        <Metric icon={<ThumbsUp size={13} />} value={likes} />
      </div>
    </article>
  );
};

interface MetricProps {
  icon: ReactNode;
  value: number;
}

const Metric = ({ icon, value }: MetricProps) => {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-[#D9D9D9] px-2 py-1">
      {icon}
      {value}
    </span>
  );
};

export const HeroBanner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_BANNER_SLIDES.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const currentSlide = HERO_BANNER_SLIDES[activeSlide];

  return (
    <section
      className="flex h-64 flex-row items-end justify-between px-8 py-8 text-white transition-colors duration-1000 ease-in-out md:px-20"
      style={{ backgroundColor: currentSlide.gradientFrom }}
    >
      <div>
        <p className="text-base font-semibold text-white/75 md:text-xl">{currentSlide.subtitle}</p>
        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{currentSlide.title}</h1>
        <p className="mt-3 text-sm text-white/85 md:text-base">{currentSlide.description}</p>
      </div>
      <div className="mt-8 flex items-center justify-end gap-2.5">
        <div className="flex gap-1.5">
          {HERO_BANNER_SLIDES.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                activeSlide === index ? 'h-2.5 w-8 bg-white/80' : 'h-2.5 w-2.5 bg-white/40'
              }`}
              aria-label={`${index + 1}번 배너로 이동`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white shadow-[0_6px_18px_rgba(0,0,0,0.18)] backdrop-blur-md transition hover:bg-white/25"
          aria-label={isPaused ? '자동 재생' : '일시정지'}
        >
          {isPaused ? <Play size={13} /> : <Pause size={13} />}
        </button>
      </div>
    </section>
  );
};

export const PartnerCard = () => {
  return <article className="h-24 rounded-xl border border-[#D5D5D5] bg-white" />;
};
