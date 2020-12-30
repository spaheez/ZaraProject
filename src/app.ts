import 'reflect-metadata';
import {createConnection} from "typeorm";
import * as express from "express";
import {Request, Response} from "express";
import * as bodyParser from  "body-parser";
import {Item} from "./entity/Item";
import {Email} from "./entity/Email";
import {scrapeZara} from "./scraper";


createConnection({"type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "password",
    "database": "test",
    "synchronize": true,
    "logging": false,
    "entities": ["src/entity/**/*.ts"]
}).then(connection => {
    const itemRepository = connection.getRepository(Item);
    const emailRepository = connection.getRepository(Email)

    const save = async (price: number, url: string, emailAddress: string) => {
        let item = new Item();
        item.price = price;
        item.url = url;
        let savedItem = await itemRepository.save(item)

        let email = new Email();
        email.address = emailAddress;
        email.items = [savedItem]

        await emailRepository.save(email)

        return getAllItems();
    };

    const getAllItems = () => itemRepository.find();

    const app = express();
    app.use(bodyParser.json());


    app.options('/', function (req: Request, res: Response) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.end();
    });


    app.post("/", async (req: Request, res: Response) => {
        console.log("received request")
        const email: string = req.body.email
        const url: string = req.body.item_url
        const firstPrice = await scrapeZara(url)
        const items = await save(firstPrice, url, email)
        res.send(items);


    //     console.log(firstPrice)
    //     let newprice = 100
    //     if (newprice < firstPrice) {
    //         console.log("it worked");
    //     }
    // })

    })

    app.listen(3000);
})




