import type { UserData } from '@axonivy/user-editor-protocol';

export const data: Array<UserData> = [
  {
    name: 'wt',
    fullName: 'William Tell',
    emailAddress: 'william.tell@axonivy.com',
    password: '',
    roles: ['Teamleader'],
    properties: {
      perms: 'sa',
      status: 'married'
    }
  },
  {
    name: 'ldv',
    fullName: 'Leonardo Da Vinci',
    emailAddress: 'leonarda.davinci@axonivy.com',
    password: '',
    roles: ['Employee'],
    properties: {}
  },
  {
    name: 'hb',
    fullName: 'Hugo Boss',
    emailAddress: 'hugo.boss@axonivy.com',
    password: 'hb',
    roles: ['Teamleader', 'HR Manager', 'Facility Manager', 'IT Manager', 'Office Manager', 'Executive Manager', 'Processor'],
    properties: {}
  },
  {
    name: 'mc',
    fullName: 'Marie Curie',
    emailAddress: 'marie.curie@axonivy.com',
    password: '',
    roles: ['Facility Manager', 'Unknown'],
    properties: {}
  },
  {
    name: 'md',
    fullName: 'Marlene Dietrich',
    emailAddress: 'marlene.dietrich@axonivy.com',
    password: '',
    roles: ['HR Manager'],
    properties: {}
  },
  {
    name: 'jb',
    fullName: 'James Bond',
    emailAddress: 'james.bond@axonivy.com',
    password: '',
    roles: ['Office Manager', 'Deliverer'],
    properties: {}
  },
  {
    name: 'hf',
    fullName: 'Henry Ford',
    emailAddress: 'henry.ford@axonivy.com',
    password: '',
    roles: ['IT Manager'],
    properties: {}
  },
  {
    name: 'bf',
    fullName: 'Benjamin Franklin',
    emailAddress: 'benjamin.franklin@axonivy.com',
    password: '',
    roles: ['Executive Manager', 'Finance'],
    properties: {}
  }
];
