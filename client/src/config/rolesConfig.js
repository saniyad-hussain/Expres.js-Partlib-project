const rolesConfig = {
  //role name as a key.

  Admin: {
    routes: [
      {
        component: 'AdminPage',
        url: '/adminpage'
      },
      {
        component: 'Dashboard',
        url: '/dashboard'
      },
      {
        component: 'Platform',
        url: '/platform'
      },
      {
        component: 'Creator',
        url: '/creator'
      },
      {
        component: 'Creator',
        url: '/creator/:id/:name'
      },
    ],
  },
  Eng: {
    routes: [
      {
        component: 'Dashboard',
        url: '/dashboard'
      },
      {
        component: 'Platform',
        url: '/platform'
      },
      {
        component: 'Creator',
        url: '/creator'
      },
      {
        component: 'Creator',
        url: '/creator/:id/:name'
      },
    ],
  },
  Quality: {
    routes: [
      {
        component: 'Dashboard',
        url: '/dashboard'
      },
      {
        component: 'Platform',
        url: '/platform'
      },
      {
        component: 'Creator',
        url: '/creator'
      },
      {
        component: 'Creator',
        url: '/creator/:id/:name'
      },
    ],
  },
  Ops: {
    routes: [
      {
        component: 'Dashboard',
        url: '/dashboard'
      },
      {
        component: 'Platform',
        url: '/platform'
      },
      {
        component: 'Creator',
        url: '/creator'
      },
      {
        component: 'Creator',
        url: '/creator/:id/:name'
      },
    ],
  },
  Viewer: {
    routes: [
      {
        component: 'Dashboard',
        url: '/dashboard'
      },
      {
        component: 'Platform',
        url: '/platform'
      },
      {
        component: 'Creator',
        url: '/creator'
      },
      {
        component: 'Creator',
        url: '/creator/:id/:name'
      },
    ],
  },
  Guest: {
    routes: [

    ]
  },
  common: {
    routes: [
      {
        component: 'CommonRoute',
        url: '/common'
      }
    ]
  }
}

export default rolesConfig