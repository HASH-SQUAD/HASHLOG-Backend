const express = require('express');
const multer = require('multer');
const router = require('./Users');
const { validateToken } = require('../middlewares/AuthMiddleware');
const path = require('path');

const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, 'public/uploads');
		},
		filename(req, file, cb) {
			file.originalname = file.originalname
				.replace(/(.)/g, '')
				.toString('utf8');
			const ext = path
				.extname(file.originalname + Math.random(1, 1000))
				.toString('utf8');
			cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
		},
	}),
	// limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});

router.post('/upload', validateToken, upload.single('img'), (req, res) => {
	const IMG_URL = `${process.env.SERVER_ORIGIN}/uploads/${req.file.filename}`;
	res.json({ url: IMG_URL });
});

module.exports = router;
