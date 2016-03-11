import loadPkg from 'load-pkg'
import {userCacheDir} from 'appdirs'

const pkg = loadPkg.sync(process.cwd())
export const cacheDir = userCacheDir(pkg.name)
