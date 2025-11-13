import * as core from '@actions/core';

async function run(): Promise<void> {
  try {
    const exampleInput = core.getInput('example-input');
    core.info(`Input received: ${exampleInput}`);

    // Your action logic here
    core.setOutput('example-output', 'Hello from Regolith Action!');
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
