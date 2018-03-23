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
      { path: '/claims', component: () => import('pages/ClaimList') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
