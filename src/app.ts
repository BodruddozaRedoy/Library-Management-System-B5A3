import express, { Application, Request, Response } from 'express';
import { bookRoutes } from './app/controllers/book.controller';
import { borrowRoutes } from './app/controllers/borrow.controller';
// import { notesRoutes } from './app/controllers/notes.controller';
// import { usersRoutes } from './app/controllers/user.controller';

const app: Application = express();

app.use(express.json())



app.use("/api", bookRoutes)
app.use("/api", borrowRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Note App');
});


export default app;

// mvc - model  , controller