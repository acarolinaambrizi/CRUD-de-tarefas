"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
        placeholder="Nova tarefa..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-full bg-muted/50 border-none focus-visible:ring-primary h-12 px-6"
      />
      <Button type="submit" size="icon" className="rounded-full h-12 w-12 flex-shrink-0 shadow-lg">
        <Plus className="w-6 h-6" />
      </Button>
    </form>
  );
};