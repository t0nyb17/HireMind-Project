This folder must contain the face-api.js model files so that the app can load them from `/models/*`.

Download the Tiny Face Detector, Face Landmark, and Face Recognition models from the official face-api.js repo:
- tiny_face_detector_model-weights_manifest.json
- tiny_face_detector_model-shard1
- face_landmark_68_model-weights_manifest.json
- face_landmark_68_model-shard1
- face_recognition_model-weights_manifest.json
- face_recognition_model-shard1

Place all of those files directly in this `public/models` directory.

At runtime, face-api.js will request URLs like:
- /models/tiny_face_detector_model-weights_manifest.json
- /models/face_landmark_68_model-weights_manifest.json
- /models/face_recognition_model-weights_manifest.json

If you still see 404 errors, double-check:
- File names exactly match the expected ones (including case).
- Files are not nested inside another folder under `models`.
- The dev server has been restarted after adding the files.

