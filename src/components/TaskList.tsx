import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  category_id: string;
}

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setTasks(data);
  };

  const toggleComplete = async (task: Task) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed: !task.completed })
        .eq("id", task.id);

      if (error) throw error;
      fetchTasks();
      toast.success(task.completed ? "Task reopened" : "Task completed!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-foreground mb-2">
          You don't have any tasks yet
        </p>
        <p className="text-muted-foreground">
          Click on the + button to add one
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className="p-4 bg-card/80 backdrop-blur-lg border-border/50 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-start gap-4">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleComplete(task)}
              className="mt-1"
            />
            <div className="flex-1">
              <h3
                className={`font-semibold text-foreground ${
                  task.completed ? "line-through opacity-60" : ""
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {task.description}
                </p>
              )}
              {task.deadline && (
                <p className="text-xs text-muted-foreground mt-2">
                  Due: {new Date(task.deadline).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
