import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";
import { coursesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, BookOpen, Clock } from "lucide-react";
import CourseForm from "@/components/forms/course-form";
import type { Course } from "@/types";

export default function Courses() {
  const [, setLocation] = useLocation();
  useEffect(()=>{ if (!isAuthenticated()) setLocation('/login'); }, []);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: courses, isLoading, refetch } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: coursesApi.getAll,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="page-courses">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Courses</h2>
          <p className="text-muted-foreground">Manage course catalog and information</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 lg:mt-0 flex items-center space-x-2" data-testid="button-add-course">
              <Plus className="h-4 w-4" />
              <span>Add Course</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <CourseForm 
              onSuccess={() => {
                setIsCreateDialogOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course: Course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow" data-testid={`card-course-${course.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{course.courseId}</p>
                </div>
                <Badge variant={course.isActive ? "default" : "secondary"}>
                  {course.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {course.description || "No description available"}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Instructor:
                  </span>
                  <span className="font-medium">{course.instructor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Credits:
                  </span>
                  <span className="font-medium">{course.credits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Capacity:
                  </span>
                  <span className="font-medium">0/{course.capacity}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Button size="sm" className="flex-1" data-testid={`button-view-course-${course.id}`}>
                  View Details
                </Button>
                <Button variant="outline" size="sm" data-testid={`button-edit-course-${course.id}`}>
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {courses?.length === 0 && (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No courses found</p>
          </div>
        )}
      </div>
    </div>
  );
}
