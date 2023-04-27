import os
import sys
from datetime import datetime
from github import Github
import openai

repository = sys.argv[1]
username = sys.argv[2]
start_time = datetime.strptime(sys.argv[3], '%Y-%m-%dT%H:%M:%SZ')
end_time = datetime.strptime(sys.argv[4], '%Y-%m-%dT%H:%M:%SZ')
github_token = os.environ.get("GITHUB_API_TOKEN")
g = Github(github_token)
repo = g.get_repo(repository)
commits = repo.get_commits(author=username)
comments_list = []
for commit in commits:
    if start_time <= commit.commit.committer.date <= end_time:
        comments_list.append(commit.commit.message)

openai.api_key = os.environ.get("OPENAI_API_KEY")
response = openai.Completion.create(
    engine="text-davinci-002",
    prompt=f"これはgitlogです。各要素を結合して、全体を15文字でまとめてください：{comments_list}",
    max_tokens=20,
    n=1,
    stop=None,
)
print(response.choices[0].text.strip())