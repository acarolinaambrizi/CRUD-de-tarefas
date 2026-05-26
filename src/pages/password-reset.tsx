"use client";

import { supabase } from '@/integrations/supabase/client';
import { navigate } from 'next/navigation';

export const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage('Por favor, insira seu e-mail');
      return;
    }

    try {
      await supabase.auth.forgotPassword({ email });
      setMessage('Link de recuperação enviado para seu e-mail');
      setEmail('');
    } catch (error) {
      setMessage(`Erro: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold text-slate-900">Recuperação de Senha</h2>
      <p className="text-sm text-slate-500">{message}</p>
      <form className="mt-4" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu e-mail"
          required
          className="w-full p-2 border border-slate-100 rounded-2xl focus:outline-none focus:ring-indigo-500"
        />
        <button 
          type="submit"
          className="mt-3 w-full bg-indigo-600 text-white px-4 py-2 rounded-2xl hover:bg-indigo-700"
        >
          Enviar link de recuperação
        </button>
      </form>
    </div>
  );
};