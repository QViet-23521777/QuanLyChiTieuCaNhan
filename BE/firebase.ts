import admin from 'firebase-admin';

// Chọn phương thức khởi tạo
let serviceAccount: any;

try {
  // Ưu tiên sử dụng environment variables nếu có
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    console.log('Using environment variables for Firebase config');
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
    };
  } else {
    // Fallback về file JSON
    console.log('Using JSON file for Firebase config');
    serviceAccount = require('../fir-af3f5-firebase-adminsdk-fbsvc-22ee7626ef.json');
  }
} catch (error) {
  console.error('Error loading Firebase service account:', error);
  throw new Error('Failed to load Firebase configuration');
}

// Khởi tạo Firebase Admin (chỉ một lần)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://fir-af3f5-default-rtdb.firebaseio.com",
      storageBucket: "fir-af3f5.firebasestorage.app"
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    throw error;
  }
}

// Export các services để sử dụng
export const auth = admin.auth();
export const firestore = admin.firestore();
export const database = admin.database();
export const storage = admin.storage();
export const messaging = admin.messaging(); // Thêm messaging nếu cần

export default admin;