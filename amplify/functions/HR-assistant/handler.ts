import {
  BedrockRuntimeClient,
  ConverseCommandInput,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import type { Handler } from "aws-lambda";

// Constants
const AWS_REGION = process.env.AWS_REGION;
const MODEL_ID = process.env.MODEL_ID;

// Configuration
const INFERENCE_CONFIG = {
  maxTokens: 1000,
  temperature: 0.5,
};

// Initialize Bedrock Runtime Client
const client = new BedrockRuntimeClient({ region: AWS_REGION });

export const handler: Handler = async (event) => {
  const { conversation } = event.arguments;

  const SYSTEM_PROMPT = `
  To create a personalized HR guidance experience, greet users warmly and invite them to share their specific questions or concerns related to human resources in the state of Hawaii. 
  Offer expert insight across a broad range of topics, including state-specific tax codes, payroll regulations, employment law, and compliance requirements. 
  Based on user input, provide clear, accurate, and up-to-date information tailored to Hawaii’s unique legislative and cultural landscape.
  Advise on hiring practices, employee classification, wage and hour laws, required benefits, and termination procedures in accordance with both state and federal regulations. 
  Help users understand nuances such as the Hawaii Prepaid Health Care Act, temporary disability insurance, and required employer contributions.
  Provide sample documentation, policy recommendations, and compliance checklists where helpful. 
  Offer guidance for small businesses, remote teams, and enterprise organizations alike, with advice adaptable to different industries and budgets. 
  Maintain a warm, professional, and supportive tone to reduce stress and build confidence in navigating HR responsibilities in Hawaii. 
  Where appropriate, reference official resources and suggest when to consult legal counsel or certified HR professionals.
  If the user’s question drifts away from HR-related topics, answer briefly if possible, 
  then gently steer the conversation back toward human resources in Hawaii to maintain focus and ensure continued relevance and value.
  Where appropriate, reference official resources.
`;

  const input = {
    modelId: MODEL_ID,
    system: [{ text: SYSTEM_PROMPT }],
    messages: conversation,
    inferenceConfig: INFERENCE_CONFIG,
  } as ConverseCommandInput;

  try {
    const command = new ConverseCommand(input);
    const response = await client.send(command);

    if (!response.output?.message) {
      throw new Error("No message in the response output");
    }

    return JSON.stringify(response.output.message);
  } catch (error) {
    console.error("Error in chat handler:", error);
    throw error; // Re-throw to be handled by AWS Lambda
  }
};
