import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DATA_LENGTH } from "../enums";
import { Member } from "./member.entity";

@Entity('memberHistory')
export class MemberHistory {
    
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ length: DATA_LENGTH.DB_FIELD_MAX })
    field: string;

    @Column({ length: DATA_LENGTH.DB_VALUE_MAX })
    originalValue: string;

    @Column({ length: DATA_LENGTH.DB_VALUE_MAX })
    nextValue: string;

    @CreateDateColumn()
    timestamp: Date;

    // The member related to this change
    @ManyToOne(() => Member, member => member.history, { onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'member' })
    member: number;

    // The subject whom these changes has made by (admin user who made this change)
    @ManyToOne(() => Member, member => member.subjectToHistory, { onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'subject' })
    subject: number;

    @BeforeInsert()
    markTimestamp() {
        this.timestamp = new Date();
    }
}