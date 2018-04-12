export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/Main') },
      { path: '/login', component: () => import('pages/Login') },
      { path: '/main', component: () => import('pages/Main') },
      { path: '/filters', component: () => import('pages/FiltersList') },
      { path: '/filters/:mode/:id', component: () => import('pages/FilterEdit') },
      { path: '/filters/:mode', component: () => import('pages/FilterEdit') },
      { path: '/claims', component: () => import('pages/ClaimList') },
      { path: '/claim/view/:id', component: () => import('pages/ClaimView') },
      { path: '/claim/new', component: () => import('pages/ClaimNew') },
      { path: '/claim/change-status/:id', component: () => import('pages/ClaimChangeStatus') },
      { path: '/claim/edit/:id', component: () => import('pages/ClaimEdit') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
