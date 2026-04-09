import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import axios from '@/api/axios';

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

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ContriGraph = () => {
  const { loading: authLoading, isLoggedIn } = useAuthStore();
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [noGithub, setNoGithub] = useState(false);

  useEffect(() => {
    if (authLoading || !isLoggedIn) return;

    axios
      .get('/api/auth/github/contributions')
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          setNoGithub(true);
        }
      })
      .finally(() => setLoading(false));
  }, [authLoading, isLoggedIn]);

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

  const CELL = 13; // cell size px
  const GAP = 3; // gap px
  const STEP = CELL + GAP;

  return (
    <div className="mt-10 border border-gray-300 w-full rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">GitHub Contributions</span>
        <span className="text-xs text-gray-500">
          {data.totalContributions} contributions this year
        </span>
      </div>

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
                        title={`${day.date}: ${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''}`}
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
  );
};

export default ContriGraph;
