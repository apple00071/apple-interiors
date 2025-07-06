import { NextResponse } from 'next/server';
import { getPortfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const items = await getPortfolioItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const item = await request.json();
    const result = await addPortfolioItem(item);
    revalidatePath('/portfolio');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to add portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to add portfolio item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...item } = await request.json();
    const result = await updatePortfolioItem(id, item);
    revalidatePath('/portfolio');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to update portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await deletePortfolioItem(id);
    revalidatePath('/portfolio');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio item' },
      { status: 500 }
    );
  }
} 