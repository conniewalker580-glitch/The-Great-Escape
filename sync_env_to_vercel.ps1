$envPath = ".env.local"
if (-not (Test-Path $envPath)) {
    Write-Error ".env.local not found!"
    exit 1
}

$lines = Get-Content $envPath
foreach ($line in $lines) {
    # Skip comments and empty lines
    if ($line.Trim().StartsWith("#") -or $line.Trim() -eq "") { continue }
    
    $parts = $line -split "=", 2
    if ($parts.Length -eq 2) {
        $key = $parts[0].Trim()
        $originalValue = $parts[1].Trim()
        
        # Simple unquote
        $value = $originalValue
        if ($value.Length -ge 2 -and ($value.StartsWith('"') -and $value.EndsWith('"'))) {
            $value = $value.Substring(1, $value.Length - 2)
        }
        elseif ($value.Length -ge 2 -and ($value.StartsWith("'") -and $value.EndsWith("'"))) {
            $value = $value.Substring(1, $value.Length - 2)
        }

        # Filter for relevant keys
        if ($key -match "NEXT_PUBLIC_" -or $key -match "FIREBASE_" -or $key -match "STRIPE_" -or $key -match "CLERK_" -or $key -match "OPENAI_" -or $key -match "HUGGINGFACE_") {
            
            $value | Out-File "temp_val.txt" -NoNewline -Encoding utf8
            
            Write-Host "Syncing $key ..."
            
            # We blindly try to add to all environments. Ignore errors if it exists.
            try {
                Get-Content "temp_val.txt" | vercel env add $key production --force
            }
            catch {}
            try {
                Get-Content "temp_val.txt" | vercel env add $key preview --force
            }
            catch {}
            try {
                Get-Content "temp_val.txt" | vercel env add $key development --force
            }
            catch {}
        }
    }
}

if (Test-Path "temp_val.txt") { Remove-Item "temp_val.txt" }
Write-Host "Environment variables sync complete."
