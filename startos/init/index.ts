import { actions } from '../actions'
import { restoreInit } from '../backups'
import { dependencies } from '../dependencies'
import { versionGraph } from '../versions'
import { setInterfaces } from '../interfaces'
import { sdk } from '../sdk'
import { initializeService } from './initializeService'
import { installTasks } from './installTasks'
import { reconcileCodexTask } from './reconcileCodexTask'
import { watchCredentials } from './watchCredentials'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  actions,
  dependencies,
  installTasks,
  initializeService,
  watchCredentials,
  reconcileCodexTask,
)

export const uninit = sdk.setupUninit(versionGraph)
