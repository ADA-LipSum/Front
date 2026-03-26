import { useSelector } from 'react-redux';
import StackIcon from 'tech-stack-icons';
import type { IconName } from 'tech-stack-icons';
import type { RootState } from '@/store/store';

const TECH_ICON_MAP: Record<string, IconName> = {
  Spring: 'spring',
  'Spring Boot': 'spring',
  Java: 'java',
  Python: 'python',
  TypeScript: 'typescript',
  React: 'react',
  Vue: 'vuejs',
  Angular: 'angular',
  'Node.js': 'nodejs',
  Docker: 'docker',
  Kubernetes: 'kubernetes',
  MySQL: 'mysql',
  PostgreSQL: 'postgresql',
  MongoDB: 'mongodb',
  Redis: 'redis',
  Git: 'git',
  Linux: 'linux',
  Go: 'go',
  Kotlin: 'kotlin',
  Swift: 'swift',
  'C#': 'csharp',
  PHP: 'php',
  Ruby: 'ruby',
  Rust: 'rust',
  Dart: 'dart',
  Flutter: 'flutter',
  'Next.js': 'nextjs',
  'Nest.js': 'nestjs',
  Django: 'django',
  Flask: 'flask',
  Nginx: 'nginx',
  AWS: 'aws',
};

const TechStack = () => {
  const { profile } = useSelector((state: RootState) => state.profile);

  if (!profile?.techStack || profile.techStack.length === 0) return null;

  return (
    <div className="mt-5 w-100 h-auto rounded-lg flex flex-col items-center p-4">
      <div className="flex flex-wrap gap-3 items-center">
        {profile.techStack.map((tech) => {
          const iconName = TECH_ICON_MAP[tech];
          if (!iconName) return null;
          return (
            <div
              key={tech}
              className="relative group flex flex-col items-center hover:scale-110 transition-transform"
            >
              <div className="w-10 h-10">
                <StackIcon name={iconName} className="w-full h-full" />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {tech}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechStack;
