import 'styled-components'
import { lightTheme } from './themes'

type Theme = typeof lightTheme

declare module 'styled-components' {
  // An empty extending interface is the declaration-merging idiom for typing
  // styled-components' DefaultTheme; a type alias cannot augment a module interface.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
