export type Score = {
  userId: number;
  userName: string;
  score: number;
};
export type Entry = Score & {
  entryId: number;
};

export async function readLeaderBoard(): Promise<Entry[]> {
  const req = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  const res = await fetch('/api/snake/score', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function getUserScore(
  userId: number
): Promise<number | undefined> {
  const req = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  const res = await fetch(`/api/snake/score/${userId}`, req);
  if (!res.ok) {
    if (res.status === 404) {
      // User not found in the leaderboard
      return undefined;
    }
    throw new Error(`Fetch Error: ${res.status}`);
  }
  const userData = await res.json();
  return userData.score;
}

export async function addScore(entry: Score): Promise<Entry> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify(entry),
  };
  const res = await fetch('/snake/score', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function updateScore(entry: Score): Promise<Entry> {
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify(entry),
  };
  const res = await fetch(`/snake/score/entryId`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}
