import { env } from './config/env';
import app from './app';

const PORT = env.PORT;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
