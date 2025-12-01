const PROD_BACKENDS = [
  "https://backend.paoloc.xyz",   
  "https://backend-mac.paoloc.xyz" 
];

export async function fetchWithFailover(endpoint, options = {}) {
  let lastError;

  for (const url of PROD_BACKENDS) {
    try {
      const res = await fetch(`${url}${endpoint}`, options);
      if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
      return await res.json();
    } catch (err) {
      lastError = err;
      console.log(`Backend ${url} failed: ${err.message}. Trying next...`);
    }
  }

  throw lastError; 
}