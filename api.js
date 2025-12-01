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

export async function getAllTitles() {
  return fetchWithFailover("/api/titles");
}

export async function insertRecord(record) {
  return fetchWithFailover("/api/records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });
}

export async function updateRecord(tconst, updates) {
  return fetchWithFailover(`/api/records/${tconst}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

export async function searchRecords(sql, node = "node1", isolation = "REPEATABLE READ") {
  const params = new URLSearchParams({ node, sql, isolation });
  return fetchWithFailover(`/reports?${params.toString()}`);
}

export async function fetchReports(sql, node = "node1", isolation = "REPEATABLE READ") {
  const params = new URLSearchParams({ node, sql, isolation });
  return fetchWithFailover(`/reports?${params.toString()}`);
}
