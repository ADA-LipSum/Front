import { VideoBackground } from './VideoBackground';
import { LoginLogo } from './LoginLogo';
import { Footer } from './Footer';

export const LeftSection = () => {
  return (
    <div className="relative w-1/2 h-screen overflow-hidden">
      <VideoBackground />
      <LoginLogo />
      <Footer />
    </div>
  );
};
