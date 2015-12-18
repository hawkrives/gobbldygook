import loadPkg from 'load-pkg'
const pkg = loadPkg.sync(process.cwd())
import {userCacheDir} from 'appdirs'
export const cacheDir = userCacheDir(pkg.name)
