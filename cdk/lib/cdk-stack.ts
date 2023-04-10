import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';


export class PersistentStorageCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket to store images
    /*
    const imageBucket = new s3.Bucket(this, 'ImageBucket', {
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });*/

    // Health Check endpoint
    const health = new lambda.Function(this, 'HealthHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,    // execution environment
      code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'health.handler'                // file is "health", function is "handler"
    });

    // Allow the Lambda function to log to CloudWatch Logs
    health.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
        resources: ['arn:aws:logs:*:*:*'],
      })
    );

    const restApi = new RestApi(this, 'RestApi', {
      restApiName: 'Rest API',
      description: 'Image Handler REST API',
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      },
    });
    const healthCheckResource = restApi.root.addResource('health-check');
    const healthCheckMethod = healthCheckResource.addMethod('GET', new LambdaIntegration(health));
    
    /*
    // Create a Lambda function to handle the API requests
    const imageMetadataHandler = new lambda.Function(this, 'ImageMetadataHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: {
        IMAGE_BUCKET_NAME: imageBucket.bucketName,
      },
    });

    // Grant the Lambda function access to the S3 bucket
    imageBucket.grantReadWrite(imageMetadataHandler);

    // Allow the Lambda function to log to CloudWatch Logs
    imageMetadataHandler.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
        resources: ['arn:aws:logs:*:*:*'],
      })
    );

    // Create an API Gateway
    const api = new apigateway.HttpApi(this, 'ImageMetadataApi');

    // Create an integration between the API Gateway and the Lambda function
    const lambdaIntegration = new apigateway.LambdaProxyIntegration({
      handler: imageMetadataHandler,
    });

    // Add a route to the API Gateway that accepts a multipart image and JSON metadata as input
    api.addRoutes({
      path: '/images',
      methods: [apigateway.HttpMethod.POST],
      integration: lambdaIntegration,
      payloadFormatVersion: apigateway.PayloadFormatVersion.VERSION_2_0,
      routeKey: 'POST /images',
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [apigateway.CorsHttpMethod.POST],
        allowHeaders: ['Content-Type'],
      },
    });*/
  }
}


/*
import * as cdk from 'aws-cdk-lib';
import { ImagePullPrincipalType } from 'aws-cdk-lib/aws-codebuild';
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs';

export class PersistentStorageCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, 'img-source', {
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      encryption: s3.BucketEncryption.UNENCRYPTED, // TODO Change once in production
    });

  }
}
*/