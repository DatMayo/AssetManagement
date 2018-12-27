const express = require('express');
const router = express.Router();

router.get('/state/getAll', (req, res) =>
{
	const SesData = req.app.get('SessionData');
	const sid = req.session.id;
	if(!SesData[sid])
		return res.status(403).json({ Error: { Message: 'You need to login first' } });

	const States = req.app.get('StateSQL');
	States.findAll().then(StateResult => res.status(200).json(StateResult));
});

module.exports = router;