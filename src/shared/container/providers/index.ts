import {container} from 'tsyringe';

import {IDateProvider} from './dateProvider/IDateProvider';
import {DayJsDateProvider} from './dateProvider/implementations/DayJsDateProvider';
import {IMailProvider} from './mailProvider/IMailProvider';
import {EtherealMailProvider} from './mailProvider/implementations/EtherealMailProvider';

container.registerSingleton<IDateProvider>(
    'DayJsDateProvider',
    DayJsDateProvider,
);

container.registerSingleton<IMailProvider>(
    'EtherealMailProvider',
    EtherealMailProvider,
);
