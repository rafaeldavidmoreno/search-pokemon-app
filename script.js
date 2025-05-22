let baseurl = "https://pokeapi.co/api/v2/pokemon/";

document.getElementById("searchButton").addEventListener("click", async () => {
  let valor = document.getElementById("searchInput").value.trim().toLowerCase();
  if (!valor) {
    document.getElementById("results").innerHTML = "<span>Por favor ingrese un nombre de Pokémon.</span>";
    return;
  }
  try {
    let data = await fetch(`${baseurl}${valor}`);
    if (!data.ok) {
      throw new Error("No se encontró el Pokémon.");
    }
    let response = await data.json();

    // Fetch species para obtener datos en español
    let speciesData = await fetch(response.species.url);
    let species = await speciesData.json();

    // Nombre en español
    let nombreES = species.names.find(n => n.language.name === "es");
    // Descripción en español
    let descripcionES = species.flavor_text_entries.find(
      entry => entry.language.name === "es"
    );

    mostrarPokemon(response, nombreES ? nombreES.name : response.name, descripcionES ? descripcionES.flavor_text : "");
  } catch (error) {
    document.getElementById("results").innerHTML = `<span>${error.message}</span>`;
  }
});

let mostrarPokemon = (response, nombre, descripcion) => {
  document.getElementById("results").innerHTML = ""; // Limpiar resultados anteriores
  if (!response) {
    document.getElementById("results").innerHTML = "<span>No se encontraron resultados.</span>";
    return;
  }

  let div = document.createElement("div");
  div.className = "pokemon";
  div.innerHTML = `
      <img src="${response.sprites.front_default}" alt="${nombre}">
      <h3>${nombre}</h3>
      <p>${descripcion}</p>
      <p>Tipo: ${response.types.map(type => type.type.name).join(', ')}</p>
      <p>Altura: ${response.height}</p>
      <p>Peso: ${response.weight}</p>
  `;
  document.getElementById("results").appendChild(div);
}