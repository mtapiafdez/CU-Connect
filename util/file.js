const fs = require("fs");

// Removes File From Path
const deleteFile = filePath => {
	fs.unlink(filePath, err => {
		if (err) {
			throw err;
		}
	});
};

exports.deleteFile = deleteFile;
