const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/public')));

//Port Setting
const PORT = process.env.PORT;

//API Test
app.get('/', (req, res) => {
	res.send('API Running');
});

//DataBase
const db = require('./models');

//DataBase Router Call
const usersRouter = require('./routes/Users');
app.use('/auth', usersRouter);
const postRouter = require('./routes/Post');
app.use('/post', postRouter);
const commentRouter = require('./routes/Comment');
app.use('/comment', commentRouter);
const ImageUpload = require('./routes/ImgUpload');
app.use('/img', ImageUpload);

//Port
db.sequelize.sync().then(() => {
	app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
