import {Entity, Column, PrimaryGeneratedColumn, ManyToMany} from "typeorm";
import {Item} from "./Item";

@Entity()
export class Email{

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    address: string;

    @ManyToMany(type => Item, item => item.emails)
    items: Item[];
}
