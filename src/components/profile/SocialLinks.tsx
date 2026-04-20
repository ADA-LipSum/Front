import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Globe, X } from 'lucide-react';

import GitHub from '@/assets/GitHub.png';
import Linkedin from '@/assets/Linkedin.png';
import Notion from '@/assets/Notion.png';

interface EditValues {
  githubUrl: string;
  notionUrl: string;
  linkedinUrl: string;
  personalWebsiteUrl: string;
}

interface SocialLinksProps {
  isEditing?: boolean;
  editValues?: EditValues;
  onChange?: (key: keyof EditValues, value: string) => void;
}

const SOCIAL_FIELDS: {
  key: keyof EditValues;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
}[] = [
  {
    key: 'githubUrl',
    label: 'GitHub',
    placeholder: 'https://github.com/username',
    icon: <img src={GitHub} width={20} height={20} alt="GitHub" className="opacity-70" />,
  },
  {
    key: 'notionUrl',
    label: 'Notion',
    placeholder: 'https://notion.so/username',
    icon: <img src={Notion} width={20} height={20} alt="Notion" className="opacity-70" />,
  },
  {
    key: 'linkedinUrl',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/username',
    icon: <img src={Linkedin} width={20} height={20} alt="LinkedIn" className="opacity-70" />,
  },
  {
    key: 'personalWebsiteUrl',
    label: '개인 웹사이트',
    placeholder: 'https://example.com',
    icon: <Globe size={20} className="text-gray-400" />,
  },
];

const isValidUrl = (value: string) => {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const SocialLinks = ({ isEditing = false, editValues, onChange }: SocialLinksProps) => {
  const profile = useSelector((state: RootState) => state.profile.profile);
  const socialLinks = profile?.socialLinks;

  if (isEditing && editValues && onChange) {
    return (
      <div className="w-full max-w-6xl mt-6">
        <p className="text-sm font-semibold text-gray-400 mb-3 tracking-wide">소셜 링크</p>
        <div className="flex flex-col gap-3">
          {SOCIAL_FIELDS.map(({ key, label, placeholder, icon }) => {
            const value = editValues[key];
            const invalid = !isValidUrl(value);
            return (
              <div key={key}>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 shrink-0 flex items-center justify-center">{icon}</div>
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={value}
                      onChange={(e) => onChange(key, e.target.value)}
                      placeholder={placeholder}
                      className={`text-slate-700 text-sm border border-slate-200 rounded-md w-full placeholder:text-slate-400 px-3 py-2 pr-8 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${
                        invalid
                          ? 'border-red-400 focus:border-red-400'
                          : 'border-gray-300 focus:border-blue-400'
                      }`}
                    />
                    {value && (
                      <button
                        type="button"
                        onClick={() => onChange(key, '')}
                        aria-label={`${label} 지우기`}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
                {invalid && (
                  <p className="text-xs text-red-400 mt-1 ml-9">올바른 URL 형식으로 입력해주세요</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!socialLinks) return null;

  const links = [
    {
      url: socialLinks.githubUrl,
      icon: <img src={GitHub} width={22} height={22} alt="GitHub" />,
      label: 'GitHub',
    },
    {
      url: socialLinks.notionUrl,
      icon: <img src={Notion} width={22} height={22} alt="Notion" />,
      label: 'Notion',
    },
    {
      url: socialLinks.linkedinUrl,
      icon: <img src={Linkedin} width={22} height={22} alt="LinkedIn" />,
      label: 'LinkedIn',
    },
    { url: socialLinks.personalWebsiteUrl, icon: <Globe size={22} />, label: 'Website' },
  ].filter((link) => link.url);

  if (links.length === 0) return null;

  return (
    <div className="px-4 py-2 absolute left-4 top-110 flex gap-4">
      {links.map(({ url, icon, label }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-gray-500 hover:text-gray-900 transition-colors hover:scale-110"
        >
          {icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
