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
/**
 * The average daily yield of every food producing plant
 */
const plantYield  = {
    "Berries": 0.25,
    "Carrot": 0.75,
    "Sunflower": 0.4,
    //Processing required:
    "Potato": 0.17,
    "Wheat": 0.3,
    "Cattail": 0.38,
    "Spadderdock": 0.25,
    "Chestnut": 0.38,
    "Maple": 0.25
}

/**
 * The id is the end product, NOT the input(s) \
 * values are {t: processes finished per hour, o: output per process}
 */
const processingPerHour = {
    "GrilledPotato": {t: 1/.52, o: 4},
    "WheatFlour": {t: 1/.78, o: 1},
    "Bread": {t: 1/.42, o: 5},
    "CattailFlour": {t: 1/.66, o: 1},
    "CattailCrackers": {t: 2, o: 4},
    "GrilledSpadderdock": {t: 2.5, o: 3},
    "GrilledChestnut": {t: 1/.33, o: 2},
    "MaplePastry": {t: 1/.55, o: 3}
}