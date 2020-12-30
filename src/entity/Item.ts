import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import {Email} from "./Email"

@Entity()
export class Item{

    @PrimaryGeneratedColumn()
    id: number;

    @Column("decimal")
    price: number;

    @Column("text")
    url: string;

    @ManyToMany(type => Email, email => email.items)
    @JoinTable()
    emails: Email[];
}
