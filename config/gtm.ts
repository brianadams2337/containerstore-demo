import { ModuleOptions } from '@zadigetvoltaire/nuxt-gtm'
import env from '../environment'

const options: ModuleOptions = {
  id: env.GTM_ID,
}

export default options
