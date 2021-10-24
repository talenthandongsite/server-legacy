import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { DATA_LENGTH } from '../enums';
import { MemberHistory } from './member-history.entity';
import { Ticket } from './ticket.entity';

@Entity('member')
export class Member {
    @PrimaryGeneratedColumn('increment', { comment: '마스터 ID' })
    id: number;

    @Column({ length: DATA_LENGTH.KAKAO_AUTH_ACCESS_TOKEN, comment: '카카오톡 인증 토큰', nullable: true })
    kakaoAuthAccessToken: string;

    @Column({ length: DATA_LENGTH.STUDENT_ID, comment: '풀 학번 (8자리)', nullable: false })
    studentId: string;

    @Column({ length: DATA_LENGTH.NAME, comment: '이름', nullable: true  })
    name: string;

    @Column({ length: DATA_LENGTH.REGISTER_STATE, comment: '학적', nullable: true })
    registerState: string;

    @Column({ length: DATA_LENGTH.NICKNAME, comment: '카카오톡 대화명', nullable: true  })
    nickname: string;

    @Column({ length: DATA_LENGTH.EMAIL, comment: '이메일', nullable: true  })
    email: string;

    @Column({ length: DATA_LENGTH.ENUM, comment: '접근 권한', nullable: false })
    accessLevel: string;

    @Column({ length: DATA_LENGTH.ENUM, comment: '멤버 상태', nullable: false  })
    status: string;

    @Column({ length: DATA_LENGTH.URL, comment: '인터뷰 영상 링크', nullable: true })
    interview: string;

    @Column({ length: DATA_LENGTH.MEMO, comment: '어드민용 비고', nullable: true })
    memo: string;

    @OneToOne(() => Ticket, ticket => ticket.issuedTo, { cascade: [ 'insert', 'update'] })
    @JoinColumn({ name: 'ticket' })
    ticket: Ticket;

    @OneToMany(() => Ticket, ticket => ticket.issuer, { cascade: [ 'insert', 'update' ] })
    issuedTickets: Ticket[];

    @OneToMany(() => MemberHistory, memberHistory => memberHistory.member, { cascade: [ 'insert' ] })
    history: MemberHistory[];

    @OneToMany(() => MemberHistory, memberHistory => memberHistory.subject, { cascade: [ 'insert' ] })
    subjectToHistory: MemberHistory[];

    @CreateDateColumn()
    createDatetime: Date;

    @UpdateDateColumn()
    updateDatetime: Date;

    @Column({ type: 'datetime', nullable: true })
    lastAccessDatetime: Date;

    @BeforeInsert()
    beforeInsert() {
        this.createDatetime = new Date();
        this.updateDatetime = this.createDatetime;
    }

    @BeforeUpdate()
    beforeUpdate() {
        this.updateDatetime = new Date();
    }
}