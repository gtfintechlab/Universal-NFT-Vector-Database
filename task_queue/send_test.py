import os
import uuid
import boto3
from dotenv import load_dotenv
load_dotenv()  

if __name__ == '__main__':
    sqs = boto3.client('sqs', region_name='us-east-1', aws_access_key_id=os.getenv("CLIENT_KEY"),
                    aws_secret_access_key=os.getenv("CLIENT_SECRET"))
    queue_url = os.getenv("AWS_SQS_URL")
            


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