const express = require('express');
const router = express.Router();

router.get('/admin/getAccounts', (req, res) =>
{
	const Accounts = req.app.get('AccountSQL');
	Accounts.findAll().then(Users => res.json(Users));
});

module.exports = router;