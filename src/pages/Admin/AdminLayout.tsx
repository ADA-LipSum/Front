import { Outlet, useLocation, Link } from 'react-router-dom';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { AdminSidebar } from './components/AdminSidebar';

const breadcrumbMap: Record<string, string> = {
  '/dashboard/admin': '대시보드',
  '/dashboard/admin/users': '사용자 관리',
  '/dashboard/admin/bans': '제재 관리',
  '/dashboard/admin/reports': '신고 관리',
  '/dashboard/admin/posts': '게시글 / 댓글',
  '/dashboard/admin/notices': '공지사항',
  '/dashboard/admin/coins': '코인 / 포인트',
  '/dashboard/admin/shop': '상점 / 거래',
  '/dashboard/admin/groups': '스터디 그룹',
  '/dashboard/admin/notifications': '알림 발송',
  '/dashboard/admin/s3': 'S3 파일 관리',
  '/dashboard/admin/banners': '배너 관리',
};

export default function AdminLayout() {
  const location = useLocation();
  const currentPage = breadcrumbMap[location.pathname] ?? '관리자';
  const isRoot = location.pathname === '/dashboard/admin';

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex flex-row h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link to="/dashboard/admin" />}>관리자 콘솔</BreadcrumbLink>
              </BreadcrumbItem>
              {!isRoot && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 bg-muted/30 min-h-[calc(100vh-3.5rem)]">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
