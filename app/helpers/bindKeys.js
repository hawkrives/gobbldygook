import keymage from 'keymage'

import studentActions from '../flux/studentActions'

// binding on 'defmod' binds on Command key on OS X and on Control key in other
// systems
keymage('defmod-z', studentActions.undo)
keymage('defmod-shift-z', studentActions.redo)
