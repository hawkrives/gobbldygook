// flow-typed signature: 252babe878cb88ad63d7e2fbbf445497
// flow-typed version: d4656e4959/react-dnd_v2.x.x/flow_>=v0.23.x

declare module 'react-dnd' {
  declare function DropTarget<T: ReactClass<*>>(type: string|string[], spec?: Object, collect?: Object, options?: mixed): (component: T) => T;
  declare function DragSource<T: ReactClass<*>>(type: string|string[], spec?: Object, collect?: Object, options?: mixed): (component: T) => T;
  declare function DragLayer<T: ReactClass<*>>(type: string|string[], spec?: Object, collect?: Object, options?: mixed): (component: T) => T;
  declare function DragDropContext(backend: mixed): ReactClass<*>;
}
