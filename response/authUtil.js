const authUtil = {
	successTrue: (status, message, data) => {
		return {
			status: status,
			success: true,
			message: message,
			data: data,
		};
	},
	successFalse: (status, message) => {
		return {
			status: status,
			success: false,
			message: message,
		};
	},
	jwtSent: (status, message, accessToken, refreshToken) => {
		return {
			status: status,
			success: true,
			message: message,
			accessToken: accessToken,
			refreshToken: refreshToken,
		};
	},
};

module.exports = authUtil;
