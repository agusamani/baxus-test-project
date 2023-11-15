import { Connection, Client, WorkflowHandle } from '@temporalio/client';
import { signMessageWorkflow, SIGNING_STATUS } from './workflows';

export async function startSigningMessage(message: string, referenceId: string, key: string): Promise<void> {
  const connection = await Connection.connect(); // Connect to Temporal server
  const client = new Client({
    connection,
  });

  await client.workflow.start(signMessageWorkflow, {
    args: [message, referenceId, key],
    taskQueue: 'sign-messages',
    workflowId: referenceId,
  });
  console.log(`Started signing workflow with ID: ${referenceId}`);
}

export async function checkSigningMessageStatus(
  referenceId: string
): Promise<{ status: string; signedMessage?: string }> {
  const connection = await Connection.connect(); // Connect to Temporal server
  const client = new Client({
    connection,
  });

  const handle: WorkflowHandle = client.workflow.getHandle(referenceId);
  const status: SIGNING_STATUS = await handle.query('getStatus');

  const signedMessage: string | undefined = await handle.query('getSignedMessage');

  if (status === SIGNING_STATUS.SIGNED) {
    return { status, signedMessage };
  }
  return { status };
}
