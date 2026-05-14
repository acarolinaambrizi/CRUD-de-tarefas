"use client";

import React from 'react';
import { Task } from '@/types/task';
import { CheckCircle2, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats = ({ tasks }: TaskStatsProps) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = total - completed;
  const highPriority = tasks.filter(t => t.priority === 'Alta' && t.status === 'pending').length;

  const stats = [
    { label: 'Total', value: total, icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Feitas', value: completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pendentes', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Urgentes', value: highPriority, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  if (total === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 w-full mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3"
        >
          <div className={`${stat.bg} p-2 rounded-xl`}>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-lg font-bold text-slate-700 leading-none">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};