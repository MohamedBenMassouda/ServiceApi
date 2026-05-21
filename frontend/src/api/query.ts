import { Product } from './catalog';

const QUERY_URL = (import.meta as unknown as { env: Record<string, string> }).env.VITE_QUERY_URL ?? 'http://localhost:3003';

async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${QUERY_URL}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const data = await gql<{ searchProducts: Product[] }>(
    `query Search($query: String!) { searchProducts(query: $query) { id name price stock } }`,
    { query },
  );
  return data.searchProducts;
}
