import { NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/database-setup';

export async function GET() {
  try {
    const success = await setupDatabase();
    
    if (success) {
      return NextResponse.json({ 
        message: 'Database setup completed successfully',
        success: true 
      });
    } else {
      return NextResponse.json({ 
        message: 'Database setup failed',
        success: false 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      success: false 
    }, { status: 500 });
  }
}