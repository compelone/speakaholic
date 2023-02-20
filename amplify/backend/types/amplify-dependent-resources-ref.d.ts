export type AmplifyDependentResourcesAttributes = {
  "analytics": {
    "speakaholicprod": {
      "Id": "string",
      "Region": "string",
      "appName": "string"
    }
  },
  "api": {
    "speakaholic": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string"
    }
  },
  "auth": {
    "speakaholic": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "predictions": {
    "speakaholicidentifytextprod": {
      "format": "string",
      "region": "string"
    },
    "speakaholictexttospeechprod": {
      "language": "string",
      "region": "string",
      "voice": "string"
    }
  },
  "storage": {
    "s3speakaholicstorage": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}