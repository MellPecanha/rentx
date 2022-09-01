import {hash} from 'bcryptjs';
import request from 'supertest';
import {Connection} from 'typeorm';
import {v4 as uuidV4} from 'uuid';

import {app} from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('create category controller', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const id = uuidV4();
        const password = await hash('admin', 8);

        await connection.query(
            `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
            VALUES ('${id}', 'admin', 'admin@rentx.com', '${password}', true, 'now()', 'XXXXXX')`,
        );
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should be able to create a new category', async () => {
        const resToken = await request(app)
            .post('/sessions')
            .send({email: 'admin@rentx.com', password: 'admin'});

        const {token} = resToken.body;

        const res = await request(app)
            .post('/categories')
            .send({
                name: 'category supertest',
                description: 'category supertest',
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(res.status).toBe(201);
    });

    it('should not be able to create a new category with name already exists', async () => {
        const resToken = await request(app)
            .post('/sessions')
            .send({email: 'admin@rentx.com', password: 'admin'});

        const {token} = resToken.body;

        const res = await request(app)
            .post('/categories')
            .send({
                name: 'category supertest',
                description: 'category supertest',
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(res.status).toBe(400);
    });
});
