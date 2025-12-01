# commit-frontend.ps1
# Commits ONLY the frontend folder file-by-file

$AuthorName = "Rahul"
$AuthorEmail = "veerarahulyadav_ankala@srmap.edu.in"

git config user.name $AuthorName
git config user.email $AuthorEmail

$remote = "https://github.com/rahulya43/E-COMMERCE.git"

# Add remote if missing
try {
    git remote get-url origin > $null 2>&1
} catch {
    git remote add origin $remote
    Write-Host "Added remote origin: $remote"
}

# Make sure main branch exists
git branch -M main

# Get list of all frontend files
$files = Get-ChildItem -Path "./frontend" -Recurse -File | Sort-Object FullName

foreach ($file in $files) {
    $path = $file.FullName.Substring((Get-Location).Path.Length + 1)
    git add "$path"
    git commit -m "feat(frontend): add $path"
    Write-Host "Committed: $path"
}

git push -u origin main
Write-Host "Frontend fully committed & pushed 🎉"
