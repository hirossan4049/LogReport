import os
import sys
from datetime import datetime, timezone
import time
from github import Github
import openai

repository = sys.argv[1]
username = sys.argv[2]
start_time = time.mktime(datetime.fromisoformat(
    sys.argv[3].replace('Z', '+00:00')).timetuple())
end_time = time.mktime(datetime.fromisoformat(
    sys.argv[4].replace('Z', '+00:00')).timetuple())

github_token = os.environ.get("GITHUB_API_TOKEN")

g = Github(github_token)
repo = g.get_repo(repository)
commits = repo.get_commits(author=username)
comments_list = []
for commit in commits:
    tdate = time.mktime(commit.commit.committer.date.timetuple())
    if start_time <= tdate <= end_time:
        comments_list.append(commit.commit.message)

openai.api_key = os.environ.get("OPENAI_API_KEY")
engine = os.environ.get("COMPLETE_ENGINE") or "text-davinci-002"

if comments_list == []:
    print("コミットがありません")
    exit(0)

if engine == "text-davinci-002":
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=f"これはgitlogです。各要素を結合して、全体を15文字でまとめてください：{comments_list}",
        max_tokens=20,
        n=1,
        stop=None,
    )
    print(response.choices[0].text.strip())
elif engine == "gpt-3.5-turbo":
    res = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": f"{comments_list}"},
            {"role": "system", "content": "gitlogのメッセージです。10字に要約し1行でメッセージのみ出力せよ"},
        ]
    )
    print(res.choices[0].message.content)
else:
    raise "engine is not supported"
