const express = require('express');
const router = express.Router();

router.post('/login', (req, res) =>
{
	const SesData = req.app.get('SessionData');
	const sid = req.session.id;
	if(SesData[sid])
		return res.status(403).json({ Error: { Message: 'You\'re allready loggen in' } });

	const userName = req.body.Username;
	const accountPassword = req.body.Password;
	if(!userName)
		return res.status(400).json({ Error: { Message: 'Missing "Username"' } });
	if(!accountPassword)
		return res.status(400).json({ Error: { Message: 'Missing "Password"' } });
	if(!accountPassword.startsWith('$2y'))
		return res.status(400).json({ Error: { Message: 'Password must be encrypted with bcrypt' } });
	const Accounts = req.app.get('AccountSQL');
	const Security = req.app.get('SecuritySQL');
	Accounts.findOne({ where: { Username: userName } })
		.then(Acc =>
		{
			if(!Acc)
				return res.status(400).json({ Error: { Message: `There is no account with the username "${userName}"` } });
			Security.findOne({ where: { UID: Acc.ID } })
				.then(Sec =>
				{
					if(!Sec)
						return res.status(400).json({ Error: { Message: `There was an error checking the password for "${userName}"` } });
					if(accountPassword != Sec.Password)
						return res.status(400).json({ Error: { Message: 'The given password is not corrent' } });
					SesData[sid] =
					{
						Account: Acc,
					};
					return res.status(200).json({ Success: { Message: 'Login successfull' } });
				});
		});
});

module.exports = router;