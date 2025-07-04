import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const configPath = path.join(process.cwd(), 'src/app/data/video-config.json');

export async function GET() {
  try {
    const configData = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configData);
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    // If file doesn't exist, return default video ID
    return NextResponse.json({ 
      success: true, 
      data: { processVideoId: "Av5O1EjRGuA" } 
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated as admin
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { processVideoId } = data;

    if (!processVideoId) {
      return NextResponse.json({ success: false, error: 'Video ID is required' }, { status: 400 });
    }

    // Save the video ID to config file
    await fs.writeFile(configPath, JSON.stringify({ processVideoId }, null, 2));

    return NextResponse.json({ success: true, data: { processVideoId } });
  } catch (error) {
    console.error('Error updating video ID:', error);
    return NextResponse.json({ success: false, error: 'Failed to update video ID' }, { status: 500 });
  }
} 