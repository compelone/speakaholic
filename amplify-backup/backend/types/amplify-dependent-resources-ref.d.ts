export type AmplifyDependentResourcesAttributes = {
  "analytics": {
    "speakaholic": {
      "Id": "string",
      "Region": "string",
      "appName": "string"
    }
  },
  "api": {
    "speakaholic": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string",
      "GraphQLAPIKeyOutput": "string"
    }
  },
  "auth": {
    "speakaholic": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "HostedUIDomain": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "OAuthMetadata": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "predictions": {
    "speakaholicidentifytext": {
      "format": "string",
      "region": "string"
    },
    "speakaholicspeechtotext": {
      "language": "string",
      "region": "string"
    },
    "speakaholictexttospeech": {
      "language": "string",
      "region": "string",
      "voice": "string"
    }
  },
  "storage": {
    "s3speakaholicstoragedev": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}