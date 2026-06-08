import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Users } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPoll, votePoll, type PollDetail } from '@/api/poll';

interface PollProps {
  postUuid: string;
  initialPoll?: PollDetail | null;
}

function formatEndsAt(endsAt: string): string {
  const end = new Date(endsAt);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return '종료됨';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}일 ${hours}시간 남음`;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}시간 ${minutes}분 남음`;
  return `${minutes}분 남음`;
}

export const Poll = ({ postUuid, initialPoll }: PollProps) => {
  const queryClient = useQueryClient();
  const { data: poll, isLoading } = useQuery({
    queryKey: ['poll', postUuid],
    queryFn: () => getPoll(postUuid),
    initialData: initialPoll ?? undefined,
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [voting, setVoting] = useState(false);
  const [changingVote, setChangingVote] = useState(false);
  const [animateBars, setAnimateBars] = useState(false);

  const hasVoted = poll?.myOptionId !== null && poll?.myOptionId !== undefined;
  const showResults = poll ? ((hasVoted && !changingVote) || poll.ended) : false;

  useEffect(() => {
    if (showResults) {
      const id = requestAnimationFrame(() => setAnimateBars(true));
      return () => cancelAnimationFrame(id);
    } else {
      setAnimateBars(false);
    }
  }, [showResults]);

  if (isLoading || !poll) return null;

  const handleVote = async () => {
    if (!selectedId || voting) return;
    setVoting(true);
    try {
      const updated = await votePoll(postUuid, selectedId);
      queryClient.setQueryData(['poll', postUuid], updated);
      setSelectedId(null);
      setChangingVote(false);
    } catch {
      /* no-op */
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/40 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-indigo-100">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-gray-800 leading-snug">{poll.question}</p>
          <span
            className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
              poll.ended
                ? 'bg-gray-100 text-gray-400'
                : 'bg-indigo-100 text-indigo-600'
            }`}
          >
            {poll.ended ? '종료' : '진행 중'}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Users size={12} />
            {poll.totalVotes}명 참여
          </span>
          {!poll.ended && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} />
              {formatEndsAt(poll.endsAt)}
            </span>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="px-5 py-4 space-y-2.5">
        {poll.options.map((option, index) => {
          const pct =
            poll.totalVotes > 0 ? Math.round((option.voteCount / poll.totalVotes) * 100) : 0;
          const isMyChoice = poll.myOptionId === option.id;
          const isSelected = selectedId === option.id;

          if (showResults) {
            return (
              <div key={option.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {isMyChoice && (
                      <CheckCircle2 size={13} className="text-indigo-500 shrink-0" />
                    )}
                    <span
                      className={`font-medium ${isMyChoice ? 'text-indigo-600' : 'text-gray-700'}`}
                    >
                      {option.text}
                    </span>
                  </div>
                  <span className={`font-semibold ${isMyChoice ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {pct}%
                  </span>
                </div>
                <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out ${
                      isMyChoice ? 'bg-indigo-500' : 'bg-gray-400'
                    }`}
                    style={{
                      width: animateBars ? `${pct}%` : '0%',
                      transitionDelay: animateBars ? `${index * 80}ms` : '0ms',
                    }}
                  />
                </div>
                {!poll.anonymous && option.voters.length > 0 && (
                  <p className="text-xs text-gray-400 pl-0.5">
                    {option.voters.map((v) => v.voterName).join(', ')}
                  </p>
                )}
              </div>
            );
          }

          return (
            <button
              key={option.id}
              disabled={poll.ended}
              onClick={() => setSelectedId(isSelected ? null : option.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                isSelected
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50'
              }`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {/* Vote / Change vote buttons */}
      <div className="px-5 pb-4 flex gap-2">
        {!showResults && !poll.ended && (
          <>
            <button
              onClick={handleVote}
              disabled={!selectedId || voting}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {voting ? '처리 중...' : changingVote ? '변경하기' : '투표하기'}
            </button>
            {changingVote && (
              <button
                onClick={() => { setChangingVote(false); setSelectedId(null); }}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
              >
                취소
              </button>
            )}
          </>
        )}
        {showResults && hasVoted && !poll.ended && (
          <button
            onClick={() => { setChangingVote(true); setSelectedId(poll.myOptionId); }}
            className="w-full py-2 rounded-xl text-sm font-medium border border-indigo-200 text-indigo-500 hover:bg-indigo-50 transition-all"
          >
            투표 변경
          </button>
        )}
      </div>
    </div>
  );
};
