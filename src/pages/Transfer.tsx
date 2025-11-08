import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Monitor, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Transfer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setEmail(session.user.email || "");
        fetchTasks();
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchTasks = async () => {
    const { data } = await supabase.from("tasks").select("*");
    if (data) setTasks(data);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ankita-tasks.json";
    link.click();
    toast.success("Tasks exported successfully!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          toast.success("File loaded! Import functionality ready.");
        } catch (error) {
          toast.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-foreground"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Transfer</h1>
          <Avatar className="h-10 w-10 bg-secondary">
            <AvatarFallback className="bg-secondary text-foreground">
              {email[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Sync All Data
            </h2>
            <Button className="w-full bg-primary hover:bg-primary/90 py-6">
              <Monitor className="mr-2 h-5 w-5" />
              SYNC WITH OTHER DEVICE
            </Button>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Export Tasks to JSON
            </h2>
            {tasks.length === 0 ? (
              <p className="text-muted-foreground mb-4 text-center italic">
                You don't have any tasks to export
              </p>
            ) : (
              <p className="text-muted-foreground mb-4 text-center">
                {tasks.length} tasks ready to export
              </p>
            )}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full py-6 border-border"
                disabled={tasks.length === 0}
              >
                <Download className="mr-2 h-5 w-5" />
                EXPORT SELECTED TO JSON
              </Button>
              <Button
                variant="outline"
                className="w-full py-6 border-border"
                onClick={exportToJSON}
                disabled={tasks.length === 0}
              >
                <Download className="mr-2 h-5 w-5" />
                EXPORT ALL TASKS TO JSON
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Import Tasks From JSON
            </h2>
            <Card className="p-8 border-2 border-dashed border-primary bg-card/50 text-center mb-4">
              <Upload className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-foreground mb-1">Drop JSON file here</p>
              <p className="text-sm text-muted-foreground">to import tasks</p>
            </Card>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full py-6 border-border"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="mr-2 h-5 w-5" />
                SELECT JSON FILE
              </Button>
              <input
                id="file-input"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
              <Button
                variant="outline"
                className="w-full py-6 border-primary text-primary"
              >
                <Upload className="mr-2 h-5 w-5" />
                IMPORT JSON FROM CLIPBOARD
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
