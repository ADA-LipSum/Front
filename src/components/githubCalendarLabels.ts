import { type Props as CalendarProps } from 'react-activity-calendar';

export const labels = {
  months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  weekdays: ['일', '월', '화', '수', '목', '금', '토'],
  totalCount: '{{count}} activities in {{year}}',
  legend: {
    less: 'Less',
    more: 'More',
  },
} satisfies CalendarProps['labels'];

// <ActivityCalendar data={data} labels={labels} showWeekdayLabels />
