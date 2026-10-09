# Bird Index

A React, Vite, and TypeScript prototype for a bird photography archive.

## Run locally

```sh
npm ci
npm run dev
```

Production build and lint checks:

```sh
npm run build
npm run lint
```

## Deploy with AWS Amplify Hosting

The repository includes [`amplify.yml`](amplify.yml), which installs from the lockfile, builds the Vite app, and publishes the `dist` directory.

1. Push this repository to GitHub (or another Git provider supported by Amplify).
2. In the AWS Amplify console, choose **Create new app** and **Host web app**.
3. Connect the repository and select the branch to deploy. Keep the detected `amplify.yml` build settings.
4. Choose **Save and deploy**. Amplify builds each new commit and provides a hosted URL. A custom domain can be added under the app's domain management settings.

## Prototype status

The gallery uses sample records and remote sample images. The demo editor is available only in local development; production builds are read-only. There is no photo persistence, login, or AWS backend yet. Before adding a real admin screen, connect Cognito and enforce authorization in the backend as well as the UI. Store photos in private S3 and serve them through CloudFront; never put AWS credentials in this frontend.
