import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { AppSidebar } from "@/components/AppSidebar";
import { TaskList } from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setSession(session);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  if (!session) return null;

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-2">
                <span>👋</span> {greeting}
              </h1>
              <p className="text-muted-foreground italic mt-1">
                Stay focused, stay productive.
              </p>
            </div>
            <Avatar className="h-12 w-12 bg-secondary">
              <AvatarFallback className="bg-secondary text-foreground">
                {session.user.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <TaskList />

          <Button
            onClick={() => navigate("/add-task")}
            className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
            size="icon"
          >
            <Plus className="h-8 w-8" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
