"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { TaskItem } from '@/components/task-item';
import { TaskForm } from '@/components/task-form';
import { TaskStats } from '@/components/task-stats';
import { AuthScreen } from '@/components/auth-screen';
import { ThemeToggle } from '@/components/theme-toggle';
import { ProfileSettings } from '@/components/profile-settings';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Loader2, ListTodo, Sparkles, LogOut, Search, Filter, Trash2 } from 'lucide-react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  // ... (código existente)
  
  // Adicionando rotas para as novas páginas
  if (window.location.pathname === '/password-reset') {
    return <PasswordReset />;
  }
  if (window.location.pathname === '/reset-password') {
    return <ResetPassword />;
  }
  
  // ... (resto do código)
};