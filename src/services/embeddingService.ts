/**
 * Embedding Service - Text embeddings for semantic similarity
 * Uses OpenAI embeddings API
 */

const EMBEDDING_MODEL = 'text-embedding-ada-002';
const EMBEDDING_CACHE = new Map<string, number[]>();

export async function getEmbedding(text: string): Promise<number[]> {
  // Check cache first
  const cacheKey = text.trim().toLowerCase().slice(0, 100);
  if (EMBEDDING_CACHE.has(cacheKey)) {
    return EMBEDDING_CACHE.get(cacheKey)!;
  }

  try {
    // Call OpenAI embeddings API via Supabase edge function
    const response = await fetch('/api/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model: EMBEDDING_MODEL })
    });

    if (!response.ok) {
      console.warn('Embedding API failed, using fallback');
      return getFallbackEmbedding(text);
    }

    const data = await response.json();
    const embedding = data.embedding || getFallbackEmbedding(text);
    
    // Cache result (max 1000 entries)
    if (EMBEDDING_CACHE.size > 1000) {
      const firstKey = EMBEDDING_CACHE.keys().next().value;
      EMBEDDING_CACHE.delete(firstKey);
    }
    EMBEDDING_CACHE.set(cacheKey, embedding);
    
    return embedding;
  } catch (error) {
    console.error('Embedding service error:', error);
    return getFallbackEmbedding(text);
  }
}

// Simple fallback: character frequency vector (1536 dimensions)
function getFallbackEmbedding(text: string): number[] {
  const normalized = text.toLowerCase();
  const vector = new Array(1536).fill(0);
  
  for (let i = 0; i < normalized.length; i++) {
    const charCode = normalized.charCodeAt(i);
    const idx = charCode % 1536;
    vector[idx] += 1;
  }
  
  // Normalize
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }
  
  const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);
  return magnitude > 0 ? dotProduct / magnitude : 0;
}

export function meanVector(vectors: number[][]): number[] {
  if (vectors.length === 0) return [];
  
  const dim = vectors[0].length;
  const result = new Array(dim).fill(0);
  
  for (const vec of vectors) {
    for (let i = 0; i < dim; i++) {
      result[i] += vec[i];
    }
  }
  
  return result.map(v => v / vectors.length);
}
