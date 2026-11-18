import type { APIRoute } from 'astro';
import { prepareIndex, searchIndex } from '../../search/rank.mjs';
export const prerender = false;
let indexPromise: Promise<ReturnType<typeof prepareIndex>> | undefined;
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const env = (locals as any).runtime.env;
    indexPromise ||= env.ASSETS.fetch(new Request(new URL('/search-index.json', url)))
      .then(async (response: Response) => {
        if (!response.ok) throw new Error('Index unavailable');
        return prepareIndex(await response.json());
      }).catch((error: Error) => { indexPromise = undefined; throw error; });
    return Response.json({ hits: searchIndex(await indexPromise, url.searchParams.get('q') || '') },
      { headers: { 'cache-control': 'public, max-age=300' } });
  } catch {
    return Response.json({ hits: [], error: 'Search temporarily unavailable' }, { status: 503 });
  }
};
