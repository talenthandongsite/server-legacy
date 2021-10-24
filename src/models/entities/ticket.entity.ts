import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Member } from './member.entity';

@Entity('ticket')
export class Ticket {
    @PrimaryGeneratedColumn('uuid', { comment: '티켓 ID' })
    id: number;

    @ManyToOne(() => Member, member => member.issuedTickets, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'issuer' })
    issuer: Member;

    @OneToOne(() => Member, member => member.ticket)
    issuedTo: Member;

    @CreateDateColumn()
    createDatetime;

    @UpdateDateColumn()
    registeredDatetime;

    @BeforeInsert()
    beforeInsert() {
        this.createDatetime = new Date();
    }

    @BeforeUpdate()
    beforeUpdate() {
        this.registeredDatetime = new Date();
    }
}