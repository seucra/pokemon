// Get the Pokémon ID from the URL query string
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (!id) {
  document.getElementById('pokemon-details').innerText = 'No Pokémon selected.';
} else {
  fetch(`/api/pokemon/${id}`)
    .then(res => res.json())
    .then(pokemon => {
      if (!pokemon) {
        document.getElementById('pokemon-details').innerText = 'Pokémon not found.';
        return;
      }
      document.getElementById('pokemon-details').innerHTML = `
        <img src="${pokemon.image}" alt="${pokemon.name}" />
        <h2>${pokemon.name}</h2>
        <p>Type: ${pokemon.type}</p>
      `;
    })
    .catch(() => {
      document.getElementById('pokemon-details').innerText = 'Error loading Pokémon details.';
    });
}
