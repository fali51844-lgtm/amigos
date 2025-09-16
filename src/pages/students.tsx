import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";
import { studentsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Filter } from "lucide-react";
import StudentsTable from "@/components/tables/students-table";
import StudentForm from "@/components/forms/student-form";

export default function Students() {
  const [, setLocation] = useLocation();
  useEffect(()=>{ if (!isAuthenticated()) setLocation('/login'); }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: students, isLoading, refetch } = useQuery({
    queryKey: ["/api/students", searchQuery, statusFilter],
    queryFn: () => studentsApi.getAll({ 
      query: searchQuery || undefined, 
      status: statusFilter || undefined 
    }),
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value === "all" ? "" : value);
  };

  return (
    <div className="p-6" data-testid="page-students">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Students</h2>
          <p className="text-muted-foreground">Manage student records and information</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 lg:mt-0 flex items-center space-x-2" data-testid="button-add-student">
              <Plus className="h-4 w-4" />
              <span>Add Student</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <StudentForm 
              onSuccess={() => {
                setIsCreateDialogOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search-students"
              />
            </div>
            
            <Select value={statusFilter || "all"} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-48" data-testid="select-status-filter">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="secondary" className="flex items-center space-x-2" data-testid="button-filter">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <StudentsTable students={students || []} isLoading={isLoading} onRefetch={refetch} />
        </CardContent>
      </Card>
    </div>
  );
}
