Write-Host "Copying React build files to repository root..."; Copy-Item -Path "react-website/build/*" -Destination "." -Recurse -Force; Write-Host "Files copied successfully!"
