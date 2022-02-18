import postals from "./postals.json";

export function getPostal(): string | null {
  const [x, y]: any[] = GetEntityCoords(GetPlayerPed(-1), true);

  let ndm = -1; // nearest distance magnitude
  let ni = -1; // nearest index

  postals.map((postal, idx) => {
    // prettier-ignore
    const dm = (x - postal.x) ^2 + (y - postal.y) ^2;

    if (ndm === -1 || dm < ndm) {
      ni = idx;
      ndm = dm;
    }
  });

  let nearest: any = {};
  if (ni !== -1) {
    const nd = Math.sqrt(ndm);
    nearest = { i: ni, d: nd };
  }

  return postals[nearest.id]?.code ?? null;
}
