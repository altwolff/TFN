"use client";

import React from "react";
import ReactDOM from "react-dom/client";
import GameDexApp from "../components";

let allPokemons = [];
let filteredPokemons = [];
let selectedPokemon = null;
let useJSX = true;
let errorMessage = "";

function init() {
  const rootDiv = document.getElementById("root");
  if (!rootDiv) {
    console.error("No #root element found in page!");
    return;
  }
  const root = ReactDOM.createRoot(rootDiv);

  function showError(msg) {
    errorMessage = msg;
    render();
  }

  function clearError() {
    errorMessage = "";
    render();
  }

  function getStatColor(value) {
    if (value > 100) return "bg-success";
    if (value > 60) return "bg-warning";
    return "bg-danger";
  }

  async function getPokemonDetails(identifier) {
    try {
      const url =
        typeof identifier === "string" && identifier.startsWith("http")
          ? identifier
          : `https://pokeapi.co/api/v2/pokemon/${identifier}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Could not fetch details for ${identifier}`);
      const data = await res.json();
      return {
        id: data.id,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        sprite: data.sprites.front_default,
        types: data.types.map((t) => t.type.name),
        stats: data.stats.map((s) => ({ name: s.stat.name, base_stat: s.base_stat })),
        abilities: data.abilities.map((a) => ({ name: a.ability.name, hidden: a.is_hidden })),
        height: (data.height / 10).toFixed(1),
        weight: (data.weight / 10).toFixed(1),
      };
    } catch (err) {
      console.error(err);
      showError(err.message);
      return null;
    }
  }

  async function fetchPokemons() {
    try {
      const progressBar = document.getElementById("progress-bar");
      if (progressBar) {
        progressBar.style.width = "0%";
        progressBar.innerText = "0%";
      }

      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
      if (!res.ok) throw new Error("Failed to fetch Pokémon list");
      const data = await res.json();
      const results = data.results;

      allPokemons = [];

      for (let i = 0; i < results.length; i++) {
        const detail = await getPokemonDetails(results[i].url);
        if (detail) allPokemons.push(detail);

        if (progressBar) {
          const percent = Math.round(((i + 1) / results.length) * 100);
          progressBar.style.width = percent + "%";
          progressBar.innerText = percent + "%";
        }
      }

      filteredPokemons = [...allPokemons];
      selectedPokemon = null;
      errorMessage = "";

      render();
    } catch (err) {
      console.error(err);
      showError(err.message);
    }
  }

  async function fetchPokemonsByType(type) {
    try {
      const progressBar = document.getElementById("progress-bar");
      if (progressBar) {
        progressBar.style.width = "0%";
        progressBar.innerText = "0%";
      }

      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      if (!res.ok) throw new Error(`Could not fetch Pokémon of type ${type}`);
      const data = await res.json();

      const detailed = [];
      const sliceLimit = 50;
      for (let i = 0; i < Math.min(data.pokemon.length, sliceLimit); i++) {
        const p = await getPokemonDetails(data.pokemon[i].pokemon.url);
        if (p) detailed.push(p);

        if (progressBar) {
          const percent = Math.round(((i + 1) / Math.min(data.pokemon.length, sliceLimit)) * 100);
          progressBar.style.width = percent + "%";
          progressBar.innerText = percent + "%";
        }
      }

      filteredPokemons = detailed;
      render();
    } catch (err) {
      showError(err.message);
    }
  }

  async function handleSearch(query) {
    const value = query.toLowerCase().trim();
    if (!value) {
      filteredPokemons = [...allPokemons];
      render();
      return;
    }

    let results = allPokemons.filter(
      (p) => p.name.toLowerCase().includes(value) || p.id.toString().includes(value)
    );

    if (results.length === 0) {
      try {
        const fetched = await getPokemonDetails(value);
        if (fetched) results = [fetched];
      } catch (err) {
        console.error(err);
      }
    }

    filteredPokemons = results;
    render();
  }

  function handleFilter(type) {
    if (!type) {
      filteredPokemons = [...allPokemons];
      render();
      return;
    }
    fetchPokemonsByType(type);
  }

  async function handleSelect(pokemon) {
    const details = await getPokemonDetails(String(pokemon.id));
    selectedPokemon = details;
    render();
  }

  function toggleRenderMode() {
    useJSX = !useJSX;
    render();
  }

  function render() {
    root.render(
      React.createElement(GameDexApp, {
        pokemons: filteredPokemons,
        selectedPokemon,
        onSelect: handleSelect,
        onSearch: handleSearch,
        onFilter: handleFilter,
        useJSX,
        toggleJSX: toggleRenderMode,
        errorMessage,
        clearError,
        getStatColor,
      })
    );
  }

  fetchPokemons();
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", init);
}

export default function Page() {
  return (
    <div>
      <div id="root"></div>
    </div>
  );
}
