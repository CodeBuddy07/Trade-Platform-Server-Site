import multer from "multer";

// Store the file in memory as a buffer (no disk storage)
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
