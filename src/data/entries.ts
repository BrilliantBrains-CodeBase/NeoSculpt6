import routesJson from './routes.json'
import type { RouteEntry, RoutePage } from './types'

export const entries = routesJson as unknown as RouteEntry[]
export const pageByPath = new Map(entries.filter((e): e is RoutePage => e.type !== 'redirect').map((e) => [e.path, e]))
