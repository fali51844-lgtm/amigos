import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { gradesApi, studentsApi, coursesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import GradesTable from "@/components/tables/grades-table";
import GradeForm from "@/components/forms/grade-form";
import type { GradeWithDetails, Student, Course } from "@/types";
import { useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";

export default function Grades() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(()=>{
    if (!isAuthenticated()) {
      setLocation("/login");
    }
  },[]);

  const { data: grades, isLoading, refetch } = useQuery<GradeWithDetails[], Error>({
    queryKey: ["/api/grades"],
    queryFn: () => gradesApi.getAll(),
  });

  const { data: students } = useQuery<Student[], Error>({
    queryKey: ["/api/students"],
    queryFn: () => studentsApi.getAll(),
  });

  const { data: courses } = useQuery<Course[], Error>({
    queryKey: ["/api/courses"],
    queryFn: () => coursesApi.getAll(),
  });

  const enrichedGrades = useMemo(() => {
    const sMap = new Map<string, Student>();
    const cMap = new Map<string, Course>();
    (students || []).forEach(s => sMap.set(s.id, s));
    (courses || []).forEach(c => cMap.set(c.id, c));
    return (grades || []).map(g => {
      const student = (g as any).student || sMap.get((g as any).studentId) || null;
      const course = (g as any).course || cMap.get((g as any).courseId) || null;
      const studentName = (g as any).studentName || (student ? `${(student as any).firstName || ""} ${(student as any).lastName || ""}`.trim() : undefined);
      const courseName = (g as any).courseName || (course ? (course as any).name : undefined);
      return { ...g, student, course, studentName, courseName } as GradeWithDetails;
    });
  }, [grades, students, courses]);

  return (
    <div className="p-6" data-testid="page-grades">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Grades</h2>
          <p className="text-muted-foreground">Manage student grades</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 lg:mt-0 flex items-center space-x-2" data-testid="button-new-grade">
              <Plus className="h-4 w-4" />
              <span>New Grade</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New Grade</DialogTitle>
            </DialogHeader>
            <GradeForm 
              students={students || []}
              courses={courses || []}
              onSuccess={() => {
                setIsCreateDialogOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Grade Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <GradeForm 
            students={students || []}
            courses={courses || []}
            onSuccess={refetch}
            showSubmitButton={true}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Grades</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <GradesTable 
            grades={enrichedGrades || []} 
            isLoading={isLoading} 
            onRefetch={refetch} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
