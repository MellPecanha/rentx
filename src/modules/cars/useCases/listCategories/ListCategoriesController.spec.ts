import {hash} from 'bcryptjs';
import request from 'supertest';
import {Connection} from 'typeorm';
import {v4 as uuidV4} from 'uuid';

import {app} from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('list categories controller', () => {
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

    it('should be able to list all categories', async () => {
        const resToken = await request(app)
            .post('/sessions')
            .send({email: 'admin@rentx.com', password: 'admin'});

        const {token} = resToken.body;

        await request(app)
            .post('/categories')
            .send({
                name: 'category supertest',
                description: 'category supertest',
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        const res = await request(app).get('/categories');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0].name).toEqual('category supertest');
    });
});
