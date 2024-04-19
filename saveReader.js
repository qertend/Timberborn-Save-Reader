const streamZip = require("node-stream-zip")

//3 different storage types are used so we have 3 different arrays woohoo
const storageEntities = ["SmallPile", "LargePile", "UndergroundPile", "SmallIndustrialPile", "LargeIndustrialPile", "SmallWarehouse", "MediumWarehouse", "LargeWarehouse", "SmallTank", "MediumTank", "LargeTank"]
const manufactoryEntities = ["DistrictGate", "HaulingPost", "Builders'Hut", "DistributionPost", "WaterPump", "LargeWaterPump", "DeepWaterPump", "WaterDump", "IrrigationTower", "MechanicalWaterPump", "DeepMechanicalWaterPump", "Farmhouse", "AquaticFarmhouse", "Grill", "Gristmill", "Bakery", "Beehive", "LumberMill", "GearWorkshop", "PaperMill", "PrintingPress", "WoodWorkshop", "Smelter", "Mine", "EfficientMine", "Numbercruncher", "Refinery", "BotPartFactory", "BotAssembler", "ChargingStation", "ControlTower"]
const simpleWorkplaceEntities = ["GathererFlag", "LumberjackFlag","DistrictCenter", "TappersShack", "ScavengerFlag"]

//e.Components.PausableBuilding.Paused = true if the building is paused
//WARNING if the building is active e.Components.PausableBuilding is UNDEFINED
//and will THROW AN ERROR if you try to read it's properties

const cropEntities = ["Carrot", "Sunflower", "Potato", "Wheat", "Cattail", "Spadderdock"]

const food = ["Berries", "Carrot", "GrilledPotato", "Bread", "GrilledChestnut", "GrilledSpadderdock", "CattailCracker", "MaplePastry"]
const ingredient = ["CattailFlour", "CattailRoot", "Chestnut", "Potato", "Spadderdock", "Wheat", "WheatFlour", "MapleSyrup"]
const material = ["Book", "BotChassis", "BotHead", "BotLimb", "Explosive", "Gear", "Paper", "PineResin", "Dandelion", "PunchCard", "Plank", "TreatedPlank", "ScrapMetal", "MetalBlock", "Dirt", "Explosives", "Antidote", "Biofuel","Catalyst", "Extract", "Badwater"]

//TODO add fluids to arrays

const storageCapacity = {
    SmallTank: 30,
    MediumTank: 300,
    LargeTank: 1200,
    SmallWarehouse: 30,
    MediumWarehouse: 200,
    LargeWarehouse: 1200,
    SmallPile: 20,
    LargePile: 180,
    UndergroundPile: 1800,
    SmallIndustrialPile: 20,
    LargeIndustrialPile: 180
}

/**
 * Unzips and parses Timberborn saves
 * 
 * it's an async function; sorry not sorry
 * @param {*} zipName The .timber file to parse
 * @param {*} callbackFunction
 */
