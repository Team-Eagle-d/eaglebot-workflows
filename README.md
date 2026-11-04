# eaglebot-workflows
EagleBot을 위한 공통 GitHub Workflows 및 Actions
---

# Features
## Workflows
현재 사용 가능한 Workflows는 다음과 같습니다.

| 이름 | 파일 위치 | 사용 |
| --- | --- | --- |
| CI (with bun) | [`.github/workflows/ci-with-bun.yml`](./.github/workflows/ci-with-bun.yml) | `uses: Team-Eagle-d/eaglebot-workflows/.github/workflows/ci-with-bun@v1` |
| CD | [`.github/workflows/cd.yml`](./.github/workflows/cd.yml) | `uses: Team-Eagle-d/eaglebot-workflows/.github/workflows/cd@v1` |

## Actions
현재 사용 가능한 Actions는 다음과 같습니다.

| 이름 | 파일 위치 | 사용 |
| --- | --- | --- |
| Set up Bun | [`actions/setup-bun`](./actions/setup-bun/action.yml) | `uses: Team-Eagle-d/eaglebot-workflows/actions/setup-bun@v1` |

# Development
## Setup
```bash
git clone https://github.com/Team-Eagle-d/eaglebot-workflows
```

클론하시면 됩니다.