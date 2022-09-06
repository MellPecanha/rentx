import aws from 'aws-sdk';
import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, {Transporter} from 'nodemailer';
import {injectable} from 'tsyringe';

import {IMailProvider} from '../IMailProvider';

@injectable()
class SESMailProvider implements IMailProvider {
    private client: Transporter;

    constructor() {
        this.client = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: '2010-12-01',
                region: process.env.AWS_REGION,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
            }),
        });
    }

    async sendMail(
        to: string,
        subject: string,
        variables: any,
        path: string,
    ): Promise<void> {
        const templateFileContent = fs.readFileSync(path).toString('utf-8');

        const templateParse = handlebars.compile(templateFileContent);

        const templateHTML = templateParse(variables);

        await this.client.sendMail({
            to,
            from: 'Rentx <rentx.api@gmail.com>',
            subject,
            html: templateHTML,
        });
    }
}

export {SESMailProvider};
