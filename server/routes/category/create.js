const express = require('express');
const router = express.Router();

router.post('/category/create', (req, res) =>
{
	const SesData = req.app.get('SessionData');
	const sid = req.session.id;
	if(!SesData[sid])
		return res.status(403).json({ Error: { Message: 'You need to login first' } });

	const catName = req.body.CategoryName;
	if(!catName)
		return res.status(400).json({ Error: { Message: 'Missing "CategoryName"' } });
	if(catName.length < 2)
		return res.status(400).json({ Error: { Message: '"CategoryName" must be at least 3 characters long' } });
	const Categories = req.app.get('CategorySQL');
	Categories.findOne({ where: { Name: catName } })
		.then(CatName =>
		{
			if(CatName)
				return res.status(400).json({ Error: { Message: `Category "${catName}" allready exists` } });
			Categories.create(
				{
					Name: catName,
					CreatedFrom: -1,
				})
				.then(() =>
				{
					return res.status(200).json({ Success: { Message: `Category "${catName}" successfully created"` } });
				});
		});
});

module.exports = router;