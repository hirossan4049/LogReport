import argparse
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
import os

parser = argparse.ArgumentParser(description='Post a message to a Slack channel.')
parser.add_argument('username', type=str, help='The GitHub username')
parser.add_argument('date', type=str, help='The date of the work')
parser.add_argument('message', type=str, help='The message to post')
args = parser.parse_args()

SLACK_API_TOKEN = os.environ.get("SLACK_API_TOKEN")
SLACK_CHANNEL_ID = 'C054FTRH2UT'

client = WebClient(token=SLACK_API_TOKEN)

try:
    response = client.chat_postMessage(
        channel=SLACK_CHANNEL_ID,
        text=f"{args.username}さんが{args.date}に以下の作業をしました: {args.message}"
    )
    print(f"メッセージが投稿されました: {response['ts']}")
except SlackApiError as e:
    print(f"メッセージの投稿に失敗しました: {e}")
