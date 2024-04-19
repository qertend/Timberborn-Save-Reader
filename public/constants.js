const beaverFoodConsumption = 2.667
const beaverWaterConsumption = 2.13
const food = ["Berries", "Carrot", "GrilledPotato", "Bread", "GrilledChestnut", "GrilledSpadderdock", "CattailCracker", "MaplePastry"]

const production = {
    LargeWaterPump: {
        id: "water",
        amount: 15
    },
    WaterPump: {
        id: "water",
        amount: 3
    },
    Gristmill: {
        wheatFlour: {
            reliesOn: "Wheat",
            ingredients: {
                Wheat: 1,
                log: .1
            }
        },
        cattailFlour: {
            reliesOn: "Cattail",
            ingredients: {
                CattailRoot: 1,
                log: .1
            }
        }
    }
}