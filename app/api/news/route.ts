import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'international';
  
  // Use either the public or private env variable
  const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || process.env.NEWS_API_KEY;
  
  let url = '';
  if (type === 'india') {
    url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${API_KEY}`;
  } else if (type === 'markets') {
    url = `https://newsapi.org/v2/everything?q="stock market" OR crypto OR nasdaq&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;
  } else if (type === 'business') {
    url = `https://newsapi.org/v2/top-headlines?category=business&language=en&apiKey=${API_KEY}`;
  } else {
    // Default: International Tech
    url = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${API_KEY}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}