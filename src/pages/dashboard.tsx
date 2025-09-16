import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";
import { dashboardApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Book, ClipboardList, TrendingUp, ArrowUp } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  useEffect(()=>{ if (!isAuthenticated()) setLocation('/login'); }, []);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: dashboardApi.getStats,
  });

  const statsCards = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Users,
      change: "+8.2%",
      changeType: "positive",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Courses",
      value: stats?.activeCourses || 0,
      icon: Book,
      change: "+12.1%",
      changeType: "positive",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Enrollments",
      value: stats?.totalEnrollments || 0,
      icon: ClipboardList,
      change: "+5.4%",
      changeType: "positive",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Average Grade",
      value: stats?.averageGrade?.toFixed(2) || "0.00",
      icon: TrendingUp,
      change: "+2.1%",
      changeType: "positive",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's what's happening at your institution.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="page-dashboard">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at your institution.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} data-testid={`card-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold" data-testid={`text-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 flex items-center">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center text-muted-foreground py-8">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center text-muted-foreground py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No performance data available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
