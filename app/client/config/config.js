export const urls = {
  base: process.env.CLIENT_BASE_URL,
  api: process.env.SERVER_BASE_URL,
  s3: `https://${process.env.AWS_S3_ENDPOINT}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}`,
};

export const sentryDsn = process.env.SENTRY_PUBLIC_DSN;

export const googleUA = process.env.GOOGLE_UA_ID;

export const gitCommit = process.env.GIT_COMMIT;

export const defaultSearchRadiusDistance = process.env.DEFAULT_SEARCH_RADIUS_DISTANCE;
