import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';
import {Exclude} from 'class-transformer';

@Entity('users')
export class User {
    @Exclude()
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column()
    name: string;

    @Column({length: 100})
    username: string;

    @Column()
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column({name: 'is_active'})
    isActive: boolean;

    @Exclude()
    @Column({name: 'deleted_at_unix'})
    deletedAt: number;

    @Exclude()
    @Column({name: 'is_visible'})
    isVisible: boolean;

    @Column({name: 'is_admin'})
    isAdmin: boolean;

    @CreateDateColumn({
        name: 'created_at',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: string;

    @UpdateDateColumn({
        name: 'updated_at',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: string;

    @Exclude()
    @Column({name: 'company_id'})
    companyId: number | null;
}
