export default {
  aws_project_region: "us-west-2",
  aws_cognito_identity_pool_id: "YOUR_COGNITO_IDENTITY_POOL_ID",
  aws_cognito_region: "us-west-2",
  aws_user_pools_id: "YOUR_USER_POOLS_ID",
  aws_user_pools_web_client_id: "YOUR_USER_POOLS_WEB_CLIENT_ID",
  aws_appsync_graphqlEndpoint: "YOUR_APPSYNC_GRAPHQL_ENDPOINT",
  aws_appsync_region: "us-west-2",
  aws_appsync_authenticationType: "API_KEY",
  aws_cloud_logic_custom: [
    {
      name: "sendSMS",
      endpoint: "/api/send-sms",
    },
  ],
}

