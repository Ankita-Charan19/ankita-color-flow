import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Plus,
  FolderTree,
  Trash2,
  Download,
  Monitor,
  Github,
  Bug,
  Coffee,
  Download as DownloadIcon,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

export const AppSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  return (
    <aside className="w-80 bg-card/30 backdrop-blur-lg border-r border-border p-6 flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold">
            <span className="text-primary">Todo</span>{" "}
            <span className="text-foreground">App.</span>
          </h2>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-foreground hover:bg-secondary"
          onClick={() => navigate("/dashboard")}
        >
          <CheckCircle2 className="mr-3 h-5 w-5" />
          Tasks
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-foreground hover:bg-secondary"
          onClick={() => navigate("/add-task")}
        >
          <Plus className="mr-3 h-5 w-5" />
          Add Task
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-foreground hover:bg-secondary"
          onClick={() => navigate("/categories")}
        >
          <FolderTree className="mr-3 h-5 w-5" />
          Categories
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-foreground hover:bg-secondary"
        >
          <Trash2 className="mr-3 h-5 w-5" />
          Purge Tasks
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-foreground hover:bg-secondary"
          onClick={() => navigate("/transfer")}
        >
          <Download className="mr-3 h-5 w-5" />
          Transfer
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-foreground hover:bg-secondary"
        >
          <Monitor className="mr-3 h-5 w-5" />
          Sync Devices
        </Button>

        <div className="pt-6 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-between text-foreground hover:bg-secondary"
            asChild
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center">
                <Github className="mr-3 h-5 w-5" />
                Github
              </div>
              <span className="text-yellow-500 flex items-center gap-1">
                <span>⭐</span> 315
              </span>
            </a>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-between text-foreground hover:bg-secondary"
          >
            <div className="flex items-center">
              <Bug className="mr-3 h-5 w-5" />
              Report Issue
            </div>
            <span className="text-green-500 flex items-center gap-1">
              <span>●</span> 4
            </span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-between text-foreground hover:bg-secondary"
          >
            <div className="flex items-center">
              <Coffee className="mr-3 h-5 w-5" />
              Buy me a coffee
            </div>
            <span className="text-red-500 flex items-center gap-1">
              <span>❤</span> 3
            </span>
          </Button>
        </div>

        <div className="pt-6 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-secondary"
          >
            <DownloadIcon className="mr-3 h-5 w-5" />
            Install App
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </nav>
    </aside>
  );
};
