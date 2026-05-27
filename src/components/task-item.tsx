"use client";

import React, { useState } from 'react';
import { Task } from '@/types/task';
import { CheckCircle2, Circle, Trash2, Calendar, Pencil, Check, X, AlertTriangle, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, isPast, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Textarea } from '@/components/ui/textarea';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Geral": "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  "Trabalho": "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  "Pessoal": "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-blue-800",
  "Compras": "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  "Saúde": "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
};

const PRIORITY_COLORS: Record<string, string> = {
  "Alta": "text-rose-500 bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800",
  "Média": "text-amber-500 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800",
  "Baixa": "text-emerald-500 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800",
};

export const TaskItem = ({ task, onToggle, onDelete, onUpdate }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.due_date ? new Date(task.due_date) : undefined);
  const [editNotes, setEditNotes] = useState(task.notes || '');
  const [showNotes, setShowNotes] = useState(false);
  const isCompleted = task.status === 'completed';

  const handleSave = () => {
    if (isEditing) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        category: editCategory,
        priority: editPriority,
        due_date: editDueDate ? editDueDate.toISOString() : null,
        notes: editNotes.trim(),
      });
      setIsEditing(false);
    }
  };

  const dueDateObj = task.due_date ? new Date(task.due_date) : null;
  const isOverdue = dueDateObj && isPast(dueDateObj) && !isToday(dueDateObj) && !isCompleted;

  return (
    <div className={cn(
      "flex flex-col p-4 rounded-2xl border transition-all duration-200 group",
      isCompleted ? "bg-slate-50/50 dark:bg-slate-900/20 border-transparent opacity-75" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50"
    )}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button 
            onClick={() => onToggle(task.id, task.status)}
            className="flex-shrink-0 transition-transform active:scale-90"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : (
              <Circle className="w-6 h-6 text-slate-300 dark:text-slate-700 group-hover:text-indigo-400" />
            )}
          </button>
          
          <div className="flex flex-col min-w-0 flex-1 gap-1">
            {isEditing ? (
              <div className="space-y-3">
                <Input 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="h-8 text-sm py-1 px-2 focus-visible:ring-indigo-500"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select value={editCategory} onValueChange={setEditCategory}>
                      <SelectTrigger className="h-8 rounded-xl border-slate-100 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-950/50">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Geral">Geral</SelectItem>
                        <SelectItem value="Trabalho">Trabalho</SelectItem>
                        <SelectItem value="Pessoal">Pessoal</SelectItem>
                        <SelectItem value="Compras">Compras</SelectItem>
                        <SelectItem value="Saúde">Saúde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Select value={editPriority} onValueChange={setEditPriority}>
                      <SelectTrigger className="h-8 rounded-xl border-slate-100 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-950/50">
                        <SelectValue placeholder="Prioridade" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-9 justify-start text-left font-normal rounded-xl border-slate-100 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-950/50",
                          !editDueDate && "text-muted-foreground"
                        )}
                      >
                        {editDueDate ? format(editDueDate, "PPP", { locale: ptBR }) : <span>Data de entrega</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl border-slate-100 dark:border-slate-800 shadow-xl" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={editDueDate}
                        onSelect={setEditDueDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <Textarea 
                  placeholder="Notas adicionais..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="rounded-xl bg-slate-50 dark:bg-slate-950 border-transparent focus-visible:ring-indigo-500 text-xs min-h-[60px]"
                />
                
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} className="rounded-xl h-8 text-xs">
                    <Check className="w-3 h-3 mr-1" /> Salvar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl h-8 text-xs">
                    <X className="w-3 h-3 mr-1" /> Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "text-sm font-semibold truncate transition-all text-slate-700 dark:text-slate-200",
                    isCompleted && "line-through text-slate-400 dark:text-slate-600"
                  )}>
                    {task.title}
                  </span>
                  <div className="flex gap-1.5">
                    <Badge variant="outline" className={cn(
                      "text-[9px] px-1.5 py-0 h-4 font-bold uppercase tracking-wider border",
                      CATEGORY_COLORS[task.category] || CATEGORY_COLORS["Geral"]
                    )}>
                      {task.category}
                    </Badge>
                    {!isCompleted && (
                      <Badge variant="outline" className={cn(
                        "text-[9px] px-1.5 py-0 h-4 font-bold uppercase tracking-wider border flex items-center gap-0.5",
                        PRIORITY_COLORS[task.priority]
                      )}>
                        <AlertTriangle className="w-2 h-2" />
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {dueDateObj && (
                    <span className={cn(
                      "text-[10px] flex items-center gap-1 font-medium",
                      isOverdue ? "text-rose-500" : "text-slate-400 dark:text-slate-500"
                    )}>
                      <Calendar className="w-3 h-3" />
                      {isOverdue ? "Atrasada: " : "Entrega: "}
                      {format(dueDateObj, "dd 'de' MMM", { locale: ptBR })}
                    </span>
                  )}
                  {task.completed_at && isCompleted && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-600 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Concluído em {format(new Date(task.completed_at), "dd/MM, HH:mm", { locale: ptBR })}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.notes && !isEditing && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowNotes(!showNotes)}
              className={cn("rounded-full h-8 w-8", showNotes ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" : "text-slate-400")}
            >
              <StickyNote className="w-3.5 h-3.5" />
            </Button>
          )}
          {!isEditing && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full h-8 w-8"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(task.id)}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full h-8 w-8"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showNotes && task.notes && !isEditing && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-800"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
              {task.notes}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};