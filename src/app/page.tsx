"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { TaskItem } from "@/components/task-item";
import { TaskForm } from "@/components/task-form";
import { TaskStats } from "@/components/task-stats";
import { AuthScreen } from "@/components/auth-screen";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileSettings } from "@/components/profile-settings";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Loader2, ListTodo, Sparkles, LogOut, Search, Filter, Trash2 } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [profileName, setProfileName] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "priority" | "due">("created");

  // -------------------------------------------------
  // 1️⃣  Fetch tasks (only for the logged‑in user)
  // -------------------------------------------------
  const refreshTasks = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar tarefas:", err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------
  // 2️⃣  Auth listener – runs only once
  // -------------------------------------------------
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
          await refreshTasks(newSession.user.id);
        } else {
          setTasks([]);
          setProfileName("");
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // -------------------------------------------------
  // 3️⃣  Profile fetch
  // -------------------------------------------------
  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", userId)
      .single();

    if (data?.first_name) setProfileName(data.first_name);
    else setProfileName(session?.user?.email?.split("@")[0] ?? "Usuário");
  };

  // -------------------------------------------------
  // 4️⃣  CRUD helpers
  // -------------------------------------------------
  const addTask = async (
    title: string,
    category: string,
    priority: TaskPriority,
    dueDate: Date | null,
    notes: string
  ) => {
    if (!session?.user) return;
    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            title,
            category,
            priority,
            notes,
            due_date: dueDate ? dueDate.toISOString() : null,
            status: "pending",
            user_id: session.user.id,
          },
        ])
        .select();

      if (error) throw error;
      if (data) {
        toast.success("Tarefa adicionada!");
        await refreshTasks(session.user.id);
      }
    } catch {
      toast.error("Erro ao adicionar tarefa.");
    }
  };

  const toggleTask = async (id: string, currentStatus: string) => {
    if (!session?.user) return;
    const newStatus: TaskStatus = currentStatus === "pending" ? "completed" : "pending";
    const completedAt = newStatus === "completed" ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus, completed_at: completedAt })
        .eq("id", id);

      if (error) throw error;
      toast.success(newStatus === "completed" ? "Tarefa concluída! 🎉" : "Tarefa reaberta.");
      await refreshTasks(session.user.id);
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!session?.user) return;
    try {
      const { error } = await supabase.from("tasks").update(updates).eq("id", id);
      if (error) throw error;
      toast.success("Tarefa atualizada.");
      await refreshTasks(session.user.id);
    } catch {
      toast.error("Erro ao atualizar tarefa.");
    }
  };

  const deleteTask = async (id: string) => {
    if (!session?.user) return;
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
      toast.success("Tarefa removida.");
      await refreshTasks(session.user.id);
    } catch {
      toast.error("Erro ao remover tarefa.");
    }
  };

  const clearCompleted = async () => {
    if (!session?.user) return;
    const completedIds = tasks.filter(t => t.status === "completed").map(t => t.id);
    if (completedIds.length === 0) return;

    try {
      const { error } = await supabase.from("tasks").delete().in("id", completedIds);
      if (error) throw error;
      toast.success(`${completedIds.length} tarefas removidas.`);
      await refreshTasks(session.user.id);
    } catch {
      toast.error("Erro ao limpar tarefas.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.info("Até logo!");
  };

  // -------------------------------------------------
  // 5️⃣  Render
  // -------------------------------------------------
  if (!session && !loading) return <AuthScreen />;

  const priorityOrder = { Alta: 3, Média: 2, Baixa: 1 };
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "priority") return priorityOrder[b.priority] - priorityOrder[a.priority];
    if (sortBy === "due") {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const filteredTasks = sortedTasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "pending") return task.status === "pending";
    if (filter === "completed") return task.status === "completed";
    return true;
  });

  const hasCompleted = tasks.some(t => t.status === "completed");

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col items-center p-6 sm:p-8 max-w-md mx-auto font-sans transition-colors duration-300">
      <header className="w-full mb-8 mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200"
            >
              <ListTodo className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Dyad Tasks
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Olá, {profileName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {session?.user && <ProfileSettings userId={session.user.id} onUpdate={setProfileName} />}
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-rose-600 rounded-xl">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <TaskStats tasks={tasks} />

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar tarefas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 rounded-2xl bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm h-10 text-sm"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-2xl h-10 w-10 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <Filter className="w-4 h-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-xl">
                <DropdownMenuLabel className="text-xs">Ordenar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("created")} className="text-xs">
                  Data de criação
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("priority")} className="text-xs">
                  Prioridade
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("due")} className="text-xs">
                  Data de entrega
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Tabs defaultValue="all" className="flex-1" onValueChange={setFilter}>
              <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-2xl">
                <TabsTrigger value="all" className="rounded-xl text-xs font-semibold">
                  Todas
                </TabsTrigger>
                <TabsTrigger value="pending" className="rounded-xl text-xs font-semibold">
                  Pendentes
                </TabsTrigger>
                <TabsTrigger value="completed" className="rounded-xl text-xs font-semibold">
                  Feitas
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {hasCompleted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearCompleted}
                className="text-slate-400 hover:text-rose-600 rounded-xl h-10 w-10 bg-slate-100/50 dark:bg-slate-900/50"
                title="Limpar concluídas"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col gap-8">
        <section>
          <TaskForm onAdd={addTask} />
        </section>

        <section className="flex flex-col gap-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600/40" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Nenhuma tarefa encontrada.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    layout
                  >
                    <TaskItem
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      onUpdate={updateTask}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-auto pt-12 w-full">
        <MadeWithDyad />
      </footer>

      <Toaster position="bottom-center" richColors />
    </div>
  );
}