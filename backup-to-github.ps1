param(
  [string]$Message,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Invoke-Git {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Args
  )

  & git @Args
  if ($LASTEXITCODE -ne 0) {
    throw "Git command failed: git $($Args -join ' ')"
  }
}

try {
  $repoRoot = $PSScriptRoot
  Set-Location $repoRoot

  $inside = & git rev-parse --is-inside-work-tree 2>$null
  if ($LASTEXITCODE -ne 0 -or ($inside | Out-String).Trim() -ne 'true') {
    throw "This script must be run from inside a Git repository."
  }

  $remoteUrl = & git remote get-url origin 2>$null
  if ($LASTEXITCODE -ne 0 -or -not $remoteUrl) {
    throw "No 'origin' remote is configured. Add one first, then rerun this script."
  }

  $branch = (& git branch --show-current).Trim()
  if (-not $branch) {
    throw "Detached HEAD is not supported. Please checkout a branch first."
  }

  if (-not $Message) {
    $Message = "backup: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
  }

  Write-Host "Repository: $repoRoot" -ForegroundColor Cyan
  Write-Host "Remote: $remoteUrl" -ForegroundColor Cyan
  Write-Host "Branch: $branch" -ForegroundColor Cyan

  Invoke-Git -Args @('add', '-A')

  $stagedFiles = & git diff --cached --name-only
  if ($stagedFiles) {
    Write-Host "Committing changes..." -ForegroundColor Cyan
    Invoke-Git -Args @('commit', '-m', $Message)
  } else {
    Write-Host "No staged changes detected. Skipping commit." -ForegroundColor Yellow
  }

  $pushArgs = @('push', '-u')
  if ($Force) {
    $pushArgs += '--force-with-lease'
  }
  $pushArgs += 'origin'
  $pushArgs += $branch

  Write-Host "Pushing to origin/$branch..." -ForegroundColor Cyan
  Invoke-Git -Args $pushArgs

  Write-Host "Backup complete." -ForegroundColor Green
}
catch {
  Write-Error $_
  exit 1
}
