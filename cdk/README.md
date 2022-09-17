# CDK Stack 

This is the CDK stack for infrastructure, based on the the generated CDK template. 

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Setup 
Bootstrap the account when doing a fresh install to new account / region

```
cdk bootstrap aws://ACCOUNT-NUMBER-1/REGION-1 
```

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
