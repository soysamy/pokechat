import axios from "axios";

export async function getPokemon(name: string) {
  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  return {
    name: res.data.name,
    sprite: res.data.sprites.front_default,
    types: res.data.types.map((t: any) => t.type.name),
  };
}
