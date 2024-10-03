import dotenv from 'dotenv';

dotenv.config();

import app from '@free-market-api/app';
import logger from '@free-market-api/helpers/logger';

app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
});
