// ============================================================================
// LiquidJS Client — Native API client modules
// ============================================================================

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
