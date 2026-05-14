import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const setupDatabase = async () => {
  try {
    // Verificar se as tabelas existem
    const { error: checkError } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);

    if (checkError && checkError.code === 'PGRST205') {
      console.warn('As tabelas tasks e profiles ainda não existem no banco de dados.');
      console.warn('Por favor, execute o script SQL no Supabase SQL Editor:');
      console.warn('1. Acesse https://supabase.com/dashboard/project/psoxylumysgpfdqptnyp/sql/new');
      console.warn('2. Cole o SQL abaixo e execute');
      return { success: false, message: 'Database not set up yet' };
    }

    return { success: true, message: 'Database already set up' };
  } catch (error) {
    console.error('Error checking database:', error);
    return { success: false, message: 'Error checking database' };
  }
};