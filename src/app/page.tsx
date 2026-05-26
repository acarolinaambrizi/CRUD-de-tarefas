"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { TaskItem } from '@/components/task-item';
import { TaskForm } from '@/components/task-form';
import { TaskStats } from '@/components/task-stats';
import { ThemeToggle } from '@/components/theme-toggle';
import { ProfileSettings } from '@/components/profile-settings';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Loader2, ListTodo, Sparkles, LogOut, Search, Filter, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [profileName, setProfileName] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "priority" | "due">("created");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchTasks();
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchTasks();
        fetchProfile(session.user.id);
      } else {
        setTasks([]);
        setProfileName('');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', userId)
      .single();
    if (data) setProfileName(data.first_name || '');
    else setProfileName(session?.user?.email?.split('@')[0] || "Usuário");
  };

  const addTask = async (title: string, category: string, priority: TaskPriority, dueDate: Date | null, notes: string) => {
    if (!session?.user) return;
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ title, category: category || 'Geral', priority: priority || 'Média', notes, due_date: dueDate ? new Date(dueDate).toISOString() : null, status: 'pending', user_id: session.user.id }])
        .select()
        .single();
      if (error) throw error;
      if (data) {
        setTasks([data[0], ...tasks]);
        toast.success("Tarefa adicionada!");
      }
    } catch (error: any) {
      toast.error("Erro ao adicionar tarefa.");
    }
  };

  const toggleTask = async (id: string, currentStatus: string) => {
    const newStatus: TaskStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus, completed_at: completedAt })
        .eq('id', id);
      if (error) throw error;
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus, completed_at: completedAt } : t));
      if (newStatus === 'completed') toast.success("Tarefa concluída! 🎉");
    } catch (error: any) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const updateTaskTitle = async (id: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ title: newTitle })
        .eq('id', id);
      if (error) throw error;
      setTasks(tasks.map(t => t.id === id ? { ...t, title: newTitle } : t));
      toast.success("Título atualizado.");
    } catch (error: any) {
      toast.error("Erro ao atualizar título.");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      setTasks(tasks.filter(t => t.id !== id));
      toast.success("Tarefa removida.");
    } catch (error: any) {
      toast.error("Erro ao remover tarefa.");
    }
  };

  const clearCompleted = async () => {
    const completedIds = tasks.filter(t => t.status === 'completed').map(t => t.id);
    if (completedIds.length === 0) return;
    try {
      const { error } = await supabase.from('tasks').delete().in('id', completedIds);
      if (error) throw error;
      setTasks(tasks.filter(t => t.status !== 'completed'));
      toast.success(`${completedIds.length} tarefas removidas.`);
    } catch (error: any) {
      toast.error("Erro ao limpar tarefas.");
    }
  };

  const handleLogout = async () => {
    if (!session) {
      toast.info("Você precisa estar logado para sair.");
      return;
    }
    await supabase.auth.signOut();
    toast.info("Até logo!");
  };

  const priorityOrder = { "Alta": 3, "Média": 2, "Baixa": 1 };
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "priority") {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === "due") {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const filteredTasks = sortedTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "pending") return task.status === "pending";
    if (filter === "completed") return task.status === "completed";
    return true;
  });

  const hasCompleted = tasks.some(t => t.status === 'completed');

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col items-center p-6 sm:p-8 max-w-md mx-auto font-sans transition-colors duration-300">
      <div className="w-full mb-8 mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
              <ListTodo className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dyad Tasks</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Olá, {profileName}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          {session?.user && (
            <ProfileSettings userId={session.user.id} onUpdate={setProfileName} />
          )}
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-rose-600 rounded-xl">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Buscar tarefas..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 rounded-2xl bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm h-10 text-sm" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-2xl h-10 w-10 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <Filter className="w-4 h-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-xl">
              <DropdownMenuLabel className="text-xs">Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy("created")} className="text-xs">Data de criação</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("priority")} className="text-xs">Prioridade</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("due")} className="text-xs">Data de entrega</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowDetails(!showDetails)} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-600 h-auto py-1">
            {showDetails ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
            {showDetails ? "Menos detalhes" : "Mais detalhes"}
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <TaskForm onAdd={addTask} />
          <div className="flex items-center gap-3">
            {hasCompleted && (
              <Button variant="ghost" size="icon" onClick={clearCompleted} className="text-slate-400 hover:text-rose-600 rounded-xl h-10 w-10 bg-slate-100/50 dark:bg-slate-900/50" title="Limpar concluídas">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <footer className="mt-auto pt-12 w-full"><MadeWithDyad /></footer>
      <Toaster position="bottom-center" richColors />
    </div>
  );
}