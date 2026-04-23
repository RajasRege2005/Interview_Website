'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface WeeklyScore {
  name: string;
  score: number;
}

interface DashboardChartProps {
  data: WeeklyScore[];
  averageOverall: number;
  completedCount: number;
  totalCount: number;
  speechScore: number;
  confidenceScore: number;
}

export default function DashboardChart({
  data,
  averageOverall,
  completedCount,
  totalCount,
  speechScore,
  confidenceScore,
}: DashboardChartProps) {
  const hasChartData = data.length > 0;
  const safeData = hasChartData ? data : [{ name: 'No data', score: 0 }];
  const latestScore = hasChartData ? data[data.length - 1]?.score ?? 0 : 0;
  const previousScore = hasChartData ? data[data.length - 2]?.score ?? latestScore : latestScore;
  const trendDelta = latestScore - previousScore;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const bestScore = hasChartData ? Math.max(...data.map((item) => item.score)) : 0;
  const trendTone = trendDelta >= 0 ? 'text-emerald-400' : 'text-rose-400';
  const metricRows = [
    { name: 'Overall', value: averageOverall, fill: 'hsl(var(--primary))' },
    { name: 'Speech', value: speechScore, fill: 'hsl(174 68% 42%)' },
    { name: 'Confidence', value: confidenceScore, fill: 'hsl(38 92% 57%)' },
  ];
  const balanceData = [
    { name: 'overall', value: averageOverall, fill: 'hsl(var(--primary))' },
    { name: 'speech', value: speechScore, fill: 'hsl(174 68% 42%)' },
    { name: 'confidence', value: confidenceScore, fill: 'hsl(38 92% 57%)' },
  ];

  const scoreChartConfig = {
    score: {
      label: 'Interview score',
      color: 'hsl(142 72% 45%)',
    },
  };

  const balanceChartConfig = {
    overall: {
      label: 'Overall',
      color: 'hsl(var(--primary))',
    },
    speech: {
      label: 'Speech',
      color: 'hsl(174 68% 42%)',
    },
    confidence: {
      label: 'Confidence',
      color: 'hsl(38 92% 57%)',
    },
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr] items-stretch">
      <Card className="relative overflow-hidden border-border/70 bg-card/90 shadow-[0_24px_80px_-40px_rgba(14,165,233,0.45)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.14),transparent_30%)]" />
        <CardHeader className="relative flex flex-row items-start justify-between gap-4 pb-4">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly Performance
            </CardTitle>
            <CardDescription>
              Your recent interview scores plotted against the project theme.
            </CardDescription>
          </div>
          <ChevronRight className="mt-1 h-5 w-5 text-muted-foreground" />
        </CardHeader>

        <CardContent className="relative space-y-6">
          <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-end">
            <div>
              <div className="text-sm text-muted-foreground">Average score</div>
              <div className="mt-1 text-4xl font-semibold tracking-tight text-foreground">
                {averageOverall}%
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 px-4 py-3 backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className={`inline-flex items-center gap-1 ${trendTone}`}>
                  <ArrowUpRight className="h-4 w-4" />
                  {trendDelta >= 0 ? '+' : ''}{trendDelta}%
                </span>
                <span>from your previous session</span>
                <span className="hidden sm:inline">•</span>
                <span>{completedCount} completed analyses</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-border/60 bg-background/30 p-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <span>Session trend</span>
              <span>{completionRate}% completion</span>
            </div>

            <ChartContainer config={scoreChartConfig} className="h-[300px] w-full aspect-auto">
              <LineChart data={safeData} margin={{ top: 18, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(142 75% 48%)" />
                    <stop offset="100%" stopColor="hsl(153 75% 38%)" />
                  </linearGradient>
                  <linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 75% 48%)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(142 75% 48%)" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="0" stroke="hsl(var(--border) / 0.5)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={12}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  domain={[0, 100]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [`${value}%`, 'Interview score']}
                    />
                  }
                />
                <Line
                  dataKey="score"
                  type="monotone"
                  stroke="url(#scoreStroke)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: 'hsl(142 75% 48%)' }}
                  fill="url(#scoreArea)"
                  fillOpacity={1}
                />
              </LineChart>
            </ChartContainer>

            {!hasChartData && (
              <div className="rounded-xl border border-dashed border-border/70 bg-background/20 px-3 py-2 text-center text-sm text-muted-foreground">
                Complete an interview analysis to populate this chart.
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Best session', value: `${bestScore}%` },
              { label: 'Latest score', value: `${latestScore}%` },
              { label: 'Sessions tracked', value: `${data.length}` },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</div>
                <div className="mt-2 text-lg font-semibold text-foreground">{item.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex h-full flex-col gap-6">
        <Card className="overflow-hidden border-border/70 bg-card/90 shadow-[0_24px_80px_-45px_rgba(20,184,166,0.45)]">
          <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
            <div>
              <CardTitle className="text-xl">Practice Momentum</CardTitle>
              <CardDescription>Quick summary of how much of the dashboard is complete.</CardDescription>
            </div>
            <ChevronRight className="mt-1 h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-[1fr_auto] items-end gap-4 rounded-2xl border border-border/60 bg-background/35 p-4">
              <div>
                <div className="text-sm text-muted-foreground">Completed analysis rate</div>
                <div className="mt-1 text-4xl font-semibold tracking-tight">{completionRate}%</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {completedCount} of {totalCount} interviews have analysis data.
                </div>
              </div>
              <div className="grid grid-flow-col items-end gap-2">
                {data.slice(-4).map((point) => {
                  const height = Math.max(18, point.score * 0.8);
                  return (
                    <div key={`${point.name}-mini`} className="flex flex-col items-center gap-2">
                      <div
                        className="w-4 rounded-full bg-gradient-to-t from-primary/80 to-primary/25"
                        style={{ height: `${height}px` }}
                      />
                      <div className="text-[10px] text-muted-foreground">{point.name}</div>
                    </div>
                  );
                })}

                {!hasChartData && (
                  <div className="text-xs text-muted-foreground">No recent sessions</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/35 p-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground">Recent sessions are visible</div>
                <div className="text-sm text-muted-foreground">
                  The chart updates from your latest recorded interview results.
                </div>
              </div>
            </div>

            <Button asChild className="w-full rounded-xl">
              <Link href="/reports">View full reports</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex-1 border-border/70 bg-card/90 shadow-[0_24px_80px_-45px_rgba(245,158,11,0.35)]">
          <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
            <div>
              <CardTitle className="text-xl">Score Balance</CardTitle>
              <CardDescription>Average signal across the analyzed dimensions.</CardDescription>
            </div>
            <ChevronRight className="mt-1 h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="relative">
              <ChartContainer config={balanceChartConfig} className="mx-auto h-[280px] w-full aspect-auto">
                <PieChart>
                  <Pie
                    data={balanceData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={72}
                    outerRadius={96}
                    paddingAngle={4}
                    stroke="transparent"
                  >
                    {balanceData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={<ChartTooltipContent nameKey="name" formatter={(value, name) => [`${value}%`, String(name)]} />}
                  />
                </PieChart>
              </ChartContainer>

              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div className="rounded-xl bg-background/80 px-4 py-2 backdrop-blur-sm">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Average</div>
                  <div className="text-2xl font-semibold text-foreground">{averageOverall}%</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {metricRows.map((segment) => (
                <div key={segment.name} className="space-y-1">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="h-4 w-2 rounded-full" style={{ backgroundColor: segment.fill }} />
                    <span className="flex-1 text-muted-foreground">{segment.name}</span>
                    <span className="font-semibold text-foreground">{segment.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/60">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${segment.value}%`, backgroundColor: segment.fill }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/35 p-4 text-sm text-muted-foreground">
              This ring keeps the same cyan and amber accents used throughout the project, so the chart feels native to the app.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}