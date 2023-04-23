import sys
from datetime import datetime
import os
from github import Github
import openai

# コマンドライン引数から値を取得する
repository = sys.argv[1]
username = sys.argv[2]
start_time = datetime.strptime(sys.argv[3], '%Y-%m-%dT%H:%M:%SZ')
end_time = datetime.strptime(sys.argv[4], '%Y-%m-%dT%H:%M:%SZ')

# GitHub APIにアクセスするためのトークン
token = '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'

# Githubオブジェクトを作成する
g = Github(token)

# リポジトリオブジェクトを取得する
repo = g.get_repo(repository)

# コミットログを取得する
commits = repo.get_commits(author=username)

# コメントのリストを作成する
comments_list = []
for commit in commits:
    if start_time <= commit.commit.committer.date <= end_time:
        comments_list.append(commit.commit.message)

# リストを出力する
print(comments_list)
# openai.api_key = "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"

# response = openai.ChatCompletion.create(
#     model="gpt-3.5-turbo",
#     messages=[
#         {"role": "user", "content": f"これはgitlogです。各要素を結合して、全体を10文字以内で要約してください：{comments_list}"},
#     ],
# )
# print(response.choices[0]["message"]["content"].strip())