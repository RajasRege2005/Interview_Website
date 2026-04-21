'use client';
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DashboardChart from "@/components/DashboardChart";

interface InterviewRecord {
  id: string;
  category: string;
  question: string;
  created_at: string;
  reports: {
    overall_score: number;
    speech_score: number;
    confidence_score: number;
  }[];
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<InterviewRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user]);

  const fetchRecords = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select(`
          id,
          category,
          question,
          created_at,
          reports:interview_reports(
            overall_score,
            speech_score,
            confidence_score
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data as any as InterviewRecord[]);
    } catch (err) {
      console.error("Error fetching records:", err);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  const completedInterviews = records.filter(r => r.reports && r.reports.length > 0);
  const avgOverall = completedInterviews.length 
    ? Math.round(completedInterviews.reduce((acc, curr) => acc + (curr.reports[0].overall_score || 0), 0) / completedInterviews.length)
    : 0;
  const avgSpeech = completedInterviews.length
    ? Math.round(completedInterviews.reduce((acc, curr) => acc + (curr.reports[0].speech_score || 0), 0) / completedInterviews.length)
    : 0;
  const avgConfidence = completedInterviews.length
    ? Math.round(completedInterviews.reduce((acc, curr) => acc + (curr.reports[0].confidence_score || 0), 0) / completedInterviews.length)
    : 0;
  const chartData = completedInterviews
    .slice(0, 6)
    .reverse()
    .map((record) => ({
      name: new Date(record.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: Math.round(record.reports[0].overall_score || 0),
    }));

  return (
    <div className="container mx-auto space-y-8 px-4 pb-12 pt-20 md:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-6 shadow-[0_24px_80px_-50px_rgba(14,165,233,0.4)] md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.12),transparent_30%)]" />
        <div className="relative flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Your Dashboard</h1>
          <p className="max-w-2xl text-muted-foreground">
            Track interview practice progress with a visual summary of recent performance, completed sessions, and score balance.
          </p>
        </div>
      </div>

      <DashboardChart
        data={chartData}
        averageOverall={avgOverall}
        completedCount={completedInterviews.length}
        totalCount={records.length}
        speechScore={avgSpeech}
        confidenceScore={avgConfidence}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedInterviews.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOverall}%</div>
            <Progress value={avgOverall} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Interviews</h2>
        {records.length === 0 ? (
          <Card>
            <CardContent className="h-32 flex items-center justify-center text-muted-foreground">
              No interview records found. Start practicing to see your stats!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {records.map((record) => {
              const report = record.reports?.[0];
              return (
                <Card key={record.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-1">{record.category}</CardTitle>
                    <CardDescription suppressHydrationWarning>
                      {new Date(record.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {record.question}
                    </p>
                    {report ? (
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Overall Score</span>
                          <span className="font-medium text-primary">{report.overall_score || 0}/100</span>
                        </div>
                        <Progress value={report.overall_score || 0} className="h-2" />
                      </div>
                    ) : (
                      <div className="pt-2 text-sm text-amber-500 italic">
                        Analysis pending or incomplete
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
