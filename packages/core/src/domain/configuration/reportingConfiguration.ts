import { display } from '../../tools/display'
import { isIndexableObject } from '../../tools/utils/typeUtils'
import type { InitConfiguration } from './configuration'

export interface ReportingConfiguration {
  endpoint: string
  appName: string
  headers?: Record<string, string>
}

export function isReportingMode(initConfiguration: Pick<InitConfiguration, 'reporting'> | undefined) {
  return !!initConfiguration?.reporting
}

export function validateAndBuildReportingConfiguration(
  reportingConfiguration: ReportingConfiguration | undefined
): ReportingConfiguration | undefined {
  if (!reportingConfiguration) {
    return
  }

  if (!reportingConfiguration.endpoint || typeof reportingConfiguration.endpoint !== 'string') {
    display.error('Reporting endpoint is not configured, we will not send any data.')
    return
  }

  if (!reportingConfiguration.appName || typeof reportingConfiguration.appName !== 'string') {
    display.error('Reporting appName is not configured, we will not send any data.')
    return
  }

  try {
    new URL(reportingConfiguration.endpoint)
  } catch {
    display.error('Reporting endpoint must be a valid URL')
    return
  }

  if (reportingConfiguration.headers !== undefined) {
    if (!isIndexableObject(reportingConfiguration.headers)) {
      display.error('Reporting headers must be defined as an object')
      return
    }

    for (const [key, value] of Object.entries(reportingConfiguration.headers)) {
      if (typeof value !== 'string') {
        display.error(`Reporting header "${key}" must be defined as a string`)
        return
      }
    }
  }

  return reportingConfiguration
}
