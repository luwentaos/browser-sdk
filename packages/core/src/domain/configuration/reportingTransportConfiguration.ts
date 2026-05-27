import type { Site } from '../intakeSites'
import { INTAKE_SITE_US1 } from '../intakeSites'
import type { InitConfiguration } from './configuration'
import type { TransportConfiguration } from './transportConfiguration'
import { createReportingEndpointBuilder } from './reportingEndpointBuilder'
import type { TransportSource } from './endpointBuilder'

export function computeReportingTransportConfiguration(
  initConfiguration: InitConfiguration,
  sourceOverride?: TransportSource
): TransportConfiguration {
  const source = validateSource(initConfiguration.source)
  const transportSource = sourceOverride ?? source
  const site: Site = INTAKE_SITE_US1
  const reportingConfiguration = initConfiguration.reporting!

  return {
    clientToken: initConfiguration.clientToken || 'empty',
    proxy: initConfiguration.proxy,
    site,
    source,
    logsEndpointBuilder: createReportingEndpointBuilder(reportingConfiguration, 'logs', transportSource),
    rumEndpointBuilder: createReportingEndpointBuilder(reportingConfiguration, 'rum', transportSource),
    profilingEndpointBuilder: createReportingEndpointBuilder(reportingConfiguration, 'profile', transportSource),
    sessionReplayEndpointBuilder: createReportingEndpointBuilder(reportingConfiguration, 'replay', transportSource),
    exposuresEndpointBuilder: createReportingEndpointBuilder(reportingConfiguration, 'exposures', transportSource),
    flagEvaluationEndpointBuilder: createReportingEndpointBuilder(
      reportingConfiguration,
      'flagevaluation',
      transportSource
    ),
    debuggerEndpointBuilder: createReportingEndpointBuilder(reportingConfiguration, 'debugger', transportSource),
  }
}

function validateSource(source: string | undefined): TransportConfiguration['source'] {
  if (source === 'flutter' || source === 'unity') {
    return source
  }
  return 'browser'
}
