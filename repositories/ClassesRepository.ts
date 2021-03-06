import {MysqlDatabase} from "../database/MysqlDatabase";
import {ClassEditDTO} from "../data/classes/ClassEditDTO";
import {ClassDTO} from "../data/classes/ClassDTO";
import {IRepository} from "./IRepository";

export class ClassesRepository implements IRepository {
    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    /**
     * @param {ClassDTO} currentClass
     * @returns {Promise<number>}
     */
    public async add(currentClass: ClassDTO): Promise<number> {
        const result = await this.db.query(`
            INSERT INTO
                classes (
                    name,
                    age_group,
                    description
                )
            VALUES (?, ?, ?)
        `, [
            currentClass.name,
            currentClass.ageGroup,
            currentClass.description
        ]);

        return result.insertId;
    }

    /**
     * @param {number} id
     * @returns {Promise<ReportEditDTO|null>}
     */
    public async findById(id: number): Promise<ClassEditDTO|null> {
        const result = await this.db.query(`
            SELECT
                id,
                name,
                age_group AS ageGroup,
                description,
                is_archived AS isArchived
            FROM
                classes
            WHERE
                id = ?
        `, [id]);

        if (!result.length) {
            return null;
        }

        return new ClassEditDTO(result[0].id, result[0]);
    }

    /**
     * @param {ReportEditDTO} currentClass
     * @returns {Promise<boolean>}
     */
    public async update(currentClass: ClassEditDTO): Promise<boolean> {
        const result = await this.db.query(`
            UPDATE
                classes
            SET
                name = ?,
                age_group = ?,
                description = ?
            WHERE
                id = ?
        `, [
            currentClass.name,
            currentClass.ageGroup,
            currentClass.description,
            currentClass.id
        ]);

        return result.affectedRows === 1;
    }

    /**
     * @param {number} id
     * @returns {Promise<boolean>}
     */
    public async archive(id: number): Promise<boolean> {
        const isArchived: number = 1;

        const result = await this.db.query(`
            UPDATE
                classes
            SET
                is_archived = ?
            WHERE
                id = ?
        `, [isArchived, id]);

        return result.affectedRows === 1;
    }

    public async findCount(): Promise<number> {
        const isArchived: number = 0;

        const result = await this.db.query(`
            SELECT
                COUNT(*) AS count
            FROM
                classes
            WHERE
                is_archived = ?
        `, [isArchived]);

        return result[0].count;
    }

    /**
     * @return {Promise<ClassEditDTO[]>}
     */
    public async findAll(): Promise<ClassEditDTO[]> {
        const isArchived: number = 0;

        const result = await this.db.query(`
            SELECT
                c.id,
                c.name,
                c.age_group AS ageGroup,
                c.description
            FROM
                classes AS c
            WHERE
                c.is_archived = ?
        `, [isArchived]);

        return result.map((currentClass: any) => {
            return new ClassEditDTO(currentClass.id, currentClass);
        });
    }

    /**
     * *** USED FOR TEST PURPOSES ***
     * Deletes class from the database by given report ID
     *
     * @param {number} id
     * @return Promise<boolean>
     */
    public async deleteById(id: number): Promise<boolean> {
        const result = await this.db.query(`
            DELETE FROM
                classes
            WHERE
                id = ?
        `, [id]);

        return result.affectedRows === 1;
    }
}
