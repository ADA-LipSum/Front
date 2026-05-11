import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const BANNERS = [
  {
    id: 1,
    src: 'https://velog.velcdn.com/images/hbsps/post/ccc030fd-fdd0-4b40-8a26-fc5d67544410/image.png',
    alt: '공지 배너 1',
  },
  {
    id: 2,
    src: 'https://velog.velcdn.com/images/playername_ltt/post/f2d2225a-dafc-415f-86b4-22f9603737f5/image.png',
    alt: '공지 배너 2',
  },
  {
    id: 3,
    src: 'https://velog.velcdn.com/images%2Fyunsungyang-omc%2Fpost%2F303da7d2-4952-445f-aec3-f1e1b1a0f7d0%2FGroup%201.png',
    alt: '공지 배너 3',
  },
];

export default function AnnounceBanner() {
  return (
    <div className="w-full mb-20">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={3}
        loop
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="rounded-lg border border-gray-200"
        style={
          {
            '--swiper-pagination-color': '#3B82F6',
            '--swiper-pagination-bullet-inactive-color': '#93C5FD',
          } as React.CSSProperties
        }
      >
        {BANNERS.map((banner) => (
          <SwiperSlide key={banner.id}>
            <img src={banner.src} alt={banner.alt} className="w-full h-80 object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
