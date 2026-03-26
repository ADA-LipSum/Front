import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Globe } from 'lucide-react';

import GitHub from '@/assets/GitHub.png';
import Linkedin from '@/assets/Linkedin.png';
import Notion from '@/assets/Notion.png';

const SocialLinks = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);
  const socialLinks = profile?.socialLinks;

  if (!socialLinks) return null;

  const links = [
    { url: socialLinks.githubUrl, icon: <img src={GitHub} width={22} height={22} alt="GitHub" />, label: 'GitHub' },
    { url: socialLinks.notionUrl, icon: <img src={Notion} width={22} height={22} alt="Notion" />, label: 'Notion' },
    { url: socialLinks.linkedinUrl, icon: <img src={Linkedin} width={22} height={22} alt="LinkedIn" />, label: 'LinkedIn' },
    { url: socialLinks.personalWebsiteUrl, icon: <Globe size={22} />, label: 'Website' },
  ].filter((link) => link.url);

  if (links.length === 0) return null;

  return (
    <div className="flex gap-4 mt-3">
      {links.map(({ url, icon, label }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-gray-500 hover:text-gray-900 transition-colors"
        >
          {icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
