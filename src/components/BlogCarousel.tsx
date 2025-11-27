import { useRef, useState, useEffect } from 'react';

import { Icon } from '@iconify/react';

export interface BlogItem {
  title: string;
  description: string;
  url: string;
}

interface BlogCarouselProps {
  data: BlogItem[];
}

export default function BlogCarousel({ data }: BlogCarouselProps) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 3;
  const maxIndex = Math.ceil(data.length / itemsPerPage) - 1;

  // ⭐ 이동할 거리(px)를 계산
  const [slideWidth, setSlideWidth] = useState(0);

  useEffect(() => {
    if (trackRef.current) {
      const firstCard = trackRef.current.children[0] as HTMLElement;

      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const style = window.getComputedStyle(trackRef.current);
        const gap = parseInt(style.gap || '0', 10);

        // 카드 3개 + gap 2개
        setSlideWidth(cardWidth * itemsPerPage + gap * itemsPerPage);
      }
    }
  }, [data]);

  const handlePrev = () => setIndex(prev => Math.max(prev - 1, 0));
  const handleNext = () => setIndex(prev => Math.min(prev + 1, maxIndex));

  return (
    <div className="relative w-full overflow-hidden h-4/5">
      <div
        ref={trackRef}
        className="flex h-full gap-3 p-4 transition-transform duration-500"
        style={{
          transform: `translateX(-${index * slideWidth}px)`,
          width: `${(data.length / itemsPerPage) * 100}%`,
        }}
      >
        {data.map((item, idx) => (
          <div key={idx} className="w-1/3 h-full mb-2 rounded-lg shadow-lg hover:bg-gray-100">
            <div className="bg-gray-500 h-2/5 rounded-t-2xl"></div>
            <section className="p-4">
              <p className="mb-2 font-bold text-md">{item.title}</p>
              <p className="text-sm font-bold text-gray-500">{item.description}</p>
            </section>
          </div>
        ))}
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-0 p-2 -translate-y-1/2 bg-white rounded-full shadow top-1/2"
      >
        <Icon icon="mdi:chevron-left" width="16" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 p-2 -translate-y-1/2 bg-white rounded-full shadow top-1/2"
      >
        <Icon icon="mdi:chevron-right" width="16" />
      </button>
    </div>
  );
}
