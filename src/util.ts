import chalk from 'chalk';
import { FormItem } from './types';
// Function to check if the required environment variables are set
export function checkEnvVariable(variableName: string): string {
  const value = process.env[variableName];
  if (!value) {
    error(`Please set ${variableName} environment variable`);
    process.exit(1);
  }
  return value;
}
// Function to parse string in streaming mode
// 'data: {"event": "message", "task_id": "e22d1147-6fd9-4a01-8340-87c66a66aec2", "id": "8cf8f6f8-4ec2-42ca-bc1d-71c3ebc0a18e", "answer": " applications", "created_at": 1690977033, "conversation_id": "afa95cc9-d7b2-4f2b-aea8-fdd4ee299866"}'
// TODO Error while parsing data: event: ping
let buffer = '';

export function streamParser(data: string): any {
  buffer += data;

  // Split buffered data by the "data: " prefix
  const messages = buffer.split('data: ');

  // If there's only one incomplete message, return early
  if (messages.length <= 1) return '';

  // Keep the last part in buffer for the next chunk
  buffer = messages.pop() || '';

  // Parse each message
  for (const message of messages) {
    if (message) {
      try {
        const json = JSON.parse(message);
        if (json.event === 'ping') continue;

        if (json.event === 'message') {
          console.log(json);
          return json['answer'];
        }
      } catch (e) {
        error(`Error parsing: ${message}`);
        return '😄';
      }
    }
  }

  return '';
}

export function error(message: string) {
  console.log(chalk.red(message));
}

export function info(message: string) {
  console.log(chalk.blue(message));
}
export function success(message: string) {
  console.log(chalk.green(message));
}

export function warn(message: string) {
  console.log(chalk.yellow(message));
}

export function userInputFormParser(items: any[]): FormItem[] {
  // Initialize an empty array to store the converted data
  let convertedData = [];

  // Iterate over each object in the array
  for (let item of items) {
    for (let key in item) {
      // Create a new object with 'type' key and existing data
      let newObj = { type: key, ...item[key] };

      // Append the new object to the array
      convertedData.push(newObj);
    }
  }
  return convertedData;
}
