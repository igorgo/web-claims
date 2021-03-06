export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/Main') },
      { path: '/main', component: () => import('pages/Main') },
      { path: '/login', component: () => import('pages/auth/Login') },
      { path: '/signup', component: () => import('pages/auth/SignUp') },
      { path: '/filters', component: () => import('pages/filters/FiltersList') },
      { path: '/claim/user-sort', component: () => import('pages/filters/EditUserSort') },
      { path: '/filters/:mode/:id', component: () => import('pages/filters/FilterEdit') },
      { path: '/filters/:mode', component: () => import('pages/filters/FilterEdit') },
      { path: '/claims', component: () => import('pages/claims/ClaimList') },
      { path: '/claim/view/:id', component: () => import('pages/claims/ClaimView') },
      { path: '/claim/new', component: () => import('pages/claims/actions/ClaimNew') },
      { path: '/claim/change-status/:id', component: () => import('pages/claims/actions/ClaimChangeStatus') },
      { path: '/claim/edit/:id', component: () => import('pages/claims/actions/ClaimEdit') },
      { path: '/claim/return/:id', component: () => import('pages/claims/actions/ClaimReturn') },
      { path: '/claim/send-to/:id', component: () => import('pages/claims/actions/ClaimSendTo') },
      { path: '/claim/attach/:id', component: () => import('pages/claims/actions/ClaimAttach') },
      { path: '/claim/comment/:id', component: () => import('pages/claims/actions/ClaimComment') },
      { path: '/claim/help-state/:mode/:id', component: () => import('pages/claims/actions/ClaimHelpState') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
