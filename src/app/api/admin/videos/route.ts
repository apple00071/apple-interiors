import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface VideoData {
  processVideo: {
    videoId: string;
    title: string;
    description: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { videoId } = data;

    if (!videoId) {
      return NextResponse.json(
        { success: false, message: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Load current video data
    const videoPath = join(process.cwd(), 'src', 'app', 'data', 'videos.json');
    let videoData: VideoData;
    
    try {
      const fileContent = await readFile(videoPath, 'utf-8');
      videoData = JSON.parse(fileContent);
    } catch {
      videoData = {
        processVideo: {
          videoId: '',
          title: 'Our Process',
          description: 'Watch how we transform spaces'
        }
      };
    }

    // Update video data
    videoData.processVideo.videoId = videoId;

    // Save updated video data
    await writeFile(
      videoPath,
      JSON.stringify(videoData, null, 2),
      'utf-8'
    );

    return NextResponse.json({ success: true, data: videoData });
  } catch (error) {
    console.error('Video update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update video' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const videoPath = join(process.cwd(), 'src', 'app', 'data', 'videos.json');
    let videoData: VideoData;

    try {
      const fileContent = await readFile(videoPath, 'utf-8');
      videoData = JSON.parse(fileContent);
    } catch {
      videoData = {
        processVideo: {
          videoId: '',
          title: 'Our Process',
          description: 'Watch how we transform spaces'
        }
      };
    }

    return NextResponse.json({ success: true, data: videoData });
  } catch (error) {
    console.error('Video fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch video data' },
      { status: 500 }
    );
  }
} 