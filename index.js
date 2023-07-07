const express = require('express');
const axios = require('axios');

const token = "GxSAww8zTJ2qJ+h+zCmy7w=="

const app = express();
const port = 3001;

app.listen(port, () => console.log(`Server listening on port ${port}!`));
app.use(express.static('public'));
app.get("/BusArrivalv2", async (req, res) => {

    const tabSection = {
        "Go": {
            "76089": { //Holy Trinty Church > Tampines Interchange
                "292": {},
                "20": {},
                "34": {}
            },
            "75009": {
                "291": {}
            }
        },
        "Return": {
            "75169": { //Opp Blk 853 > Tampines Interchange
                "291": {}
            },
            "75009": {
                "292": {},
                "20": {}
            }
        }
    }
    
    const way = req.query.way;
    if (!tabSection[way]) return res.sendStatus(400);
    for (const code in tabSection[way]) {
        const busserv = Object.keys(tabSection[way][code])
        for (const key in busserv) {
            const busno = busserv[key];

            service = await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${code}&ServiceNo=${busno}`, {
                headers: {
                    "AccountKey": token
                }
            })
            tabSection[way][code][busno] = service.data.Services[0];
            // console.log(tabSection);
        }
    }

    setTimeout(() => {
        res.send(tabSection)
    }, 50);
})