"use client";

import React, { useState } from 'react';
import { Task } from '@/types/task';
import { CheckCircle2, Circle, Trash2, Calendar, Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
}

export const TaskItem = ({ task, onToggle, onDelete, onUpdateTitle }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const isCompleted = task.status === 'completed';

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onUpdateTitle(task.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 group",
      isCompleted ? "bg-slate-50 border-transparent" : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100"
    )}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button 
          onClick={() => onToggle(task.id, task.status)}
          className="flex-shrink-0 transition-transform active:scale-90"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          ) : (
            <Circle className="w-6 h-6 text-slate-300 group-hover:text-indigo-400" />
          )}
        </button>
        
        <div className="flex flex-col min-w-0 flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-8 text-sm py-1 px-2 focus-visible:ring-indigo-500"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={handleSave}>
                <Check className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <span className={cn(
                "text-sm font-medium truncate transition-all text-slate-700",
                isCompleted && "line-through text-slate-400"
              )}>
                {task.title}
              </span>
              {task.completed_at && isCompleted && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  Concluído em {format(new Date(task.completed_at), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing && !isCompleted && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditing(true)}
            className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full h-8 w-8"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(task.id)}
          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full h-8 w-8"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};