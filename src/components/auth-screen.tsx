"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { ListTodo, Lock, Unlock } from 'lucide-react';
import { navigate } from 'next/navigation';

export const AuthScreen = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
            <ListTodo className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Bem-vindo ao Dyad Tasks</h1>
          <p className="text-sm text-slate-500">Entre para sincronizar suas tarefas</p>
        </div>
        
        {/* Adicionando opção de recuperação de senha */}
        <div className="mt-8">
          <button 
            onClick={() => navigate('/password-reset')}
            className="text-sm font-medium text-slate-600 hover:text-indigo-600"
          >
            <Lock className="w-5 h-5 mr-2" /> Esqueceu a senha?
          </button>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4f46e5',
                  brandAccent: '#4338ca',
                },
                radii: {
                  buttonRadius: '12px',
                  inputRadius: '12px',
                }
              }
            }
          }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'E-mail',
                password_label: 'Senha',
                button_label: 'Entrar',
              },
              sign_up: {
                email_label: 'E-mail',
                password_label: 'Senha',
                button_label: 'Cadastrar',
              }
            }
          }}
        />
      </div>
    </div>
  );
};