import mongoose from 'mongoose';

const DB_URI = process.env.DATABASE!.replace(
  '<password>',
  process.env.DATABASE_PASSWORD!
);

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

export async function mongoConnect() {
  await mongoose.connect(DB_URI);
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
}
