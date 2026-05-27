import type { EndpointBuilder } from '../domain/configuration'
import type { Payload } from './httpRequest'

export function buildEndpointRequestInit(endpointBuilder: EndpointBuilder, payload: Payload) {
  return endpointBuilder.buildRequestInit?.(payload)
}
