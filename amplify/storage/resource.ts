import { defineStorage } from '@aws-amplify/backend'

export const storage = defineStorage({
  name: 'birdgalleryphotos',
  keepOnDelete: true,
  access: (allow) => ({
    'photos/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['Admins']).to(['read', 'write', 'delete']),
    ],
  }),
})