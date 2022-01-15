import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoConnect = async (app) => {
    try {
        await mongoose.connect(
            process.env.DB_CONNECTION,
            {useNewUrlParser: true, useUnifiedTopology: true},
            () => app.listen(8080),
        );

        console.log('connected to DB!');
    } catch (error) {
        console.log('error', error);
    }
};

export default mongoConnect;
