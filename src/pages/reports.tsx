import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";
import { dashboardApi, studentsApi, coursesApi, gradesApi, enrollmentsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, BookOpen, TrendingUp, BarChart3, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMemo } from 'react';

export default function Reports() {
  const [, setLocation] = useLocation();
  useEffect(()=>{ if (!isAuthenticated()) setLocation('/login'); }, []);

  const { toast } = useToast();

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: dashboardApi.getStats,
  });

  const { data: enrollments } = useQuery({
    queryKey: ["/api/enrollments"],
    queryFn: () => enrollmentsApi.getAll(),
  });

  const enrollmentCount = enrollments ? enrollments.length : (stats?.totalEnrollments || 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="text-muted-foreground">Comprehensive reports and analytics</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats?.totalStudents || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
                <p className="text-2xl font-bold">{enrollmentCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                <p className="text-2xl font-bold">{stats?.activeCourses || 0}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Grade</p>
                <p className="text-2xl font-bold">{stats?.averageGrade || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rest of reports - kept as earlier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for other detailed reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Total enrollments: {enrollmentCount}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
