import AWS from 'aws-sdk'

export async function addTaskIdSQS (taskId) {
  const secrets = useRuntimeConfig().secretVariables
  const environment = useRuntimeConfig().environment;
  process.env.AWS_ACCESS_KEY_ID = secrets.AWS_ACCESS_KEY_ID
  process.env.AWS_SECRET_ACCESS_KEY = secrets.AWS_SECRET_ACCESS_KEY
  AWS.config.update({
    region: "us-east-1",
  })

  const sqs = new AWS.SQS()
  const params = {
    QueueUrl: (environment === "production" ? 
                secrets.TASK_QUEUE_SQS_URL : secrets.TASK_QUEUE_SQS_URL_DEVELOPMENT)  as string,
    DelaySeconds: 0,
    MessageAttributes: {
      TaskId: {
        DataType: 'String',
        StringValue: taskId
      }
    },
    MessageBody: taskId
  }
  sqs.sendMessage(params).send()
}
