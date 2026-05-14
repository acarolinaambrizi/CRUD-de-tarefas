"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskFormProps {
  onAdd: (title: string) => void;
}

export const TaskForm = ({ onAdd }: TaskFormProps) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Input
        placeholder="O que precisa ser feito?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-2xl bg-white border-slate-100 shadow-sm focus-visible:ring-indigo-500 h-12 px-6 text-slate-600 placeholder:text-slate-400"
      />
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button type="submit" size="icon" className="rounded-2xl h-12 w-12 flex-shrink-0 shadow-lg bg-indigo-600 hover:bg-indigo-700 transition-colors">
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>
    </form>
  );
};