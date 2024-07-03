/*
  async getTaskStatusCounts() {
    const statusCounts = await this.prismaService.taskInstance.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    return statusCounts.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));
  }
    @Get('statuscount')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async getStatusCounts() {
    return this.taskInstanceService.getTaskStatusCounts();
  }
 */
import { useQuery } from 'react-query';
import { DateRange } from 'react-day-picker';
type StatusCount = {
  status: string;
  count: number;
};
export async function getStatusCounts(dateRange?: DateRange) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/taskinstance/statuscount${dateRange && `?start=${dateRange.from}&end=${dateRange.to}`}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (e) {
    console.log(e);
  }
}
export function useGetStatusCounts(dateRange?: DateRange) {
  return useQuery<StatusCount[]>('statusCounts', () => getStatusCounts(dateRange));
}
