import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { personalAssistantFunction, MODEL_ID } from "./functions/hr-assistant/resource";
import { CfnApp } from "aws-cdk-lib/aws-pinpoint";
import { Stack } from "aws-cdk-lib/core";

export const backend = defineBackend({
  auth,
  data,
  personalAssistantFunction,
});

// Create Amplify analytics stack for use in session tracking
const analyticsStack = backend.createStack("analytics-stack");

// create a Pinpoint app
const pinpoint = new CfnApp(analyticsStack, "Pinpoint", {
  name: "Proserve Fridai Analytics",
});

// create an IAM policy to allow interacting with Pinpoint
const pinpointPolicy = new Policy(analyticsStack, "PinpointPolicy", {
  policyName: "PinpointPolicy",
  statements: [
    new PolicyStatement({
      actions: ["mobiletargeting:UpdateEndpoint", "mobiletargeting:PutEvents"],
      resources: [pinpoint.attrArn + "/*"],
    }),
  ],
});

// apply the policy to the authenticated and unauthenticated roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(pinpointPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(pinpointPolicy);

// patch the custom Pinpoint resource to the expected output configuration
backend.addOutput({
  analytics: {
    amazon_pinpoint: {
      app_id: pinpoint.ref,
      aws_region: Stack.of(pinpoint).region,
    }
  },
});

backend.personalAssistantFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      `arn:aws:bedrock:*::foundation-model/${MODEL_ID}`,
    ],
  })
);