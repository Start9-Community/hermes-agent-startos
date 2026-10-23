import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v2026_10_8_2 } from './v2026.10.8.2'

export const versionGraph = VersionGraph.of({
  current,
  other: [v2026_10_8_2],
})
