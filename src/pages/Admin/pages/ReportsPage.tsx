import { useState } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';

type ReportStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED';

interface MockReport {
  reportId: number;
  reporterNickname: string;
  targetNickname: string;
  reason: string;
  contentType: string;
  createdAt: string;
  status: ReportStatus;
}

const INITIAL_REPORTS: MockReport[] = [
  { reportId: 1, reporterNickname: '홍길동', targetNickname: '어뷰저', reason: '욕설 및 혐오 발언', contentType: '게시글', createdAt: '2024-01-15', status: 'PENDING' },
  { reportId: 2, reporterNickname: '이순신', targetNickname: '스패머', reason: '광고성 스팸 게시글', contentType: '댓글', createdAt: '2024-01-14', status: 'PENDING' },
  { reportId: 3, reporterNickname: '세종대왕', targetNickname: '허위정보유포자', reason: '허위 정보 유포', contentType: '게시글', createdAt: '2024-01-13', status: 'RESOLVED' },
  { reportId: 4, reporterNickname: '강감찬', targetNickname: '도배범', reason: '반복 도배', contentType: '댓글', createdAt: '2024-01-12', status: 'DISMISSED' },
  { reportId: 5, reporterNickname: '김선생', targetNickname: '불량유저', reason: '개인 정보 유출 시도', contentType: '게시글', createdAt: '2024-01-11', status: 'PENDING' },
];

const STATUS_LABELS: Record<ReportStatus, string> = { PENDING: '대기', RESOLVED: '처리 완료', DISMISSED: '기각' };
const STATUS_VARIANTS: Record<ReportStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  PENDING: 'destructive', RESOLVED: 'default', DISMISSED: 'outline',
};

type SortDir = 'asc' | 'desc';
type SortConfig = { field: keyof MockReport; dir: SortDir } | null;

function SortHead({
  label, field, sort, onSort,
}: {
  label: string; field: keyof MockReport; sort: SortConfig; onSort: (f: keyof MockReport) => void;
}) {
  const active = sort?.field === field;
  const Icon = active ? (sort!.dir === 'asc' ? ChevronUp : ChevronDown) : ChevronsUpDown;
  return (
    <TableHead className="cursor-pointer select-none" onClick={() => onSort(field)}>
      <div className="flex items-center gap-1">
        {label}
        <Icon className={cn('h-3 w-3 shrink-0', !active && 'opacity-40')} />
      </div>
    </TableHead>
  );
}

export default function ReportsPage() {
  const [reports, setReports] = useState<MockReport[]>(INITIAL_REPORTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sort, setSort] = useState<SortConfig>(null);

  const handleSort = (field: keyof MockReport) =>
    setSort((prev) =>
      prev?.field === field ? (prev.dir === 'asc' ? { field, dir: 'desc' } : null) : { field, dir: 'asc' },
    );

  const filtered = reports.filter((r) => {
    const matchSearch = !search || r.reporterNickname.toLowerCase().includes(search.toLowerCase()) || r.targetNickname.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchType = typeFilter === 'all' || r.contentType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const sorted = sort
    ? [...filtered].sort((a, b) => {
        const va = a[sort.field];
        const vb = b[sort.field];
        const cmp = typeof va === 'number' && typeof vb === 'number'
          ? va - vb
          : String(va ?? '').localeCompare(String(vb ?? ''), 'ko');
        return sort.dir === 'asc' ? cmp : -cmp;
      })
    : filtered;

  const handleStatusChange = (reportId: number, status: ReportStatus) => {
    setReports((prev) => prev.map((r) => r.reportId === reportId ? { ...r, status } : r));
    toast.success('신고 상태를 변경했습니다.');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">신고 관리</h1>
        <p className="text-sm text-muted-foreground mt-0.5">사용자 신고를 검토하고 처리합니다.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="신고자 / 피신고자 검색..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8" />
            </div>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? 'all')}>
              <SelectTrigger className="w-28 h-8"><SelectValue placeholder="유형" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 유형</SelectItem>
                <SelectItem value="게시글">게시글</SelectItem>
                <SelectItem value="댓글">댓글</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
              <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="PENDING">대기 중</SelectItem>
                <SelectItem value="RESOLVED">처리 완료</SelectItem>
                <SelectItem value="DISMISSED">기각</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <SortHead label="신고자" field="reporterNickname" sort={sort} onSort={handleSort} />
                <SortHead label="피신고자" field="targetNickname" sort={sort} onSort={handleSort} />
                <SortHead label="사유" field="reason" sort={sort} onSort={handleSort} />
                <SortHead label="유형" field="contentType" sort={sort} onSort={handleSort} />
                <SortHead label="신고일" field="createdAt" sort={sort} onSort={handleSort} />
                <SortHead label="상태" field="status" sort={sort} onSort={handleSort} />
                <TableHead>처리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((report) => (
                <TableRow key={report.reportId}>
                  <TableCell className="text-sm font-medium">{report.reporterNickname}</TableCell>
                  <TableCell className="text-sm">{report.targetNickname}</TableCell>
                  <TableCell className="text-sm max-w-[180px] truncate">{report.reason}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{report.contentType}</Badge></TableCell>
                  <TableCell className="text-sm">{report.createdAt}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[report.status]}>{STATUS_LABELS[report.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    {report.status === 'PENDING' && (
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleStatusChange(report.reportId, 'RESOLVED')}>처리</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => handleStatusChange(report.reportId, 'DISMISSED')}>기각</Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">신고 내역이 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
