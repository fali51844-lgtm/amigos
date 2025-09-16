import { Bell, GraduationCap, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onSidebarToggle: () => void;
}

export default function Header({ onSidebarToggle }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm h-16">
      <div className="flex items-center justify-between px-4 lg:px-6 h-full">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={onSidebarToggle}
            data-testid="button-sidebar-toggle"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-semibold text-lg">EduManager</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-muted rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search students, courses..."
              className="bg-transparent border-none outline-none text-sm w-64 p-0"
              data-testid="input-search"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="relative p-2" data-testid="button-notifications">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" 
              alt="User avatar" 
              className="w-8 h-8 rounded-full"
            />
            <span className="hidden md:block text-sm font-medium">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
}
