import type { APIRoute } from 'astro';
import vehicles from '../../data/vehicles.json';
import posts from '../../data/posts.json';
import navigation from '../../data/navigation.json';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ vehicles, posts, navigation }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
