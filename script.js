let baseurl = "https://pokeapi.co/api/v2/pokemon/";

// Diccionario de traducción de tipos al español
const tiposES = {
  normal: "Normal",
  fire: "Fuego",
  water: "Agua",
  electric: "Eléctrico",
  grass: "Planta",
  ice: "Hielo",
  fighting: "Lucha",
  poison: "Veneno",
  ground: "Tierra",
  flying: "Volador",
  psychic: "Psíquico",
  bug: "Bicho",
  rock: "Roca",
  ghost: "Fantasma",
  dragon: "Dragón",
  dark: "Siniestro",
  steel: "Acero",
  fairy: "Hada"
};

document.getElementById("searchButton").addEventListener("click", async () => {
  let valor = document.getElementById("searchInput").value.trim().toLowerCase();
  if (!valor) {
    document.getElementById("results").innerHTML = "<span>Por favor ingrese un nombre de Pokémon.</span>";
    return;
  }
  // Mostrar mensaje de búsqueda
  document.getElementById("results").innerHTML = "<span>Buscando...</span>";
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

    // Obtener el primer tipo del Pokémon
    let tipo = response.types[0].type.name;

    // Petición a la API de tipo para obtener fortalezas y debilidades
    let tipoData = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
    let tipoJson = await tipoData.json();

    // Tipos contra los que es fuerte y débil
    let fuerteContra = tipoJson.damage_relations.double_damage_to.map(t => t.name).join(', ');
    let debilContra = tipoJson.damage_relations.double_damage_from.map(t => t.name).join(', ');

    mostrarPokemon(
      response,
      nombreES ? nombreES.name : response.name,
      descripcionES ? descripcionES.flavor_text : "",
      fuerteContra,
      debilContra
    );
  } catch (error) {
    document.getElementById("results").innerHTML = `<span>${error.message}</span>`;
  }
});

let mostrarPokemon = (response, nombre, descripcion, fuerteContra, debilContra) => {
  document.getElementById("results").innerHTML = ""; // Limpiar resultados anteriores
  if (!response) {
    document.getElementById("results").innerHTML = "<span>No se encontraron resultados.</span>";
    return;
  }

  // Traducir tipos de fuerteContra y debilContra
  const traducirTipos = tipos => tipos
    .split(', ')
    .map(tipo => tiposES[tipo] || tipo)
    .join(', ');

  let div = document.createElement("div");
  div.className = "pokemon";
  div.innerHTML = `
      <img src="${response.sprites.front_default}" alt="${nombre}">
      <h3>${nombre}</h3>
      <p>${descripcion}</p>
            <p>Tipo: ${response.types.map(type => tiposES[type.type.name] || type.type.name).join(', ')}</p>
      <p><strong>Fuerte contra:</strong> ${traducirTipos(fuerteContra)}</p>
      <p><strong>Débil contra:</strong> ${traducirTipos(debilContra)}</p>
      <p>Altura: ${response.height}</p>
      <p>Peso: ${response.weight}</p>
  `;
  document.getElementById("results").appendChild(div);
}
