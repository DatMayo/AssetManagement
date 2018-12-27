const express = require('express');
const router = express.Router();

router.post('/stat/create', (req, res) =>
{
	const SesData = req.app.get('SessionData');
	const sid = req.session.id;
	if(!SesData[sid])
		return res.status(403).json({ Error: { Message: 'You need to login first' } });

	const stateName = req.body.StateName;
	const categoryID = req.body.CategoryID;
	const nextState = req.body.NextState;
	if(!stateName)
		return res.status(400).json({ Error: { Message: 'Missing "StateName"' } });
	if(!categoryID)
		return res.status(400).json({ Error: { Message: 'Missing "CategoryID"' } });
	if(!parseInt(categoryID))
		return res.status(406).json({ Error: { Message: 'The given "CategoryID" is not a number' } });
	if(!nextState)
		return res.status(400).json({ Error: { Message: 'Missing "NextState"' } });
	try
	{
		JSON.parse(nextState);
	}
	catch (e)
	{
		return res.status(406).json({ Error: { Message: 'Wrong "NextState"-JSON format' } });
	}
	const Categories = req.app.get('CategorySQL');
	Categories.findOne({ where: { ID: categoryID } })
		.then(CatCheck =>
		{
			if(!CatCheck)
				return res.status(400).json({ Error: { Message: 'Invalid "CategoryID"' } });
			const State = req.app.get('StateSQL');
			State.findOne({ where: { Name: stateName } })
				.then(StateCheck =>
				{
					if(StateCheck)
						return res.status(400).json({ Error: { Message: `State "${stateName}" allready exists` } });
					State.create(
						{
							Name: stateName,
							CategoryID: categoryID,
							NextState: nextState,
						})
						.then(() =>
						{
							return res.status(200).json({ Success: { Message: `State "${stateName}" successfully created"` } });
						});
				});
		});
});

module.exports = router;