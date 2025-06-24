// Fetched Pokémon data from your backend and displayed each Pokémon as a card.


fetch('/api/pokemon')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('pokemon-list');
    data.forEach(pokemon => {
      const div = document.createElement('div');
      div.className = 'pokemon-card';
      div.innerHTML = `
	<a href="pokemon.html?id=${pokemon.id}">
	        <img src="${pokemon.image}" alt="${pokemon.name}" />
        	<h2>${pokemon.name}</h2>
	        <p>Type: ${pokemon.type}</p>
	</a>
      `;
      list.appendChild(div);
    });
  })
  .catch(err => {
    document.getElementById('pokemon-list').innerText = 'Failed to load Pokémon data.';
  });

