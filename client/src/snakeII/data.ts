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
  const res = await fetch('/snake/score', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
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
