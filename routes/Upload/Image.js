const Image = (req, res) => {
	const IMG_URL = `${process.env.SERVER_ORIGIN}/uploads/${req.file.filename}`;
	res.json({ url: IMG_URL });
};

module.exports = Image;
