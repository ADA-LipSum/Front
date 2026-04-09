import { useEffect, useState } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { getProjects } from '@/api/profile';

interface Project {
  id: number;
  userUuid: string;
  title: string;
  description: string;
  githubUrl: string;
  lookingForTeam: boolean;
  createdAt: string;
}

const ProjectList = () => {
  const { profile } = useProfileStore();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!profile?.uuid) return;

    getProjects(profile.uuid).then((data: Project[]) => {
      setProjects(data.slice(0, 3));
    });
  }, [profile?.uuid]);

  if (projects.length === 0) return null;

  return (
    <div className="mt-10 w-full">
      <p className="text-sm font-semibold text-gray-700 mb-3">Projects</p>
      <div className="grid grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-300 rounded-lg p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-sm truncate">{project.title}</span>
              {project.lookingForTeam && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                  팀원 모집 중
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">{project.description}</p>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-700 truncate mt-auto"
            >
              {project.githubUrl}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
