export type Score = {
  userId: number;
  userName: string;
  score: number;
};
export type Entry = Score & {
  entryId: number;
};

export async function addScore(entry: Score): Promise<Entry> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  };
  const res = await fetch('/snake/score', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}
