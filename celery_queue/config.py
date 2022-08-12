from secrets_vars import secret_vars
import os
os.environ["environment"] = "development"

broker_url = 'sqs://{access_key}:{secret_key}@'.format(
    access_key=secret_vars['AWS_ACCESS_KEY_ID'],
    secret_key=secret_vars['AWS_SECRET_ACCESS_KEY'],
)

broker_transport_options = {
      'predefined_queues': {
        'celery': {
          'url': secret_vars['TASK_QUEUE_SQS_URL'] if os.environ['environment'] == "production" else secret_vars['TASK_QUEUE_SQS_URL_DEVELOPMENT'],
          'access_key_id': secret_vars['AWS_ACCESS_KEY_ID'],
          'secret_access_key': secret_vars['AWS_SECRET_ACCESS_KEY'],
        },
      },
      'polling_interval': 60,
      'max_retries': 0,
      'visibility_timeout': 7200
    }