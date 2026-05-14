"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const ProfileSettings = ({ userId, onUpdate }: { userId: string, onUpdate: (name: string) => void }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) fetchProfile();
  }, [open]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', userId)
      .single();
    
    if (data) setName(data.first_name || '');
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ first_name: name, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;
      
      onUpdate(name);
      toast.success("Perfil atualizado!");
      setOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-indigo-600">
          <User className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-[425px] border-slate-100 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar Perfil</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-400">Seu Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-2xl bg-slate-50 dark:bg-slate-900 border-transparent focus-visible:ring-indigo-500"
              placeholder="Como quer ser chamado?"
            />
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={loading || !name.trim()}
          className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 h-12 font-bold shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5 mr-2" /> Salvar Alterações</>}
        </Button>
      </DialogContent>
    </Dialog>
  );
};