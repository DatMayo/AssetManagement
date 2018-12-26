const express = require('express');
const router = express.Router();

router.post('/admin/accounts/create', (req, res) =>
{
	const userName = req.body.Username;
	const firstName = req.body.FirstName;
	const lastName = req.body.LastName;
	const mailAdress = req.body.MailAdress;
	const accountPassword = req.body.Password;

	if(!userName)
		return res.status(400).json({ Error: { Message: 'Missing "Username"' } });
	if(!firstName)
		return res.status(400).json({ Error: { Message: 'Missing "FirstName"' } });
	if(!lastName)
		return res.status(400).json({ Error: { Message: 'Missing "LirstName"' } });
	if(!mailAdress)
		return res.status(400).json({ Error: { Message: 'Missing "MailAdress"' } });
	if(!accountPassword)
		return res.status(400).json({ Error: { Message: 'Missing "Password"' } });
	if(!accountPassword.startsWith('$2y'))
		return res.status(400).json({ Error: { Message: 'Password must be encrypted with bcrypt' } });
	const Accounts = req.app.get('AccountSQL');
	const Security = req.app.get('SecuritySQL');
	Accounts.findOne({ where: { Username: userName } })
		.then(Acc =>
		{
			if(Acc)
				return res.status(400).json({ Error: { Message: `There is allready an account called "${userName}"` } });
			Accounts.create(
				{
					Username: userName,
					FirstName: firstName,
					LastName: lastName,
					Mail: mailAdress,
				})
				.then((qry) =>
				{
					Security.create(
						{
							UID: qry.ID,
							Password: accountPassword,
						})
						.then(() =>
						{
							return res.status(200).json({ Success: { Message: `Account "${userName}" successfully created"` } });
						});
				});
		});
});

module.exports = router;