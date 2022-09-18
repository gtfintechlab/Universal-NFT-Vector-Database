import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

export async function addTaskIdSQS (taskId, taskType) {
  const secrets = useRuntimeConfig().secretVariables
  const environment = useRuntimeConfig().environment

  AWS.config.update({
    region: 'us-east-1',
    accessKeyId: secrets.AWS_ACCESS_KEY_ID,
    secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY
  })

  const sqs = new AWS.SQS()
  const messageBody = generateCelerySQS(taskId, taskType)
  const params = {
    QueueUrl: (environment === 'production'
      ? secrets.TASK_QUEUE_SQS_URL
      : secrets.TASK_QUEUE_SQS_URL_DEVELOPMENT) as string,
    DelaySeconds: 0,
    MessageAttributes: {},
    MessageBody: Buffer.from(JSON.stringify(messageBody)).toString('base64')
  }
  sqs.sendMessage(params).send()
}

export function generateCelerySQS (taskId: string, taskType: string) {
  const taskUuid = uuidv4()
  const body = [
    [taskId], {}, {
      callbacks: null,
      errbacks: null,
      chain: null,
      chord: null
    }
  ]
  const message = {
    body: Buffer.from(JSON.stringify(body)).toString('base64'),
    'content-encoding': 'utf-8',
    'content-type': 'application/json',
    headers: {
      lang: 'js',
      task: 'tasks.' + taskType,
      id: taskUuid,
      root_id: taskUuid,
      parent_id: null,
      shadow: null,
      eta: null,
      expires: null,
      group: null,
      group_index: null,
      retries: 0,
      timelimit: [
        null,
        null
      ],
      argsrepr: `('${taskId}',)`,
      kwargsrepr: '{}',
      origin: 'TQScript',
      ignore_result: false
    },
    properties: {
      correlation_id: taskUuid,
      reply_to: uuidv4(),
      delivery_mode: 2,
      delivery_info: {
        exchange: '',
        routing_key: 'celery'
      },
      priority: 0,
      body_encoding: 'base64',
      delivery_tag: uuidv4()
    }
  }
  return message
}
