require('dotenv').load();

const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const Logger = require('./utils/Logger');
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

// #region Table-Structure
const Accounts = connection.define('Accounts',
	{
		ID:
		{
			type: sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		Username: sequelize.STRING,
		FirstName: sequelize.STRING,
		LastName: sequelize.STRING,
		Mail: sequelize.STRING,
	});
const Asset = connection.define('Asset',
	{
		Name: sequelize.STRING,
		Amount: sequelize.INTEGER,
		Category: sequelize.STRING,
		CreatedFrom: sequelize.INTEGER,
		ExternalProductNumber: sequelize.STRING,
		MasterItem: sequelize.INTEGER,
	});
const Category = connection.define('Category',
	{
		ID:
		{
			type: sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		Name: sequelize.STRING,
		CreatedFrom: sequelize.INTEGER,
	});
const Security = connection.define('Security',
	{
		ID:
		{
			type: sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		UID: sequelize.INTEGER,
		Password: sequelize.STRING,
	});
const State = connection.define('State',
	{
		ID:
		{
			type: sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		Name: sequelize.STRING,
		CategoryID: sequelize.INTEGER,
		NextState: sequelize.INTEGER,
	});
// #endregion

let SesData = null;
SesData = { };

app.set('AccountSQL', Accounts);
app.set('AssetSQL', Asset);
app.set('CategorySQL', Category);
app.set('SecuritySQL', Security);
app.set('StateSQL', State);
app.set('SessionData', SesData);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
	secret: require('crypto').randomBytes(64).toString('hex'),
	resave: false,
	saveUninitialized: true,
	expires: new Date(Date.now() + (30 * 86400 * 1000)),
}));

app.use(require('./routes/admin/getAccounts'));
app.use(require('./routes/admin/accounts/create'));

app.use(require('./routes/category/create'));
app.use(require('./routes/category/getAll'));

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