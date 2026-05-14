"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskFormProps {
  onAdd: (title: string, category: string) => void;
}

const CATEGORIES = [
  { label: "Geral", value: "Geral", color: "bg-slate-100 text-slate-600" },
  { label: "Trabalho", value: "Trabalho", color: "bg-blue-100 text-blue-600" },
  { label: "Pessoal", value: "Pessoal", color: "bg-purple-100 text-purple-600" },
  { label: "Compras", value: "Compras", color: "bg-amber-100 text-amber-600" },
  { label: "Saúde", value: "Saúde", color: "bg-emerald-100 text-emerald-600" },
];

export const TaskForm = ({ onAdd }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Geral');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), category);
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
          className="rounded-2xl bg-slate-50 border-transparent focus-visible:ring-indigo-500 h-12 px-6 text-slate-600 placeholder:text-slate-400"
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="submit" size="icon" className="rounded-2xl h-12 w-12 flex-shrink-0 shadow-lg bg-indigo-600 hover:bg-indigo-700 transition-colors">
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
      
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-slate-400" />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full h-9 rounded-xl border-slate-100 text-xs font-medium text-slate-500 bg-slate-50/50">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100">
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value} className="text-xs">
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};