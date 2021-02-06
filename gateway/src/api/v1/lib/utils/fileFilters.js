import * as path from "path";

// docs
const acceptableMimeTypesDocs = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
const acceptableExtensionsDocs = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];

export function fileFilterDoc(req, file, cb) {
  if (
    acceptableMimeTypesDocs.includes(file.mimetype) ||
    acceptableExtensionsDocs.includes(path.extname(file.originalname))
  ) {
    cb(null, true);
  } else {
    return cb(null, false);
  }
}

// images
const acceptableMimeTypesImages = ["image/png", "image/jpg"];
const acceptableExtensionsImages = [".png", ".jpg", ".jpeg"];

export function fileFilterImage(req, file, cb) {
  if (
    acceptableMimeTypesImages.includes(file.mimetype) ||
    acceptableExtensionsImages.includes(path.extname(file.originalname))
  ) {
    cb(null, true);
  } else {
    return cb(null, false);
  }
}

// videos
const acceptableMimeTypesVideos = [
  "video/mp4",
  "video/quicktime",
  "video/mpeg",
];
const acceptableExtensionsVideos = [".mp4", ".mov", ".mpeg"];

export function fileFilterVideo(req, file, cb) {
  if (
    acceptableMimeTypesVideos.includes(file.mimetype) ||
    acceptableExtensionsVideos.includes(path.extname(file.originalname))
  ) {
    cb(null, true);
  } else {
    return cb(null, false);
  }
}

// audio
const acceptableMimeTypesAudio = ["audio/ogg", "audio/wav", "audio/mpeg"];
const acceptableExtensionsAudio = [".ogg", ".wav", ".mp3"];

export function fileFilterAudio(req, file, cb) {
  if (
    acceptableMimeTypesAudio.includes(file.mimetype) ||
    acceptableExtensionsAudio.includes(path.extname(file.originalname))
  ) {
    cb(null, true);
  } else {
    return cb(null, false);
  }
}
