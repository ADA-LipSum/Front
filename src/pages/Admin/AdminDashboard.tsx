import { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  ShieldX,
  ShoppingCart,
  FileText,
  BookOpen,
  ArrowRight,
  Bell,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAdminStats, type AdminStats } from '@/api/admin';

function QuickActionCard({
  title,
  description,
  href,
  badge,
  badgeVariant = 'secondary',
}: {
  title: string;
  description: string;
  href: string;
  badge?: string;
  badgeVariant?: 'secondary' | 'destructive' | 'outline';
}) {
  return (
    <Link to={href} className="block group">
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{title}</span>
            {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
    </Link>
  );
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  color,
  bg,
  href,
  loading,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  href: string;
  loading: boolean;
}) {
  return (
    <Link to={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={`p-2 rounded-lg ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    getAdminStats()
      .then(setStats)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: '전체 사용자',
      value: stats?.totalUsers.toLocaleString() ?? '-',
      sub: `학생 ${stats?.totalStudents.toLocaleString() ?? '-'} · 선생님 ${stats?.totalTeachers.toLocaleString() ?? '-'}`,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      href: '/dashboard/admin/users',
    },
    {
      title: '활성 제재',
      value: stats?.activeBans.toLocaleString() ?? '-',
      sub: '현재 제재 중인 사용자',
      icon: ShieldX,
      color: 'text-red-500',
      bg: 'bg-red-50',
      href: '/dashboard/admin/bans',
    },
    {
      title: '전체 게시글',
      value: stats?.totalPosts.toLocaleString() ?? '-',
      sub: `댓글 ${stats?.totalComments.toLocaleString() ?? '-'}개`,
      icon: FileText,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      href: '/dashboard/admin/posts',
    },
    {
      title: '전체 거래',
      value: stats?.totalTradeOrders.toLocaleString() ?? '-',
      sub: '누적 거래 주문 수',
      icon: ShoppingCart,
      color: 'text-green-500',
      bg: 'bg-green-50',
      href: '/dashboard/admin/shop',
    },
    {
      title: '스터디 그룹',
      value: stats?.totalGroups.toLocaleString() ?? '-',
      sub: '전체 스터디 그룹 수',
      icon: BookOpen,
      color: 'text-cyan-500',
      bg: 'bg-cyan-50',
      href: '/dashboard/admin/groups',
    },
    {
      title: '전체 알림',
      value: stats?.totalNotifications.toLocaleString() ?? '-',
      sub: '누적 발송 알림 수',
      icon: Bell,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      href: '/dashboard/admin/notifications',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
          <p className="text-sm text-muted-foreground mt-0.5">서비스 현황을 한눈에 확인하세요.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <TrendingUp className="mr-2 h-4 w-4" />
          )}
          새로고침
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} loading={loading} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">빠른 작업</CardTitle>
            <CardDescription>주요 관리 메뉴로 빠르게 이동합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <QuickActionCard
              title="신규 사용자 생성"
              description="관리자가 직접 계정을 생성합니다."
              href="/dashboard/admin/users"
            />
            <QuickActionCard
              title="공지사항 작성"
              description="전체 공지를 등록합니다."
              href="/dashboard/admin/notices"
            />
            <QuickActionCard
              title="알림 발송"
              description="전체 또는 역할별 알림을 보냅니다."
              href="/dashboard/admin/notifications"
            />
            <QuickActionCard
              title="코인 / 포인트 지급"
              description="사용자 코인 및 포인트를 조정합니다."
              href="/dashboard/admin/coins"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">운영 현황</CardTitle>
            <CardDescription>서비스 운영 상태를 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <QuickActionCard
              title="제재 현황"
              description="현재 활성된 제재 목록을 확인합니다."
              href="/dashboard/admin/bans"
              badge={stats ? `활성 ${stats.activeBans}건` : undefined}
              badgeVariant="destructive"
            />
            <QuickActionCard
              title="게시글 관리"
              description="전체 게시글을 조회하고 관리합니다."
              href="/dashboard/admin/posts"
              badge={stats ? `${stats.totalPosts.toLocaleString()}건` : undefined}
            />
            <QuickActionCard
              title="상점 아이템 관리"
              description="거래소 아이템과 재고를 관리합니다."
              href="/dashboard/admin/shop"
            />
            <QuickActionCard
              title="스터디 그룹 관리"
              description="그룹 현황을 조회하고 관리합니다."
              href="/dashboard/admin/groups"
              badge={stats ? `${stats.totalGroups}개` : undefined}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
