"use client";

import React from 'react';
import { Task } from '@/types/task';
import { CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const isCompleted = task.status === 'completed';

  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-2xl border transition-all duration-200",
      isCompleted ? "bg-muted/50 border-transparent" : "bg-card border-border shadow-sm hover:shadow-md"
    )}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button 
          onClick={() => onToggle(task.id, task.status)}
          className="flex-shrink-0 text-primary transition-transform active:scale-90"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground" />
          )}
        </button>
        
        <div className="flex flex-col min-w-0">
          <span className={cn(
            "text-sm font-medium truncate transition-all",
            isCompleted && "line-through text-muted-foreground"
          )}>
            {task.title}
          </span>
          {task.completed_at && isCompleted && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Concluído em {format(new Date(task.completed_at), "dd 'de' MMM", { locale: ptBR })}
            </span>
          )}
        </div>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onDelete(task.id)}
        className="text-destructive hover:bg-destructive/10 rounded-full"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};