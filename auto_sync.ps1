while ($true) {
    # Check if there are any changes (uncommitted or untracked files)
    $changes = git status --porcelain
    
    if ($changes) {
        Write-Host "Detected changes. Syncing to GitHub..." -ForegroundColor Yellow
        git add .
        git commit -m "Auto-sync update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        # Push using the 'nano-origin' remote we configured earlier
        git push nano-origin main
        Write-Host "Changes pushed to GitHub successfully at $(Get-Date -Format 'HH:mm:ss')!" -ForegroundColor Green
    } else {
        # Optional: Uncomment the line below to see when it checks and finds nothing
        # Write-Host "No changes to sync." -ForegroundColor Gray
    }
    
    # Wait for 30 seconds before checking again
    Start-Sleep -Seconds 30
}
