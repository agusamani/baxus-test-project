import * as wf from '@temporalio/workflow';
import * as activities from './activities';

export enum SIGNING_STATUS {
  SIGNED = 'SIGNED',
  INPROGRESS = 'INPROGRESS',
  FAILED = 'FAILED',
}

export const getStatusQuery = wf.defineQuery<SIGNING_STATUS>('getStatus');
export const getSignedMessageQuery = wf.defineQuery<string>('getSignedMessage');

const { signMessageActivity, storeSignedMessage } = wf.proxyActivities<typeof activities>({
  startToCloseTimeout: '5 minutes',
});

export async function signMessageWorkflow(message: string, referenceId: string, key: string): Promise<string> {
  let status = SIGNING_STATUS.INPROGRESS;
  let signedMessage: string;

  wf.setHandler(getStatusQuery, () => {
    return status;
  });
  wf.setHandler(getSignedMessageQuery, () => {
    return signedMessage;
  });

  try {
    signedMessage = await signMessageActivity(message, key);
    // Mock time to sign message
    await wf.sleep('30s');

    await storeSignedMessage(referenceId, signedMessage);
    status = SIGNING_STATUS.SIGNED;
    return signedMessage;
  } catch (error) {
    status = SIGNING_STATUS.FAILED;
    throw error;
  }
}
