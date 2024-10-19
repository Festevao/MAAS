import mongoose from 'mongoose';
import axios, { AxiosHeaders } from 'axios';
import * as dotenv from 'dotenv';
import * as cron from 'node-cron';

dotenv.config({ path: __dirname + '/../../.env' });

console.log(JSON.stringify(process.env, null, 2));

const themeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  externalId: { type: String, required: true },
});

const Theme = mongoose.model('Theme', themeSchema);

const fetchThemesFromAPI = async () => {
  const response = await axios.get(
    `${process.env.MOVIE_DATABASE_URL!}/3/genre/movie/list?language=en`,
    {
      headers: new AxiosHeaders({
        Authorization: `Bearer ${process.env.MOVIE_DATABASE_TOKEN}`,
      }),
    },
  );

  return response.data.genres.map(({ id, name }) => ({
    name,
    externalId: id.toString(),
  }));
};

const updateThemes = async () => {
  try {
    const mongoUri = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;

    console.log(mongoUri);

    await mongoose.connect(mongoUri, { dbName: process.env.MONGODB_DB ?? 'test' });

    const existingThemes = await Theme.find();

    if (existingThemes.length === 0) {
      const themes = await fetchThemesFromAPI();
      await Theme.insertMany(themes);
    } else {
      const newThemes = await fetchThemesFromAPI();

      for (const newTheme of newThemes) {
        await Theme.updateOne(
          { externalId: newTheme.externalId },
          { $set: newTheme },
          { upsert: true }
        );
      }
    }
  } catch (error) {
    console.error('Error updating themes:', error);
  } finally {
    await mongoose.disconnect();
  }
};

updateThemes().catch(console.error);

cron.schedule('0 */2 * * *', () => {
  console.log('Starting update themes cron-job.');
  updateThemes().catch(console.error);
});
