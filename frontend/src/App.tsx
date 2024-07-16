import MyMapComponent from '@/components/test.tsx';
import CreateRoomForm from '@/components/forms/CreateRoomForm.tsx';
import { useGetStatusCounts } from '@/queries/getStatusCounts.ts';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { mapStatusToReadable } from '@/utils/mapStatusToReadable.ts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar.tsx';
import { format, startOfWeek, startOfYear } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useGetTop5Contracts } from '@/queries/topContracts.ts';
import { useGetTopEmployees } from '@/queries/topEmployees.ts';
import { useGetUnderstaffedTaskInstances } from '@/queries/getUnderstaffedTaskInstances.ts';
import { useGetEmployeeUtils } from '@/queries/getEmployeeUtils.ts';
import { useGetEfficiency } from '@/queries/taskLoadEfficiency.ts';
function App() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfWeek(new Date(), { weekStartsOn: 1 }),
    to: new Date(),
  });

  const { data: statusCounts, error: errorStatusCounts, isLoading: isLoadingStatusCounts } = useGetStatusCounts(date);

  const { data: top5Contracts, error: errorTop5Contracts, isLoading: isLoadingTop5Contracts } = useGetTop5Contracts();
  const { data: top10Employees, error: errorTop10Employees, isLoading: isLoadingTop10Employees } = useGetTopEmployees();
  const {
    data: underStaffed,
    error: errorUnderStaffed,
    isLoading: isLoadingUnderStaffed,
  } = useGetUnderstaffedTaskInstances();
  const { data: employeeUtils, error: errorEmployeeUtils, isLoading: isLoadingEmployeeUtils } = useGetEmployeeUtils();
  const statusCountSeries = statusCounts ? statusCounts.map((item) => item.count) : [];
  const statusCountLabels = statusCounts
    ? statusCounts.map((item) => mapStatusToReadable[item.status as keyof typeof mapStatusToReadable])
    : [];
  const top5ContractsMapped =
    !isLoadingTop5Contracts && top5Contracts
      ? top5Contracts.map((contract) => {
          return contract.taskTemplates.reduce((total, taskTemplate) => {
            return total + taskTemplate._count.TaskSchedule;
          }, 0);
        })
      : [];
  const top5ContractsData = [
    {
      data: top5Contracts
        ? top5ContractsMapped.map((item, index) => ({
            x: top5Contracts[index].title,
            y: item,
          }))
        : [],
    },
  ];
  const top5ContractsLabels = top5Contracts && top5Contracts.map((item) => item.title);
  const top10EmployeesData = [
    {
      data: top10Employees
        ? top10Employees.map((employee) => ({
            x: employee.name,
            y: employee.completedTaskCount,
          }))
        : [],
    },
  ];
  const top10EmoployeesLabel = top10Employees ? top10Employees.map((employee) => employee.name) : [];

  const seriesActual = {
    name: 'Assigned Workers',
    data:
      underStaffed &&
      underStaffed.map((task) => ({
        x: `Task ${task.id}`,
        y: task.assignedWorkers,
      })),
  };

  const seriesNeeded = {
    name: 'Workers Needed',
    data:
      underStaffed &&
      underStaffed.map((task) => ({
        x: `Task ${task.id}`,
        y: task.neededWorkers - task.assignedWorkers,
      })),
  };

  const series = [seriesActual, seriesNeeded];

  const chartOptions = {
    chart: {
      type: 'pie',
    },
    labels: statusCountLabels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'top',
          },
        },
      },
    ],
    legend: {
      position: 'top',
    },
  };
  const options2 = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: true,
    },
    labels: top10EmoployeesLabel,
    stroke: {
      show: true,
      width: 10,
      colors: ['transparent'],
    },
    xaxis: {
      categories: top10EmoployeesLabel,
    },
    yaxis: {
      title: {
        text: 'Number of Completed Tasks',
      },
    },
    fill: {
      opacity: 1,
    },
  };
  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: true,
    },
    labels: top5ContractsLabels,
    stroke: {
      show: true,
      width: 10,
      colors: ['transparent'],
    },
    xaxis: {
      categories: top5ContractsLabels,
    },
    yaxis: {
      title: {
        text: 'Number of Active Task Schedules',
      },
    },
    fill: {
      opacity: 1,
    },
  };
  const options3 = {
    chart: {
      type: 'bar',
      stacked: true,
      height: 450,
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    series: series,
    xaxis: {
      categories:
        underStaffed &&
        underStaffed.map((task) => {
          return ` ${task.date}: ${task.title}`;
        }),
    },
    yaxis: {
      title: {
        text: 'Number of Workers',
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} workers`;
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40,
    },
    stroke: {
      show: true,
      width: 3,
    },
  };

  const options4 = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      categories: employeeUtils && employeeUtils.map((emp) => emp.name),
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' tasks';
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
  };

  const series2 = [
    {
      name: 'Pending',
      data: employeeUtils && employeeUtils.map((emp) => emp.taskCounts['PENDING'] || 0),
    },
    {
      name: 'In Progress',
      data: employeeUtils && employeeUtils.map((emp) => emp.taskCounts['IN_PROGRESS'] || 0),
    },
    {
      name: 'Completed',
      data: employeeUtils && employeeUtils.map((emp) => emp.taskCounts['COMPLETED'] || 0),
    },
    {
      name: 'Cancelled',
      data: employeeUtils && employeeUtils.map((emp) => emp.taskCounts['CANCELLED'] || 0),
    },
  ];
  const options5 = {
    chart: {
      type: 'line',
      stacked: false,
      height: 350,
      toolbar: {
        show: true,
      },
    },
    stroke: {
      width: [0, 2],
    },
    title: {
      text: 'Task Load and Efficiency by Month and Template',
      align: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: [
      {
        title: {
          text: 'Number of Tasks',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Average Duration (Minutes)',
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        format: 'MM/yyyy',
      },
    },
  };

  const blabla = useGetEfficiency();

  const aggregatedVolumeData = {};
  const aggregatedDurationData = {};

  blabla.data &&
    blabla.data.seriesVolume.forEach((volume) => {
      if (!aggregatedVolumeData[volume.name]) {
        aggregatedVolumeData[volume.name] = 0;
      }
      volume.data.forEach((value) => {
        aggregatedVolumeData[volume.name] += value;
      });
    });

  blabla.data &&
    blabla.data.seriesDuration.forEach((duration) => {
      if (!aggregatedDurationData[duration.name]) {
        aggregatedDurationData[duration.name] = 0;
      }
      duration.data.forEach((value) => {
        aggregatedDurationData[duration.name] += Math.floor(value);
      });
    });

  const volumeSeries = blabla.data && [
    {
      name: 'Volume',
      type: 'column',
      data: Object.entries(aggregatedVolumeData).map(([key, value]) => ({
        x: key,
        y: value,
      })),
    },
  ];

  const durationSeries = blabla.data && [
    {
      name: 'Duration',
      type: 'line',
      data: Object.entries(aggregatedDurationData).map(([key, value]) => ({
        x: key,
        y: value,
      })),
    },
  ];

  const chartOptions2 = {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
      toolbar: {
        show: true,
      },
    },
    stroke: {
      width: [0, 2],
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      type: 'category',
      categories: blabla.data ? blabla.data.categories : [],
    },
    yaxis: [
      {
        title: {
          text: 'Volume of Tasks',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Average Duration (Minutes)',
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: (val: string) => `${val}m`,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetY: 10,
    },
  };
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex">
            <CardTitle className="w-full flex gap-2 items-center justify-between">
              Task Statuses Distribution{' '}
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="hover:bg-primary hover:text-accent p-2 rounded-md flex items-center justify-center cursor-pointer w-fit">
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="range"
                    onSelect={(date) => setDate(date)}
                    selected={date}
                    captionLayout="dropdown-buttons"
                  />
                </PopoverContent>
              </Popover>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {!isLoadingStatusCounts && statusCounts && (
              <Chart options={chartOptions} series={statusCountSeries} type={'pie'} width={300} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top 5 active contracts</CardTitle>
          </CardHeader>
          <CardContent>
            {!isLoadingTop5Contracts && top5Contracts && (
              <Chart options={options} series={top5ContractsData} type={'bar'} height={350} />
            )}
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Understaffed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {!isLoadingUnderStaffed && underStaffed && (
              <Chart options={options3} series={series} type={'bar'} height={350} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Employees Task Statuses</CardTitle>
          </CardHeader>
          <CardContent>
            {!isLoadingEmployeeUtils && employeeUtils && (
              <Chart options={options4} series={series2} type={'bar'} height={350} />
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 h-[30rem]">
          <CardHeader>
            <CardTitle>Average Duration by Month</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {!blabla.isLoading && blabla.data && (
              <Chart
                options={chartOptions2}
                series={[...volumeSeries, ...durationSeries]}
                type="line"
                height={350}
                width={900}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default App;
