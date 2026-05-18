import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { getCommunityBanner } from '@/api/community';

export interface Banner {
  id: number;
  imageUrl: string;
  title: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AnnounceBanner() {
  const [BANNERS, setBANNERS] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      const banners = await getCommunityBanner();
      setBANNERS(banners as Banner[]);
    };

    fetchBanners();
  }, []);

  return (
    <div className="w-5xl mb-5 mx-auto">
      <Swiper
        key={BANNERS.length}
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        observer
        observeParents
        pagination={{ clickable: true }}
        className="rounded-lg border border-gray-200"
        style={
          {
            '--swiper-pagination-color': '#3B82F6',
            '--swiper-pagination-bullet-inactive-color': '#93C5FD',
          } as React.CSSProperties
        }
      >
        {BANNERS.map((banner: Banner) => (
          <SwiperSlide key={banner.id}>
            <img src={banner.imageUrl} alt={banner.title} className="w-5xl h-80 object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
