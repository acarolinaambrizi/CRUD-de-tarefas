"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Tag, AlertCircle, Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskPriority } from '@/types/task';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Textarea } from '@/components/ui/textarea';

interface TaskFormProps {
  onAdd: (title: string, category: string, priority: TaskPriority, dueDate: Date | null, notes: string) => void;
}

const CATEGORIES = ["Geral", "Trabalho", "Pessoal", "Compras", "Saúde"];
const PRIORITIES: TaskPriority[] = ["Baixa", "Média", "Alta"];

export const TaskForm = ({ onAdd }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Geral');
  const [priority, setPriority] = useState<TaskPriority>('Média');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), category, priority, dueDate || null, notes.trim());
      setTitle('');
      setNotes('');
      setDueDate(undefined);
      setShowDetails(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex gap-2">
        <Input
          placeholder="O que precisa ser feito?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-2xl bg-slate-50 dark:bg-slate-950 border-transparent focus-visible:ring-indigo-500 h-12 px-6 text-slate-600 dark:text-slate-300"
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="submit" size="icon" className="rounded-2xl h-12 w-12 bg-indigo-600 shadow-lg">
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
      
      <div className="flex items-center justify-between px-1">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
          className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-600 h-auto py-1"
        >
          {showDetails ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
          {showDetails ? "Menos detalhes" : "Mais detalhes"}
        </Button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-3"
          >
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-9 rounded-xl border-slate-100 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-950/50">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-xs">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                  <SelectTrigger className="h-9 rounded-xl border-slate-100 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-950/50">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-9 justify-start text-left font-normal rounded-xl border-slate-100 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-950/50",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : <span>Data de entrega</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl border-slate-100 dark:border-slate-800 shadow-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Textarea 
              placeholder="Notas adicionais..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl bg-slate-50 dark:bg-slate-950 border-transparent focus-visible:ring-indigo-500 text-xs min-h-[80px]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};