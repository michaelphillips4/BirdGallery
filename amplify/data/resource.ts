import { a, defineData, type ClientSchema } from '@aws-amplify/backend'

const schema = a.schema({
  Photo: a
    .model({
      title: a.string().required(),
      species: a.string(),
      location: a.string(),
      date: a.string(),
      camera: a.string(),
      lens: a.string(),
      settings: a.string(),
      category: a.string().required(),
      notes: a.string(),
      imageKey: a.string().required(),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.group('Admins'),
    ]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
})