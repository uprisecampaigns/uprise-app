
export const urls = {
  base: process.env.CLIENT_BASE_URL,
  api: process.env.SERVER_BASE_URL,
  s3: 'https://s3-' + process.env.AWS_S3_REGION + '.amazonaws.com/' + process.env.AWS_S3_BUCKET_NAME
};

export const sentryDsn = process.env.SENTRY_PUBLIC_DSN;

export const gitCommit =  process.env.GIT_COMMIT;