module.exports = (zipName, callbackFunction) => {
    const zip = new streamZip({
        file: zipName,
        storeEntries: true
    })
    
    zip.on("ready", () => {
        /**
         * Because the production rate is not in the save files, \
         * we have to identify the producing entity's type \
         * and manually add the prduction rate
         * 
         * @param {*} e The item generating entity
         * 
         * TODO add more producers
         */
        function addBuilding(e) {
            let temp = e.Template.split(".")[0]
            if (!result.buildings[temp]) result.buildings[temp] = 1
            else result.buildings[temp]++
        }

        function saveItem(item) {
            try {
                //Good name for a finished building
                let id = item.Good.Id
                //Good amount for a finished building 
                let amount = item.Amount


                if (id === "Water") {
                    result.water += amount
                }

                else if (id === "Log") {
                    result.log += amount
                }

                else if (food.includes(id)) {
                    if (!result.food[id]) result.food[id] = amount
                    else result.food[id] += amount
                }

                else if (ingredient.includes(id)) {
                    if (!result.ingredient[id]) result.ingredient[id] = amount
                    else result.ingredient[id] += amount
                }

                else if (material.includes(id)) {
                    if (!result.resource[id]) result.resource[id] = amount
                    else result.resource[id] += amount
                }
                else if (!result.noCategoryYet.includes(id)) result.noCategoryYet.push(id)
            }
            catch (error) {
                console.error("Error while trying to add item to data object");
                console.error(item);
                console.error(error);
            }
        }

        function checkForItems(e, invType) {
            if (invType !== "Inventory:Stockpile") addBuilding(e)
            else {
                if (!result.storage[e.Components.SingleGoodAllower.AllowedGood.Id]) result.storage[e.Components.SingleGoodAllower.AllowedGood.Id] = storageCapacity[e.Template.split(".")[0]]
                else result.storage[e.Components.SingleGoodAllower.AllowedGood.Id] += storageCapacity[e.Template.split(".")[0]]
            }

            if (e.Components[invType] === undefined) {
                console.error("StorageEntity: " + e.Template)
                if (e.Components.SingleGoodAllower) console.error("Storing " + e.Components.SingleGoodAllower.AllowedGood.Id);
                console.error(invType + " is undefined")
                console.error(e)
                result.errors.push(e)
            }
            else for (i of e.Components[invType].Storage.Goods) saveItem(i)
        }
    
        // Read a file in memory
        let world = JSON.parse(zip.entryDataSync('world.json').toString('utf8'))
        let metadata = JSON.parse(zip.entryDataSync('save_metadata.json').toString('utf8'))
        //console.log(world);
        //The timestamp is in MM/DD/YYYY format so we need to switch it to DD/MM/YYYY
        let timeStamp = metadata.Timestamp.split("/");
        timeStamp = timeStamp[1] + "-" + timeStamp[0] + "-" + timeStamp[2]
        const result = {
            time: {
                save: timeStamp,
                cycle: metadata.Cycle,
                day: metadata.Day
            },
            beavers: {
                adults: 0,
                children: 0
            },
            log: 0,
            water: 0,
            food: {},
            ingredient: {},
            resource: {},
            crops: {},
            storage: {},
            buildings: {},
            workHours: Math.round(24 * world.Singletons.WorkingHoursManager.WorkedPartOfDay),
            noCategoryYet: [],
            errors: []
        }

        Types = []

        for (e of world.Entities) {
            const temp = e.Template.split(".")[0]
            
            //Count beavers
            if (temp === "BeaverAdult") result.beavers.adults++
            else if (temp === "BeaverChild") result.beavers.children++
    
            //Goods in storage buildings
            else if (storageEntities.includes(temp) && e.Components.Constructible.Finished) {
                checkForItems(e, "Inventory:Stockpile")
            }
    
            //Goods in manufactories
            else if (manufactoryEntities.includes(temp) && e.Components.Constructible.Finished) {
                checkForItems(e, "Inventory:Manufactory")
            }
    
            //Goods in simple workplaces
            else if (simpleWorkplaceEntities.includes(temp) && e.Components.Constructible.Finished) {
                checkForItems(e, "Inventory:SimpleOutputInventory")
            }

            //crops
            else if (cropEntities.includes(temp)) {
                //TODO look into crop objects for more useful data
                //PlantingService.PlantingMap could be used to count player-planted trees and such
                if (!result.crops[temp]) result.crops[temp] = 1
                else result.crops[temp]++
            }
    
            //for debug only
            //if (temp == "LargeWaterPump.Folktails") console.log(e.Components);
            
            /*
            if (!Types.includes(temp)) {
                Types.push(temp)
            }
            */
            
        }

        //console.log(Types);
        
        // Do not forget to close the file once you're done
        zip.close()
        callbackFunction(result)
    })
    
} 

/*
https://timberborn.fandom.com/wiki/Game_Save_File#Variables
world Object
    GameVersion
        0..17 (inclusive)
    Timestamp = last played date and time e.g. "2024-04-03 15:20:07"
    Singletons
        MapSize
            Size
                X
                Y
        CameraComponent
            CameraState
                Target
                ZoomLevel
                HorizontalAngle
                VerticalAngle
        TerrainMap
            Heights
                Array 
                    every block's height? (too much to process)
        DayNightCycle
            DayNumber
            DayProgress
        TemperateWeatherDurationService
        DroughtWeather
        BadtideWeather
        HazardousWeatherHistory
        HazardousWeatherService
        WeatherService
        NotificationSaver
        FactionService
        CameraStateRestorer
        WaterMap
        WaterEvaporationMap
        ContaminationMap
        SoilMoistureSimulator
        SoilContaminationSimulator
        BeaverNameService
        NeedModificationService
        PlantingService
        ScienceService
        BuildingUnlockingService
        TreeCuttingArea
        ManualMigrationDistrictSetter
        BotPopulation
        WorkplaceUnlockingService
        BotNameService
        WindService
        DistrictNameService
        MapNameService
        DateSaltService
        EffectProbabilityService
        GoodRecoveryRateService
        WorkingHoursManager
        TutorialService
        WellbeingHighscore
    Entities
        every entity ever with numbers as IDs (the ids are incremental from 0)
*/