/* eslint-disable no-tabs */
const webfontsGenerator = require('webfonts-generator')
const path = require('path')
const glob = require('glob')
const getSvgs = () => glob.sync('svgs/*.svg', {cwd: __dirname}).map(f => path.join(__dirname, f))
console.log(getSvgs())

webfontsGenerator({
  fontName: 'afs-icons',
  templateOptions: {
    classPrefix: 'bt-',
    baseSelector: '.bt'
  },
  cssTemplate: path.join(__dirname, 'styl.hbs'),
  files: getSvgs(),
  types: ['woff'],
  order: ['woff'],
  dest: path.resolve(__dirname, '../client/src/css'),
  cssDest: path.join(path.resolve(__dirname, '../client/src/css'), 'afs-icons.styl')
}, e => {
  if (e) {
    console.log('Fail!', e)
  } else {
    console.log('Done!')
  }
})

/*
  material-design
  ic_clear_all_48px.svg			- clear-all
  ic_menu_48px.svg				- menu-drawer

  ionicons
  alert-circled.svg				- alert
  android-lock.svg				- lock-andr
  checkmark.svg					- checkmark
  chevron-left.svg				- chevron-left
  chevron-right.svg				- chevron-right
  close.svg						- close
  document.svg					- new
  edit.svg						- edit
  funnel.svg					- conds
  ios-arrow-thin-up.svg			- thin-up
  ios-checkmark.svg				- checkmark-lite
  ios-circle-filled.svg			- radio-on
  ios-circle-outline.svg		- radio-off
  ios-close-outline.svg			- close-lite
  ios-contact-outline.svg		- user
  ios-copy.svg					- dupe
  ios-people.svg				- users
  lock-combination.svg			- password
  locked.svg					- lock
  log-in.svg					- log-in
  log-out.svg					- log-out
  refresh.svg					- refresh
  trash-a.svg					- trash
  unlocked.svg					- unlock

  br
  reset-pass.svg
*/
