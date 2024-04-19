const saveSelector = document.getElementById("saveSelector")
let curSave = ""
let data = {}
let debugMode = false

/**
 * browser might remember the checkbox state when the page was last opened
 * so the checkbox might be ticked while debugMode is false
 * causing a de-sync between code and UI
 * so we force it to be equal to debugMode value
*/
get("debugCheckbox").checked = debugMode

/**
 * Shorthand for document.getElementById()
 * @param {string} id the HTML element ID
 * @returns {HTMLElement}
 */
function get(id) {
    return document.getElementById(id)
}

function formatFloat(num) {
    return num.toFixed(2)
}

function calculateStockPile() {
    const eff = get("efficiencyPercent").value / 100
    const totalBeavers = data.beavers.adults + data.beavers.children;
    let totalFood = 0
    let totalFoodStorage = 0
    //count all food
    for (key of Object.keys(data.food)) totalFood += data.food[key]
    //count all food storage
    for (key of Object.keys(data.storage)) {
        if (!food.includes(key)) continue
        totalFoodStorage += data.storage[key]
    }

    //total food supply & production
    get("foodTotal").innerHTML = totalFood
    get("foodMax").innerHTML = totalFoodStorage
    get("foodSupply").innerHTML = formatFloat((totalFood / beaverFoodConsumption) / totalBeavers)
    get("foodProduction").innerHTML = "___"
    get("foodProduction").title = "it's complicated"

    //total water supply & production
    get("waterTotal").innerHTML = data.water
    get("waterMax").innerHTML = data.storage.Water
    get("waterSupply").innerHTML = formatFloat((data.water / beaverWaterConsumption) / totalBeavers)
    /*
    let waterProduced = data.production.water * eff * data.workHours - beaverWaterConsumption * totalBeavers;
    get("waterProduction").innerHTML = formatFloat(waterProduced)
    get("waterProduction").title = formatFloat(data.production.water * eff * data.workHours) + " produced / " + formatFloat(beaverWaterConsumption * totalBeavers) + " consumed"
    decreasing stockpile warning
    if (waterProduced < 0) get("waterSummary").style.backgroundColor = "red"
    else get("waterSummary").style.backgroundColor = ""
    */
}

function fetchData() {
    let queryString = "?save=" + curSave
    if (debugMode) queryString += "&sendErrors=true"
    fetch("/data" + queryString).then((res) => {
        res.json().then((body) => {
            data = body
            displayData()
        })
    })
}


/**
 * displays the current the contents of data{} \
 * called by fetchData()
 */
function displayData() {

    //save time and in-game time
    get("saveTime").innerHTML = "Last saved " + data.time.save
        .replace("T", " ")
        .split(".")[0]
    get("gameTime").innerHTML = "cycle " + data.time.cycle + ", day " + data.time.day

    //beaver population
    get("adultBeavers").innerHTML = data.beavers.adults
    get("childBeavers").innerHTML = data.beavers.children
    get("beaverTotal").innerHTML = data.beavers.adults + data.beavers.children

    //food and water summary
    calculateStockPile();

    //List all production buildings
    {
        let buildingList = get("buildingList")
        //remove old children
        while (buildingList.firstChild) buildingList.removeChild(buildingList.lastChild)
        //replace with new children
        for (let building in data.buildings) {
            let row = document.createElement("tr")
            let num = document.createElement("td")
            let name = document.createElement("td")
            name.innerHTML = building
            num.innerHTML = data.buildings[building]
            row.appendChild(num)
            row.appendChild(name)
            buildingList.appendChild(row)
        }
    }

    //Food storage breakdown by food
    {
        foodStorageList = get("foodStorageBreakdown")
        //reset innerHTML, except for the headers
        //it's weird but hey, it works
        while (foodStorageList.lastChild.localName !== "tbody") foodStorageList.removeChild(foodStorageList.lastChild)

        //sort by amount stored
        let foodOrderedList = []
        for (let key of Object.keys(data.food)) foodOrderedList.push({ k: key, v: data.food[key] })
        foodOrderedList.sort((a, b) => { a.v - b.v })
        //add sorted list to HTML table
        for (let ob of foodOrderedList) {
            if (!food.includes(ob.k)) continue
            let r = document.createElement("tr")
            let filled = document.createElement("td")
            let total = document.createElement("td")
            let name = document.createElement("td")
            let slash = document.createElement("td")
            filled.innerHTML = ob.v
            total.innerHTML = data.storage[ob.k] ? data.storage[ob.k] : 0
            name.innerHTML = ob.k
            slash.innerHTML = "/"
            r.appendChild(filled)
            r.appendChild(slash)
            r.appendChild(total)
            r.appendChild(name)
            foodStorageList.appendChild(r)
        }
    }

    //List all crops
    {
        let cropList = get("cropBreakdown")
        let cropOrdered = []
        for (let crop of Object.keys(data.crops)) {
            cropOrdered.push({ k: crop, v: data.crops[crop] })
        }
        cropOrdered.sort((a, b) => {return  b.v - a.v})
    
        //remove old children
        while (cropList.firstChild) cropList.removeChild(cropList.firstChild)
        //fill table
        for (let crop of cropOrdered) {
            let r = document.createElement("tr")
            let total = document.createElement("td")
            let name = document.createElement("td")
            total.innerHTML = crop.v
            name.innerHTML = crop.k
            r.appendChild(total)
            r.appendChild(name)
            cropList.appendChild(r)
        }
    }

    /**
     * Calculate raw food processing needs
     * and display min needed buildings
     * to process the raw ingredients
     *
     * TODO
     * Wheat
     * Spadderdock
     * Potato
     * Maple
     * Cattail
     * Chestnut
     */
    {
        
    }
}

/**
 * 
 */
fetch("/saves").then((res) => {
    res.json().then((body) => {
        for (save of body) {
            e = document.createElement("option")
            e.text = save
            saveSelector.appendChild(e)
        }
        curSave = saveSelector.value
        fetchData()
    })
})

saveSelector.addEventListener("change", (event) => {
    curSave = saveSelector.value
    fetchData()
})
get("debugCheckbox").addEventListener("change", e => {
    debugMode = e.target.checked
})

get("efficiencyPercent").addEventListener("change", e => {
    calculateStockPile()
})