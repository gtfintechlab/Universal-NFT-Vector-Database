import boto3
from utils.get_secrets import get_all_secrets
secrets_dict = get_all_secrets()

if __name__ == '__main__':
    sqs = boto3.client('sqs', region_name='us-east-1', aws_access_key_id=secrets_dict["AWS_ACCESS_KEY_ID"],
                    aws_secret_access_key=secrets_dict["AWS_SECRET_ACCESS_KEY"])
    queue_url = secrets_dict["TASK_QUEUE_SQS_URL"]
            


    # Send message to SQS queue
    response = sqs.send_message(
                QueueUrl=queue_url,
                DelaySeconds=0,
                MessageAttributes={
                    'TaskId': {
                        'DataType': 'String',
                        'StringValue': "HELLO WORLD"
                    },
                },
                MessageBody=(
                    "HELLO WORLD"
                )
            )