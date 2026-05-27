import type { Payload } from '../../transport'
import { timeStampNow } from '../../tools/utils/timeUtils'
import { generateUUID } from '../../tools/utils/stringUtils'
import type { EndpointBuilder, TrackType, ApiType, TransportSource } from './endpointBuilder'
import type { ReportingConfiguration } from './reportingConfiguration'

// replaced at build time
declare const __BUILD_ENV__SDK_VERSION__: string

export function createReportingEndpointBuilder(
  reportingConfiguration: ReportingConfiguration,
  trackType: TrackType,
  source: TransportSource = 'browser'
): EndpointBuilder {
  return {
    build(api: ApiType, payload: Payload) {
      const url = new URL(reportingConfiguration.endpoint)
      const searchParameters = buildReportingParameters(reportingConfiguration, trackType, source, api, payload)

      searchParameters.forEach((value, key) => {
        url.searchParams.append(key, value)
      })

      return url.toString()
    },
    buildRequestInit: () =>
      reportingConfiguration.headers ? { headers: { ...reportingConfiguration.headers } } : undefined,
    trackType,
  }
}

function buildReportingParameters(
  reportingConfiguration: ReportingConfiguration,
  trackType: TrackType,
  source: TransportSource,
  api: ApiType,
  payload: Payload
) {
  const searchParameters = new URLSearchParams()

  searchParameters.append('ddsource', source)
  searchParameters.append('dd-evp-origin-version', __BUILD_ENV__SDK_VERSION__)
  searchParameters.append('dd-evp-origin', 'browser')
  searchParameters.append('dd-request-id', generateUUID())
  searchParameters.append('app', reportingConfiguration.appName)

  if (payload.encoding) {
    searchParameters.append('dd-evp-encoding', payload.encoding)
  }

  if (trackType === 'rum') {
    searchParameters.append('batch_time', String(timeStampNow()))
    searchParameters.append('_dd.api', api)

    if (payload.retry) {
      searchParameters.append('_dd.retry_count', String(payload.retry.count))
      searchParameters.append('_dd.retry_after', String(payload.retry.lastFailureStatus))
    }
  }

  return searchParameters
}
