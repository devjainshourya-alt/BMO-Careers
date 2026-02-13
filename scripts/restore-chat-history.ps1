# Restore BMO project chat history from Shourya Jain to Administrator workspace.
# Run this script ONLY after closing Cursor completely (File -> Exit).

$oldUser = "C:\Users\Shourya Jain\AppData\Roaming\Cursor\User\workspaceStorage\41cb3403b7837b6ea8c6cfc27ef27823"
$newUser = "C:\Users\Administrator\AppData\Roaming\Cursor\User\workspaceStorage\41cb3403b7837b6ea8c6cfc27ef27823"

$files = @("state.vscdb", "state.vscdb.backup")

foreach ($f in $files) {
    $src = Join-Path $oldUser $f
    $dst = Join-Path $newUser $f
    if (-not (Test-Path $src)) {
        Write-Warning "Source not found: $src"
        continue
    }
    try {
        Copy-Item -Path $src -Destination $dst -Force
        Write-Host "Copied: $f"
    } catch {
        Write-Host "ERROR copying $f - Is Cursor still running? Close Cursor and run this script again." -ForegroundColor Red
        Write-Host $_.Exception.Message
        exit 1
    }
}

Write-Host "Done. Reopen Cursor and open the BMO project, then check Previous Chats (Ctrl+Alt+L)." -ForegroundColor Green
