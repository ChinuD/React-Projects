const conf = {
    appWriteURL: String(import.meta.env.VITE_APPWRITE_URL),
    appWriteProject: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appWriteDatabase: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appWriteCollection: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appWriteBucket: String(import.meta.env.VITE_APPWRITE_BUCKET_ID)
}


export default conf