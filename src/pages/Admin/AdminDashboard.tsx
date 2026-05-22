import { TrendingUp, Users, ShieldX, Flag, ShoppingCart, FileText, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const MOCK_STATS = {
  totalUsers: 1284,
  activeUsers: 1201,
  activeBans: 7,
  pendingReports: 12,
  todayTrades: 43,
  totalPosts: 5820,
  activeGroups: 34,
};

const statCards = [
  {
    title: '전체 사용자',
    value: MOCK_STATS.totalUsers.toLocaleString(),
    sub: `활성 ${MOCK_STATS.activeUsers.toLocaleString()}명`,
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    href: '/dashboard/admin/users',
  },
  {
    title: '활성 제재',
    value: MOCK_STATS.activeBans.toLocaleString(),
    sub: '현재 제재 중인 사용자',
    icon: ShieldX,
    color: 'text-red-500',
    bg: 'bg-red-50',
    href: '/dashboard/admin/bans',
  },
  {
    title: '미처리 신고',
    value: MOCK_STATS.pendingReports.toLocaleString(),
    sub: '검토 대기 중',
    icon: Flag,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    href: '/dashboard/admin/reports',
  },
  {
    title: '오늘 거래',
    value: MOCK_STATS.todayTrades.toLocaleString(),
    sub: '건',
    icon: ShoppingCart,
    color: 'text-green-500',
    bg: 'bg-green-50',
    href: '/dashboard/admin/shop',
  },
  {
    title: '전체 게시글',
    value: MOCK_STATS.totalPosts.toLocaleString(),
    sub: '누적 게시글 수',
    icon: FileText,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    href: '/dashboard/admin/posts',
  },
  {
    title: '활성 그룹',
    value: MOCK_STATS.activeGroups.toLocaleString(),
    sub: '스터디 그룹',
    icon: BookOpen,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
    href: '/dashboard/admin/groups',
  },
];

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

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
          <p className="text-sm text-muted-foreground mt-0.5">서비스 현황을 한눈에 확인하세요.</p>
        </div>
        <Button variant="outline" size="sm">
          <TrendingUp className="mr-2 h-4 w-4" />
          새로고침
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Link key={card.title} to={card.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
              </CardContent>
            </Card>
          </Link>
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
              title="신고 처리"
              description="대기 중인 신고를 검토합니다."
              href="/dashboard/admin/reports"
              badge={`${MOCK_STATS.pendingReports}건 대기`}
              badgeVariant="destructive"
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
              badge={`활성 ${MOCK_STATS.activeBans}건`}
              badgeVariant="destructive"
            />
            <QuickActionCard
              title="상점 아이템 관리"
              description="거래소 아이템과 재고를 관리합니다."
              href="/dashboard/admin/shop"
            />
            <QuickActionCard
              title="코인 / 포인트 지급"
              description="사용자 코인 및 포인트를 조정합니다."
              href="/dashboard/admin/coins"
            />
            <QuickActionCard
              title="스터디 그룹 관리"
              description="그룹 현황을 조회하고 관리합니다."
              href="/dashboard/admin/groups"
              badge={`${MOCK_STATS.activeGroups}개 활성`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
