import keymage from 'keymage'

import studentActions from '../flux/student-actions'

// binding on 'defmod' binds on Command key on OS X and on
// the Control key in other systems
keymage('defmod-z', studentActions.undo)
keymage('defmod-shift-z', studentActions.redo)

keymage('search', 'defmod-z', () => {})
keymage('search', 'defmod-shift-z', () => {})
