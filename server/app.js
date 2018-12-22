require('dotenv').load();

const express = require('express');
const helmet = require('helmet');
const Logger = require('./utils/Logger');
const path = require('path');
const session = require('express-session');
const sequelize = require('sequelize');

const app = express();
const connection = new sequelize(process.env.DBDB, process.env.DBUSER, process.env.DBPASS,
	{
		host: process.env.HOST,
		dialect: 'mysql',
		operatorsAliases: false,
		logging: false,
	});
const port = process.env.port || 3000;

const Accounts = connection.define('Accounts',
	{
		Username: sequelize.STRING,
		Password: sequelize.STRING,
		Mail: sequelize.STRING,
	});
const Category = connection.define('Category',
	{
		Name: sequelize.STRING,
		CreatedFrom: sequelize.INTEGER,
	});
const Item = connection.define('Item',
	{
		Name: sequelize.STRING,
		Amount: sequelize.INTEGER,
		Category: sequelize.STRING,
		CreatedFrom: sequelize.INTEGER,
		ExternalProductNumber: sequelize.STRING,
	});
const State = connection.define('State',
	{
		Name: sequelize.STRING,
		Category: sequelize.INTEGER,
		NextState: sequelize.INTEGER,
	});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set('AccountSQL', Accounts);
app.set('CategorySQL', Category);
app.set('ItemSQL', Item);
app.set('StateSQL', State);

app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: require('crypto').randomBytes(64).toString('hex'),
	resave: false,
	saveUninitialized: true,
	expires: new Date(Date.now() + (30 * 86400 * 1000)),
}));

connection.sync().then(() =>
{
	Logger.log(`Established SQL Connection to Server ${process.env.HOST}`);
	app.listen(port, () =>
	{
		Logger.log(`Server started on port ${port}`);
	});
}).catch(err =>
{
	Logger.log(`There was an error: ${err}`, 'error');
});