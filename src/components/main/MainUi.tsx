import { Eye, MessageSquare, ThumbsUp } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

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
  image?: string;
}

export const NoticeCard = ({ title, footer, image }: NoticeCardProps) => {
  return (
    <article className="flex flex-col rounded-xl bg-[#E7E7E7] overflow-hidden">
      <div className="h-36 w-full bg-[#D4D4D4] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            width={600}
            height={144}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-[#CACACA]" />
        )}
      </div>
      <div className="flex flex-col justify-between px-6 py-4 gap-1">
        <h3 className="text-base font-semibold text-[#1F1F1F]">{title}</h3>
        <p className="text-sm font-semibold text-[#2D2D2D]">{footer}</p>
      </div>
    </article>
  );
};

export interface MealMenuProps {
  items: string[];
}

export const MealMenu = ({ items }: MealMenuProps) => {
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

interface HeroBannerTextProps {
  subtitle: string;
  title: string;
  description: string;
}

const HeroBannerText = ({ subtitle, title, description }: HeroBannerTextProps) => (
  <div className="relative z-10 flex h-full flex-col items-start justify-end px-8 py-8 md:px-20">
    <p className="text-base font-semibold text-white/75 md:text-xl">{subtitle}</p>
    <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{title}</h1>
    <p className="mt-3 text-sm text-white/85 md:text-base">{description}</p>
  </div>
);

export interface HeroBannerProps extends HeroBannerTextProps {
  imageUrl: string;
}

export const HeroBanner = ({ subtitle, title, description, imageUrl }: HeroBannerProps) => {
  return (
    <section className="relative h-64 overflow-hidden text-white">
      <img
        src={imageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover blur-xs brightness-60"
        loading="eager"
      />
      <HeroBannerText subtitle={subtitle} title={title} description={description} />
    </section>
  );
};

export interface HeroBannerVideoProps extends HeroBannerTextProps {
  videoUrl: string;
}

const extractYouTubeId = (url: string): string | null => {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

export const HeroBannerVideo = ({
  subtitle,
  title,
  description,
  videoUrl,
}: HeroBannerVideoProps) => {
  const videoId = extractYouTubeId(videoUrl);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&playsinline=1`
    : null;

  return (
    <section className="relative h-80 overflow-hidden text-white">
      {embedUrl && (
        <div className="absolute inset-0 pointer-events-none">
          <iframe
            src={embedUrl}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 brightness-60"
            style={{ width: '177.78vh', height: '56.25vw', minWidth: '100%', minHeight: '100%' }}
            allow="autoplay; encrypted-media"
            title="hero background video"
          />
        </div>
      )}
      {/* <HeroBannerText subtitle={subtitle} title={title} description={description} /> */}
    </section>
  );
};

interface PartnerCardProps {
  logoUrl: string;
  partnerName: string;
}

export interface PartnerTickerProps {
  partners: PartnerCardProps[];
}

export const PartnerTicker = ({ partners }: PartnerTickerProps) => {
  return (
    <div className="rounded-2xl bg-white/50 p-2 overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        spaceBetween={20}
        loop={true}
        allowTouchMove={false}
        autoplay={{ delay: 0, disableOnInteraction: false }}
        speed={6000}
      >
        {partners.map((partner, index) => (
          <SwiperSlide key={`${index}`} className="w-42.5!">
            <PartnerCard logoUrl={partner.logoUrl} partnerName={partner.partnerName} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export const PartnerCard = ({ logoUrl, partnerName }: PartnerCardProps) => {
  return (
    <article className="flex flex-col h-30 py-4 rounded-xl border border-[#D5D5D5] bg-white">
      <img
        src={`${logoUrl}`}
        alt={partnerName}
        width={160}
        height={96}
        className="mx-auto h-4/5 object-contain p-2"
        loading="lazy"
      />
      <p className="text-center text-sm font-medium text-[#333]">{partnerName}</p>
    </article>
  );
};
