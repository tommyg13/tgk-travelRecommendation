const searchBtn = document.querySelector('#search-recommendations');
const clearBtn = document.querySelector('#clear-recommendations');
const searchForm = document.querySelector('#search-recommendations-form');
const searchTerm  = searchForm.querySelector("input");
const resultDiv = document.querySelector("#results");

function normalizeKeyword(keyword) {
    return keyword.toLowerCase().trim();
}

function checkKeywordVariations(keyword) {
    const normalizedKeyword = normalizeKeyword(keyword);
    const variations = [
        'beach',
        'beaches',
        'beachy',
        'temple',
        'temples',
        'country',
        'countries'
    ];

    return variations.includes(normalizedKeyword);
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTermValue = searchTerm?.value?.trim?.();

    if (searchTermValue && checkKeywordVariations(searchTermValue)) {
        fetch("travel_recommendation_api.json")
            .then(res => res.json())
            .then(data => {
                displayRecommendations(data,searchTermValue)
                
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } else {
        console.log("Invalid or empty search term.");
    }
});


function displayRecommendations(data, term) {
    let options = [];
    if (term.includes("bea")) {
        options = data.beaches;
    } else if (term.includes("countr")) {
        options = getCountriesData(data.countries);
    } else {
        options = data.temples;
    }

    const fragment = document.createDocumentFragment(); 

    const currentTimeDiv = document.createElement("div");
    currentTimeDiv.textContent = "Current time in New York: " + getCurrentTime();

    for (let option of options) {
        const resItem = document.createElement("div");
        const resItemImg = document.createElement("img");
        const resInner = document.createElement("div");
        const resItemName = document.createElement("h3");
        const resItemDesc = document.createElement("p");
        const resItemDate = document.createElement("p");
        const resItemBtn = document.createElement("button");
        
        resItem.classList.add("recommendation-item");

        resItemImg.setAttribute("src", option.imageUrl);
        resItemImg.setAttribute("alt", option.name);
        resItem.appendChild(resItemImg);
        resItemName.textContent = option.name;
        resItemDesc.textContent = option.description;
        resItemBtn.textContent = "Visit";
        resItemDate.textContent = currentTimeDiv.textContent;

        resInner.classList.add("recommendation-item-inner");

        resInner.appendChild(resItemDate);
        resInner.appendChild(resItemName);
        resInner.appendChild(resItemDesc);
        resInner.appendChild(resItemBtn);
        
        resItem.appendChild(resInner);
        
        fragment.appendChild(resItem);
    }

    resultDiv.innerHTML = ''; 
    resultDiv.appendChild(fragment); 
}


function getCurrentTime() {
    const options = { timeZone: 'America/New_York', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date().toLocaleTimeString('en-US', options);
}

function getCountriesData(countries) {
    const res = [];

    for(let country of countries){
        for(let city of country.cities) {
            res.push({
                name:city.name + " , "+country.name,
                ...city
            })
        }
    }

    return res;
}

clearBtn.addEventListener("click",function(){
    resultDiv.innerHTML = '';
    searchTerm.value = "";
})
