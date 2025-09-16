import axios from "axios";

export async function fetchPokemon(name: string) {
  const res = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
  );
  return {
    id: res.data.id,
    name: res.data.name,
    height: res.data.height,
    weight: res.data.weight,
    sprite: res.data.sprites?.front_default,
    types: res.data.types.map((t: any) => t.type.name),
    raw: res.data,
  };
}
