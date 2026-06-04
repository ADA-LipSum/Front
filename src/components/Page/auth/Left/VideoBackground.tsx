import TestVideo from '@/assets/2025 경북소프트웨어마이스터고등학교 공식 소개영상 - 미래의 삶을 코딩하는 소프트웨어 마이스터 양성🖥.mp4';

export const VideoBackground = () => {
  return (
    <>
      <video className="w-full h-full object-cover" src={TestVideo} autoPlay loop muted />
      <div className="absolute inset-0 bg-black opacity-40" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/30 to-transparent" />
    </>
  );
};
