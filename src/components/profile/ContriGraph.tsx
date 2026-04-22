import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getProfileGitHubContributions } from '@/api/github';

interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface Props {
  githubLogin: string;
}

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

interface Tooltip {
  date: string;
  count: number;
  x: number;
  y: number;
}

const ContriGraph = ({ githubLogin }: Props) => {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [noGithub, setNoGithub] = useState(false);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  useEffect(() => {
    if (!githubLogin) return;

    getProfileGitHubContributions(githubLogin)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        if (err.response?.status === 400 || err.response?.status === 404) {
          setNoGithub(true);
        }
      })
      .finally(() => setLoading(false));
  }, [githubLogin]);

  if (loading) return null;
  if (noGithub || !data) return null;

  // Build month labels: find the first week index where a new month starts
  const monthLabels: { label: string; weekIndex: number }[] = [];
  data.weeks.forEach((week, wi) => {
    const firstDay = week.contributionDays[0];
    if (!firstDay) return;
    const d = new Date(firstDay.date);
    const month = d.toLocaleString('default', { month: 'short' });
    if (monthLabels.length === 0 || monthLabels[monthLabels.length - 1].label !== month) {
      monthLabels.push({ label: month, weekIndex: wi });
    }
  });

  const CELL = 13; // 셀 크기 px
  const GAP = 3; // 셀 간격 px
  const STEP = CELL + GAP;

  return (
    <>
    <div className="mt-10 w-full rounded-lg p-4" onMouseLeave={() => setTooltip(null)}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Month labels */}
          <div style={{ display: 'flex', marginLeft: 28, marginBottom: 2 }}>
            {data.weeks.map((_, wi) => {
              const ml = monthLabels.find((m) => m.weekIndex === wi);
              return (
                <div
                  key={wi}
                  style={{ width: STEP, flexShrink: 0, fontSize: 10, color: '#6b7280' }}
                >
                  {ml ? ml.label : ''}
                </div>
              );
            })}
          </div>

          {/* Grid: day labels + cells */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: 0 }}>
            {/* Day-of-week labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: GAP, marginRight: 4 }}>
              {DAY_LABELS.map((day, di) => (
                <div
                  key={day}
                  style={{
                    height: CELL,
                    width: 24,
                    fontSize: 8,
                    color: '#6b7280',
                    lineHeight: `${CELL}px`,
                    textAlign: 'right',
                    paddingRight: 2,
                  }}
                >
                  {di % 2 === 1 ? day : ''}
                </div>
              ))}
            </div>

            {/* Contribution cells */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: GAP }}>
              {data.weeks.map((week, wi) => (
                <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
                  {Array.from({ length: 7 }).map((_, di) => {
                    const day = week.contributionDays[di];
                    if (!day) {
                      return (
                        <div
                          key={di}
                          style={{
                            width: CELL,
                            height: CELL,
                            borderRadius: 2,
                            background: 'transparent',
                          }}
                        />
                      );
                    }
                    return (
                      <div
                        key={di}
                        onMouseEnter={(e) => {
                          const rect = (e.target as HTMLElement).getBoundingClientRect();
                          setTooltip({
                            date: day.date,
                            count: day.contributionCount,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        style={{
                          width: CELL,
                          height: CELL,
                          borderRadius: 2,
                          background: day.color,
                          cursor: 'default',
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, marginLeft: 28 }}
          >
            <span style={{ fontSize: 9, color: '#6b7280' }}>Less</span>
            {['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'].map((c) => (
              <div key={c} style={{ width: CELL, height: CELL, borderRadius: 2, background: c }} />
            ))}
            <span style={{ fontSize: 9, color: '#6b7280' }}>More</span>
          </div>
        </div>
      </div>
    </div>
    {tooltip &&
      createPortal(
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y - 6,
            transform: 'translate(-50%, -100%)',
            background: '#1f2937',
            color: '#f9fafb',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 11,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          {tooltip.date} — {tooltip.count}회
        </div>,
        document.body,
      )}
    </>
  );
};

export default ContriGraph;
