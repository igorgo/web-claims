const rest = require('../rest')
const db = require('../db')

async function currentReleasesHandler (req, res, next) {
  try {
    const stmt = await db.executePub(`
select S01 as "n",
       S02 as "b",
       S03 as "v",
       D01 as "rd",
       D02 as "bd",
       N01 as "o",
       N02 as "c"
  from table(UDO_PACKAGE_NODEWEB_IFACE.GET_CURRENT_RELEASES)
    `)
    res.send(200, stmt.rows)
  } catch (e) {
    return next(new rest.errors.InternalServerError(e.message))
  }
}

rest.get('/pub/current-releases', currentReleasesHandler)
