import 'reflect-metadata';
import {createConnection} from "typeorm";
import * as express from "express";
import {Request, Response} from "express";
import * as bodyParser from "body-parser";
import {Item} from "./entity/Item";
import {Email} from "./entity/Email";
import {getDomain, scrape} from "./scraper";
import {Website} from "./scraper";

let cron = require('node-cron');
const nodemailer = require('nodemailer');


createConnection({"type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "password",
    "database": "test",
    "synchronize": true,
    "logging": false,
    "entities": ["src/entity/**/*.ts"]
}).then(async connection => {
    const itemRepository = connection.getRepository(Item);
    const emailRepository = connection.getRepository(Email);

    const save = async (price: number, url: string, emailAddress: string, website: Website) => {

        let existingItem = await itemRepository.findOne({url: url});
        if (existingItem === undefined) {
            const item = new Item();
            item.price = price;
            item.url = url;
            item.website = website;
            existingItem = await itemRepository.save(item)
        }

        let existingEmail = await emailRepository.findOne({address: emailAddress}, {relations: ['items']});
        if (existingEmail === undefined) {
            const email = new Email();
            email.address = emailAddress;
            email.items = []
            existingEmail = email
        }

        if (existingEmail.items.includes(existingItem)) return
        existingEmail.items.push(existingItem)
        await emailRepository.save(existingEmail)
        
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
        const website: Website = getDomain(url)
        const firstPrice = await scrape(url, website)
        const items = await save(firstPrice, url, email, website)
        res.send(items);
    })


    cron.schedule('*/20 * * * * *', async () => {
        console.log("running cron")
        const itemSet = await itemRepository.find({ select: ["id", "url", "price", "website"], relations: ["emails"] });

        for (let i=0; i < itemSet.length; i++) {
            const item = itemSet[i];
            let itemUrl = item.url;
            let str = "click here"
            let result = str.link(itemUrl)

            let oldPrice = item.price;
            let domain = item.website;
            let newPrice = await scrape(itemUrl, domain);
            let userEmails = item.emails;

            if (newPrice < oldPrice) {
                console.log(`${item.url} is on sale`)
                let transport = nodemailer.createTransport({
                    service: process.env.NODEMAILER_SERVICE,
                    auth: {
                        user: process.env.NODEMAILER_USER,
                        pass: process.env.NODEMAILER_PASS
                    }
                });
                const message = {
                    from: process.env.NODEMAILER_USER,
                    to: userEmails,
                    subject: 'Zara item went on sale!',
                    html: '<h1> Your Zara item is on sale! </h1><p> The item you were tracking just went on sale! Click on the link to access it: '+result+' </p>'
                };

                transport.sendMail(message, function(err, result) {
                    if (err) {
                        console.log(`error: ${err}`)
                    } else {
                        console.log(`result: ${result}`);
                    }
                });

                console.log(`${item.url} email got sent`)

                await itemRepository.update(item.id, {price: newPrice});
            }
        }
    })

    app.listen(3000);
})




