import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldX,
  Flag,
  FileText,
  Bell,
  Coins,
  ShoppingBag,
  BookOpen,
  BellRing,
  HardDrive,
  Image,
  LogOut,
  ChevronDown,
  Settings,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const navMain = [
  { title: '대시보드', href: '/dashboard/admin', icon: LayoutDashboard, exact: true },
];

const navManagement = [
  { title: '사용자 관리', href: '/dashboard/admin/users', icon: Users },
  { title: '제재 관리', href: '/dashboard/admin/bans', icon: ShieldX },
  { title: '신고 관리', href: '/dashboard/admin/reports', icon: Flag },
  { title: '게시글 / 댓글', href: '/dashboard/admin/posts', icon: FileText },
  { title: '공지사항', href: '/dashboard/admin/notices', icon: Bell },
];

const navFinance = [
  { title: '코인 / 포인트', href: '/dashboard/admin/coins', icon: Coins },
  { title: '상점 / 거래', href: '/dashboard/admin/shop', icon: ShoppingBag },
];

const navCommunity = [
  { title: '스터디 그룹', href: '/dashboard/admin/groups', icon: BookOpen },
  { title: '알림 발송', href: '/dashboard/admin/notifications', icon: BellRing },
];

const navSystem = [
  { title: 'S3 파일 관리', href: '/dashboard/admin/s3', icon: HardDrive },
  { title: '배너 관리', href: '/dashboard/admin/banners', icon: Image },
];

interface NavGroupProps {
  label: string;
  items: { title: string; href: string; icon: React.ElementType; exact?: boolean }[];
}

function NavGroup({ label, items }: NavGroupProps) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.title}
                  render={<NavLink to={item.href} />}
                >
                  <item.icon size={16} />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AdminSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-2">
        <NavLink
          to="/dashboard/admin"
          className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 transition-[width,padding] duration-200 ease-linear group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            L
          </div>
          <div className="grid flex-1 text-sm leading-tight">
            <span className="truncate font-semibold text-sidebar-foreground">LipSum</span>
            <span className="truncate text-xs text-sidebar-foreground/50">관리자 콘솔</span>
          </div>
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-2">
        <NavGroup label="개요" items={navMain} />
        <NavGroup label="관리" items={navManagement} />
        <NavGroup label="재정" items={navFinance} />
        <NavGroup label="커뮤니티" items={navCommunity} />
        <NavGroup label="시스템" items={navSystem} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2 group-data-[collapsible=icon]:px-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  'flex w-full items-center gap-2 rounded-md p-2 text-left text-sm',
                  'group-data-[collapsible=icon]:px-2',
                  'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                  'transition-colors',
                )}
              >
                <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                  <AvatarImage src={user?.profileImage} alt={user?.userNickname} />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
                    {user?.userNickname?.charAt(0) ?? 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">{user?.userNickname}</span>
                  <span className="truncate text-xs opacity-60">{user?.adminId}</span>
                </div>
                <ChevronDown className="ml-auto size-4 opacity-50 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" sideOffset={4} className="w-56">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate('/settings/account')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  계정 설정
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
