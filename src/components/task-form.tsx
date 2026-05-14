"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Tag, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskPriority } from '@/types/task';

interface TaskFormProps {
  onAdd: (title: string, category: string, priority: TaskPriority) => void;
}

const CATEGORIES = ["Geral", "Trabalho", "Pessoal", "Compras", "Saúde"];
const PRIORITIES: TaskPriority[] = ["Baixa", "Média", "Alta"];

export const TaskForm = ({ onAdd }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Geral');
  const [priority, setPriority] = useState<TaskPriority>('Média');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), category, priority);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex gap-2">
        <Input
          placeholder="O que precisa ser feito?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-2xl bg-slate-50 border-transparent focus-visible:ring-indigo-500 h-12 px-6 text-slate-600"
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="submit" size="icon" className="rounded-2xl h-12 w-12 bg-indigo-600 shadow-lg">
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2">
          <Tag className="w-4 h-4 text-slate-400" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 rounded-xl border-slate-100 text-xs bg-slate-50/50">
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
          <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
            <SelectTrigger className="h-9 rounded-xl border-slate-100 text-xs bg-slate-50/50">
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
    </form>
  );
};