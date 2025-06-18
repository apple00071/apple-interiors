import { NextResponse } from 'next/server';
import { POST as mainPost, OPTIONS as mainOptions } from '../route';

// Re-export the handlers from the main route
export const POST = mainPost;
export const OPTIONS = mainOptions; 