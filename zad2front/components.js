// JSX
function PokemonRowJSX({ pokemon, onSelect }) {
  return (
    <tr style={{ cursor: "pointer" }} onClick={() => onSelect(pokemon)}>
      <td>{pokemon.id}</td>
      <td className="text-capitalize">{pokemon.name}</td>
      <td><img src={pokemon.sprite} alt={pokemon.name} style={{ height: 50 }} /></td>
    </tr>
  );
}

// React
function PokemonRowCreate({ pokemon, onSelect }) {
  return React.createElement(
    "tr",
    { style: { cursor: "pointer" }, onClick: () => onSelect(pokemon) },
    React.createElement("td", null, pokemon.id),
    React.createElement("td", { className: "text-capitalize" }, pokemon.name),
    React.createElement("td", null, React.createElement("img", { src: pokemon.sprite, alt: pokemon.name, style: { height: 50 } }))
  );
}

// JSX
function PokemonDetails({ pokemon, getStatColor }) {
  if (!pokemon) {
    return <div className="text-center text-muted mt-4"></div>;
  }

  return (
    <div className="card p-3">
      <div className="text-center mb-2">
        <img src={pokemon.sprite} alt={pokemon.name} style={{ width: 150 }} className="d-block mx-auto" />
        <h4 className="mt-2 text-capitalize">#{pokemon.id} {pokemon.name}</h4>
      </div>

      <div className="mb-2"><strong>Types:</strong> {pokemon.types.join(", ")}</div>
      <div className="mb-2"><strong>Height:</strong> {pokemon.height} m</div>
      <div className="mb-2"><strong>Weight:</strong> {pokemon.weight} kg</div>

      <h5 className="mt-3">Stats</h5>
      {pokemon.stats.map(s => (
        <div key={s.name} className="mb-2">
          <div className="d-flex justify-content-between">
            <small>{s.name.toUpperCase()}</small>
            <small>{s.base_stat}</small>
          </div>
          <div className="progress">
            <div className={`progress-bar ${getStatColor(s.base_stat)}`} role="progressbar" style={{ width: `${Math.min(s.base_stat, 100)}%` }}></div>
          </div>
        </div>
      ))}

      <h6 className="mt-3">Abilities</h6>
      <div>
        {pokemon.abilities.map(a => (
          <span key={a.name} className={a.hidden ? "badge bg-warning text-dark me-1" : "badge bg-primary me-1"}>
            {a.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// JSX
function ErrorBox({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Error:</strong> {message}
      <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
    </div>
  );
}

function GameDexApp(props) {
  const {
    pokemons,
    selectedPokemon,
    onSelect,
    onSearch,
    onFilter,
    useJSX,
    toggleJSX,
    errorMessage,
    clearError,
    getStatColor
  } = props;

  const types = ["", "normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dark", "dragon", "steel", "fairy"];

  const RowComp = useJSX ? PokemonRowJSX : PokemonRowCreate;

  return (
    <div className="container mt-3">
      <ErrorBox message={errorMessage} onClose={clearError} />

      <div className="d-flex mb-3 gap-2">
        <input type="text" className="form-control" placeholder="Search Pokémon by name or ID" onInput={(e) => onSearch(e.target.value)} />
        <select className="form-select" onChange={(e) => onFilter(e.target.value)}>
          {types.map(t => <option key={t} value={t}>{t ? t.charAt(0).toUpperCase() + t.slice(1) : "All Types"}</option>)}
        </select>
        <button className="btn btn-secondary" onClick={toggleJSX}>{useJSX ? "JSX Mode" : "createElement Mode"}</button>
      </div>

      <div id="pokemon-container" className="row">
        <div id="pokemon-list" className="col-md-8">
          <table className="table table-bordered text-center align-middle">
            <thead>
              <tr><th>#</th><th>Name</th><th>Sprite</th></tr>
            </thead>
            <tbody>
              {pokemons && pokemons.length
                ? pokemons.map(p => useJSX ? <RowComp key={p.id} pokemon={p} onSelect={onSelect} /> : React.createElement(RowComp, { key: p.id, pokemon: p, onSelect }))
                : <tr><td colSpan="3">No Pokémon to display</td></tr>}
            </tbody>
          </table>
        </div>

        <div id="pokemon-details" className="col-md-4">
          <div className="mt-3">
            {useJSX ? <PokemonDetails pokemon={selectedPokemon} getStatColor={getStatColor} /> : React.createElement(PokemonDetails, { pokemon: selectedPokemon, getStatColor })}
          </div>
        </div>
      </div>
    </div>
  );
}
