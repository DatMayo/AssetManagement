const express = require('express');
const router = express.Router();

router.get('/category/getAll', (req, res) =>
{
	const SesData = req.app.get('SessionData');
	const sid = req.session.id;
	if(!SesData[sid])
		return res.status(403).json({ Error: { Message: 'You need to login first' } });

	const Categories = req.app.get('CategorySQL');
	Categories.findAll().then(CategoryResult => res.status(200).json(CategoryResult));
});

module.exports = router;