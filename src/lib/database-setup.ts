import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const setupDatabase = async () => {
  try {
    // Criar tabela de tarefas
    const { error: tasksError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
          category TEXT DEFAULT 'Geral',
          priority TEXT DEFAULT 'Média' CHECK (priority IN ('Baixa', 'Média', 'Alta')),
          notes TEXT,
          due_date TIMESTAMP WITH TIME ZONE,
          completed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (tasksError) throw tasksError;

    // Habilitar RLS na tabela de tarefas
    const { error: rlsError } = await supabase.rpc('exec', {
      sql: `
        ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
      `
    });

    if (rlsError) throw rlsError;

    // Criar políticas de segurança para tarefas
    const { error: policiesError } = await supabase.rpc('exec', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Users can view their own tasks" ON tasks
          FOR SELECT TO authenticated USING (auth.uid() = user_id);
        
        CREATE POLICY IF NOT EXISTS "Users can insert their own tasks" ON tasks
          FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY IF NOT EXISTS "Users can update their own tasks" ON tasks
          FOR UPDATE TO authenticated USING (auth.uid() = user_id);
        
        CREATE POLICY IF NOT EXISTS "Users can delete their own tasks" ON tasks
          FOR DELETE TO authenticated USING (auth.uid() = user_id);
      `
    });

    if (policiesError) throw policiesError;

    // Criar tabela de perfis
    const { error: profilesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
          first_name TEXT,
          last_name TEXT,
          avatar_url TEXT,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (profilesError) throw profilesError;

    // Habilitar RLS na tabela de perfis
    const { error: profilesRlsError } = await supabase.rpc('exec', {
      sql: `
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
      `
    });

    if (profilesRlsError) throw profilesRlsError;

    // Criar políticas para perfis
    const { error: profilesPoliciesError } = await supabase.rpc('exec', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Users can view their own profile" ON profiles
          FOR SELECT TO authenticated USING (auth.uid() = id);
        
        CREATE POLICY IF NOT EXISTS "Users can insert their own profile" ON profiles
          FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
        
        CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON profiles
          FOR UPDATE TO authenticated USING (auth.uid() = id);
      `
    });

    if (profilesPoliciesError) throw profilesPoliciesError;

    // Criar função para atualizar updated_at automaticamente
    const { error: triggerError } = await supabase.rpc('exec', {
      sql: `
        CREATE OR REPLACE FUNCTION handle_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    if (triggerError) throw triggerError;

    // Criar trigger para atualizar updated_at
    const { error: tasksTriggerError } = await supabase.rpc('exec', {
      sql: `
        CREATE TRIGGER IF NOT EXISTS handle_tasks_updated_at
        BEFORE UPDATE ON tasks
        FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
      `
    });

    if (tasksTriggerError) throw tasksTriggerError;

    console.log('Database setup completed successfully!');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
};