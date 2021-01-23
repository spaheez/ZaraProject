import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import {Email} from "./Email"
import {Website} from "../scraper";

@Entity()
export class Item{

    @PrimaryGeneratedColumn()
    id: number;

    @Column("integer")
    price: number;

    @Column("text")
    url: string;

    @Column({
        type: "enum",
        enum: Website
    })
    website: Website;

    @ManyToMany(type => Email, email => email.items)
    @JoinTable()
    emails: Email[];
}
