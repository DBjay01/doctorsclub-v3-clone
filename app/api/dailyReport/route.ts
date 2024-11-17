import { NextResponse } from 'next/server';
import { sendDailyReport } from '@/lib/emailReport';

export async function POST() {
  try {
    await sendDailyReport();
    return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to send emails', error }, { status: 500 });
  }
}

export const runtime = "edge";  

/// You rock !!!! ;)