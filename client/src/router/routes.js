
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/Main') },
      { path: '/login', component: () => import('pages/Login') },
      { path: '/main', component: () => import('pages/Main') },
      { path: '/filters', component: () => import('pages/FiltersList') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
