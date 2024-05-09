const express = require('express');
const multer = require('multer');
const path = require('path');
const router = require('../User');
const { validateToken } = require('../../middlewares/AuthMiddleware.js');

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
			cb(null, path.basename(file.originalname, ext) + Date.now() + ext + '.jpg');
		},
	}),
	// limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});

const Image = require('./Image');
router.post('/image', validateToken, upload.single('img'), Image);

module.exports = router;
