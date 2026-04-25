// ============================================================================
// LiquidJS Client — Native API client modules
// ============================================================================
// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

export {
  createRestClient,
  useRest,
  RestError,
  type RestClientConfig,
  type RestClient,
  type RestResponse,
  type RequestConfig,
  type RequestInterceptor,
  type ResponseInterceptor,
} from './rest';

export {
  defineMessage,
  createGrpcWebClient,
  useProto,
  type MessageType,
  type GrpcWebClient,
} from './protobuf';

export {
  createGraphQLClient,
  gql,
  useQuery,
  useMutation,
  type GraphQLClient,
  type GraphQLClientConfig,
  type GraphQLResponse,
  type GraphQLError,
} from './graphql';
