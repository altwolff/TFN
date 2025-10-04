fetchFirst20();

async function fetchPokemon(id) {
    try {

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

        if (!response.ok) {
            throw new Error("Could not fetch data");
        }

        const data = await response.json();

        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        idCell.innerText = data.id;

        idCell.style.cursor = "pointer";
        idCell.addEventListener("click", () => {
            document.getElementById("search-name").value = capitalisedName;
            searchPokemon({ preventDefault: () => { } });
        });


        const nameCell = document.createElement("td");
        const capitalisedName = data.species.name.charAt(0).toUpperCase() + data.species.name.slice(1);
        nameCell.innerText = capitalisedName;

        nameCell.style.cursor = "pointer";
        nameCell.addEventListener("click", () => {
            document.getElementById("search-name").value = capitalisedName;
            searchPokemon({ preventDefault: () => { } });
        });

        const spriteCell = document.createElement("td");
        const img = document.createElement("img")
        img.src = data.sprites.front_default;
        img.alt = capitalisedName;

        
        img.style.cursor = "pointer";
        img.addEventListener("click", () => {
            document.getElementById("search-name").value = capitalisedName;
            searchPokemon({ preventDefault: () => { } });
        });


        spriteCell.appendChild(img);

        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(spriteCell);

        document.getElementById("pokemon-table-body").appendChild(row);

    }
    catch (error) {
        console.error(error);
        alert(error.message);
    }
}


async function fetchFirst20() {
    const progressBar = document.getElementById("progress-bar");
    const total = 20;

    for (let id = 1; id <= total; id++) {
        await fetchPokemon(id);
        const percent = Math.round((id / total) * 100);
        progressBar.style.width = percent + "%";
        progressBar.innerText = percent + "%";
    }
}


async function searchPokemon(event) {
    event.preventDefault();

    const searchName = document.getElementById("search-name").value.trim().toLowerCase();

    if (!searchName) {
        alert("Please enter a Pokémon.");
        return;
    }

    try {

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchName}`);

        if (!response.ok) {
            throw new Error("No such Pokémon.");
        }

        const data = await response.json();

        const detailsList = document.getElementById("details-list");
        detailsList.innerHTML = "";


        const spriteLine = document.createElement("li"); 
        const img = document.createElement("img");       
        img.src = data.sprites.front_default;            
        img.alt = data.name;                             
        spriteLine.appendChild(img);                     
        detailsList.appendChild(spriteLine);

        const idLine = document.createElement("li");
        idLine.innerText = "#" + data.id;
        detailsList.appendChild(idLine);

        const nameLine = document.createElement("li");
        nameLine.innerText = data.species.name.charAt(0).toUpperCase() + data.species.name.slice(1);
        detailsList.appendChild(nameLine);

        const hpLine = document.createElement("li");
        hpLine.innerText = "HP: " + data.stats[0].base_stat;
        detailsList.appendChild(hpLine);

        data.types.forEach(t => {
            const typeLine = document.createElement("li");
            typeLine.innerText = t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1);
            detailsList.appendChild(typeLine);
        });

        const heightLine = document.createElement("li");
        heightLine.innerText = "Height: " + (data.height / 10).toFixed(1) + "m";
        detailsList.appendChild(heightLine);

        const weightLine = document.createElement("li");
        weightLine.innerText = "Weight: " + (data.weight / 10).toFixed(1) + "kg";
        detailsList.appendChild(weightLine);

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
          
    } catch (error) {
        console.error(error); 
        alert(error.message);
    }
}