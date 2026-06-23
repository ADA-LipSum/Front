import { useProfileStore } from '@/store/profileStore';

const Intro = () => {
  const { profile } = useProfileStore();

  return (
    <div className="text-center mt-2 w-full max-w-3xl mx-auto">
      {profile?.intro ? (
        <p className="text-gray-600">
          {profile.intro
            .split('\n')
            .flatMap((line: string | any[], li: number, lines: string | any[]) => {
              const chunks = Array.from({ length: Math.ceil(line.length / 100) || 1 }, (_, i) =>
                line.slice(i * 100, (i + 1) * 100),
              );
              return chunks.flatMap((chunk, ci, arr) => {
                const isLastChunk = ci === arr.length - 1;
                const isLastLine = li === lines.length - 1;
                return [
                  <span key={`${li}-${ci}`}>{chunk}</span>,
                  ...(isLastChunk && isLastLine ? [] : [<br key={`br-${li}-${ci}`} />]),
                ];
              });
            })}
        </p>
      ) : (
        <p className="text-gray-600"></p>
      )}
    </div>
  );
};

export default Intro;
