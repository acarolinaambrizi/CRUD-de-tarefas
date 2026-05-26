"use client";

import { supabase } from '@/integrations/supabase/client';
import { navigate } from 'next/navigation';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [message, setMessage] = useState('');

  // Extrair token de recuperação da URL
  const urlParams = new URLSearchParams(window.location.search);
  setResetToken(urlParams.get('token') || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim() || !resetToken) {
      setMessage('Por favor, insira uma nova senha e confirme o token');
      return;
    }

    try {
      await supabase.auth.setPassword({ password, resetToken });
      setMessage('Senha atualizada com sucesso!');
      navigate('/');
    } catch (error) {
      setMessage(`Erro: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold text-slate-900">Redefinir Senha</h2>
      <p className="text-sm text-slate-500">{message}</p>
      <form className="mt-4" onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nova senha"
          required
          className="w-full p-2 border border-slate-100 rounded-2xl focus:outline-none focus:ring-indigo-500"
        />
        <input
          type="hidden"
          value={resetToken}
          name="resetToken"
          className="w-full p-2 border border-slate-100 rounded-2xl focus:outline-none focus:ring-indigo-500"
        />
        <button 
          type="submit"
          className="mt-3 w-full bg-indigo-600 text-white px-4 py-2 rounded-2xl hover:bg-indigo-700"
        >
          Redefinir senha
        </button>
      </form>
    </div>
  );
};