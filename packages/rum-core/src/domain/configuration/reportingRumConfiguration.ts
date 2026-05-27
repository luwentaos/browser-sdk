import type { RumInitConfiguration } from './configuration'

export const REPORTING_APPLICATION_ID = '00000000-0000-0000-0000-000000000001'

export function resolveReportingApplicationId(initConfiguration: RumInitConfiguration) {
  return initConfiguration.applicationId || REPORTING_APPLICATION_ID
}
