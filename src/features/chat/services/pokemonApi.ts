import { fetchPokemon } from "../../../core/api/pokeApiTool";

export async function runPokemonTool(query: string) {
  const name = query.trim().split(/\s+/).pop() || query;
  try {
    const data = await fetchPokemon(name);
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}
