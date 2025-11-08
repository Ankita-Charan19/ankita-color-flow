import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  color: string;
}

const AddTask = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setEmail(session.user.email || "");
        fetchCategories();
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase.from("tasks").insert({
        user_id: session.user.id,
        title,
        description,
        deadline: deadline || null,
        category_id: categoryId || null,
      });

      if (error) throw error;
      toast.success("Task created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold text-foreground">Add New Task</h1>
          <Avatar className="h-10 w-10 bg-secondary">
            <AvatarFallback className="bg-secondary text-foreground">
              {email[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <Card className="p-8 bg-card/80 backdrop-blur-lg border-border/50">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-5xl">
                😊
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                ✏️
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Task Name *</Label>
              <Input
                id="title"
                placeholder="Enter task name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Task Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="bg-input border-border resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Task Deadline</Label>
              <div className="relative">
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="bg-input border-border"
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Color - Electric Violet</Label>
              <div className="flex items-center gap-2 p-3 bg-input border border-border rounded-lg">
                <div className="w-6 h-6 bg-primary rounded-full" />
                <span className="text-foreground">Electric Violet</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
              disabled={loading}
            >
              Create Task
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddTask;
