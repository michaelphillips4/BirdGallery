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

The repository includes [`amplify.yml`](amplify.yml), which deploys the Gen 2 backend for the connected branch, builds the Vite app, and publishes the `dist` directory. The backend provisions Cognito, an AppSync API backed by DynamoDB, and a private S3 bucket.

1. Push this repository to GitHub (or another Git provider supported by Amplify).
2. In the AWS Amplify console, choose **Create new app** and **Host web app**.
3. Connect the repository and select the branch to deploy. Keep the detected `amplify.yml` build settings.
4. Choose **Save and deploy**. Amplify builds each new commit and provides a hosted URL. A custom domain can be added under the app's domain management settings.

For the already-connected app, push this backend change to its connected branch. Amplify needs a service role permitted to deploy the backend resources; check the build log if the `pipeline-deploy` phase reports an IAM permission error.

## Create the first administrator

The Cognito user pool rejects public self-sign-up. After the backend deploys, open the Cognito user pool created for this branch, create your user, then add that user to the `Admins` group. The **Manage collection** screen accepts Cognito sign-in, but only members of `Admins` see the editor. Authorization is also enforced by the data API and S3 policies.

## Run a local backend

Configure AWS CLI credentials for your account, then run:

```sh
npm run sandbox
npm run dev
```

The sandbox provisions a development backend and generates local Amplify outputs. Those environment-specific outputs are copied into `public/` for Vite and are ignored by Git. Sandbox resources may incur AWS charges; stop the sandbox when you are finished.

## Prototype status

Without generated Amplify outputs, local development shows the sample gallery and a backend-setup notice. With the backend configured, the gallery loads persistent photo metadata from DynamoDB and private S3 images through Amplify Storage. Photo records include species, category, location, date, camera, lens, exposure settings, notes, and the S3 object key. Uploads accept JPEG, PNG, or WebP up to 20 MB; the app re-encodes them as WebP, strips embedded metadata, and limits the stored image to 8 MB. Never put AWS credentials in the frontend.
