import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Pencil, Trash2, Star } from "lucide-react";
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
  icon?: string;
}

const colorOptions = [
  { name: "Electric Violet", value: "coding", class: "bg-coding" },
  { name: "Green", value: "home", class: "bg-home" },
  { name: "Blue", value: "work", class: "bg-work" },
  { name: "Yellow", value: "health", class: "bg-health" },
  { name: "Orange", value: "education", class: "bg-education" },
];

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("coding");
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase.from("categories").insert({
        user_id: session.user.id,
        name,
        color,
      });

      if (error) throw error;
      toast.success("Category created!");
      setName("");
      setColor("coding");
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      toast.success("Category deleted!");
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-foreground"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <Avatar className="h-10 w-10 bg-secondary">
            <AvatarFallback className="bg-secondary text-foreground">
              {email[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-4 mb-8 max-h-64 overflow-y-auto">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`p-4 ${
                colorOptions.find((c) => c.value === category.color)?.class ||
                "bg-coding"
              } border-none flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏠</span>
                <span className="font-semibold text-foreground">
                  {category.name}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-black/20 hover:bg-black/30"
                >
                  <Star className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-black/20 hover:bg-black/30"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-black/20 hover:bg-black/30"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="border-t-2 border-primary pt-8">
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">
            Add New Category
          </h2>

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

          <form onSubmit={handleCreate} className="space-y-6 max-w-md mx-auto">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category name *</Label>
              <Input
                id="category-name"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full ${
                          colorOptions.find((c) => c.value === color)?.class
                        }`}
                      />
                      {colorOptions.find((c) => c.value === color)?.name}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full ${option.class}`} />
                        {option.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
            >
              Create Category
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Categories;
