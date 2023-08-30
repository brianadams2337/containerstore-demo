import { ModuleOptions } from 'nuxt-viewport'
import breakpoints from './breakpoints'

const defaultBreakpoints = Object.fromEntries(
  Object.keys(breakpoints).map((name) => [name, name]),
)

const options: Partial<ModuleOptions> = {
  breakpoints,
  defaultBreakpoints,
  fallbackBreakpoint: 'lg',
}

export default options
