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
    getStatColor,
  } = props;

  const types = [
    "", "normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison",
    "ground", "flying", "psychic", "bug", "rock", "ghost", "dark", "dragon", "steel", "fairy"
  ];

  return React.createElement("div", { className: "container mt-3" },
    errorMessage && React.createElement("div", { className: "alert alert-danger alert-dismissible fade show", role: "alert" },
      errorMessage,
      React.createElement("button", {
        type: "button",
        className: "btn-close",
        onClick: clearError
      })
    ),
    React.createElement("div", { className: "d-flex mb-3 gap-2" },
      React.createElement("input", {
        type: "text",
        className: "form-control",
        placeholder: "Search Pokémon by name or ID",
        onInput: (e) => onSearch(e.target.value)
      }),
      React.createElement("select", {
        className: "form-select",
        onChange: (e) => onFilter(e.target.value)
      },
        types.map((t) => React.createElement("option", { key: t, value: t }, t ? t.charAt(0).toUpperCase() + t.slice(1) : "All Types"))
      ),
      React.createElement("button", {
        className: "btn btn-secondary",
        onClick: toggleJSX
      }, useJSX ? "JSX Mode" : "createElement Mode")
    ),
    React.createElement("div", { className: "row" },
      React.createElement("div", { className: "col-md-8" },
        React.createElement("table", { className: "table table-bordered text-center align-middle" },
          React.createElement("thead", null,
            React.createElement("tr", null,
              React.createElement("th", null, "#"),
              React.createElement("th", null, "Name"),
              React.createElement("th", null, "Sprite")
            )
          ),
          React.createElement("tbody", null,
            pokemons.map((p) =>
              useJSX ? JSXPokemonRow(p, onSelect) : createElementPokemonRow(p, onSelect)
            )
          )
        )
      ),
      React.createElement("div", { className: "col-md-4" },
        selectedPokemon && PokemonDetails(selectedPokemon, getStatColor)
      )
    )
  );
}

function JSXPokemonRow(pokemon, onSelect) {
  return React.createElement("tr", {
    key: pokemon.id,
    style: { cursor: "pointer" },
    onClick: () => onSelect(pokemon)
  },
    React.createElement("td", null, pokemon.id),
    React.createElement("td", null, pokemon.name),
    React.createElement("td", null,
      React.createElement("img", { src: pokemon.sprite, alt: pokemon.name, style: { height: "50px" } })
    )
  );
}

function createElementPokemonRow(pokemon, onSelect) {
  return React.createElement(
    "tr",
    {
      key: pokemon.id,
      style: { cursor: "pointer" },
      onClick: () => onSelect(pokemon)
    },
    React.createElement("td", null, pokemon.id),
    React.createElement("td", null, pokemon.name),
    React.createElement("td", null,
      React.createElement("img", { src: pokemon.sprite, alt: pokemon.name, style: { height: "50px" } })
    )
  );
}

function PokemonDetails(pokemon, getStatColor) {
  return React.createElement("ul", { className: "list-group" },
    React.createElement("li", { className: "list-group-item text-center" },
      React.createElement("img", { src: pokemon.sprite, alt: pokemon.name, style: { height: "150px" } })
    ),
    React.createElement("li", { className: "list-group-item" }, "#" + pokemon.id),
    React.createElement("li", { className: "list-group-item" }, pokemon.name),
    pokemon.stats.map((s) =>
      React.createElement("li", { key: s.name, className: "list-group-item" },
        s.name.toUpperCase() + ": ",
        React.createElement("div", { className: "progress" },
          React.createElement("div", {
            className: "progress-bar " + getStatColor(s.base_stat),
            role: "progressbar",
            style: { width: s.base_stat + "%" }
          }, s.base_stat)
        )
      )
    ),
    React.createElement("li", { className: "list-group-item" }, "Height: " + pokemon.height + "m"),
    React.createElement("li", { className: "list-group-item" }, "Weight: " + pokemon.weight + "kg"),
    React.createElement("li", { className: "list-group-item" }, "Types: " + pokemon.types.join(", ")),
    React.createElement("li", { className: "list-group-item" }, "Abilities: ",
      pokemon.abilities.map((a) =>
        React.createElement("span", {
          key: a.name,
          className: a.hidden ? "badge bg-warning text-dark mx-1" : "badge bg-primary mx-1"
        }, a.name)
      )
    )
  );
}
