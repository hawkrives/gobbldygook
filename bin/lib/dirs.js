import loadPkg from 'load-pkg'
const pkg = loadPkg()
import {userCacheDir} from 'appdirs'
export const cacheDir = userCacheDir(pkg.name)
