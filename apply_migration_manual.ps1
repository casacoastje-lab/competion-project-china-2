$env:S_TOKEN = "sbp_ef0ebc81b01d2d9e070e81a64e957a571caab92b";
$projectRef = "aawjwqudqkvlfuqepwst";
$sqlPath = "c:\Users\Administrator\Desktop\china project competion\supabase\migrations\001_initial_setup.sql";
$sqlContent = Get-Content -Path $sqlPath -Raw;

$body = @{ query = $sqlContent } | ConvertTo-Json;
$headers = @{ 
    Authorization = "Bearer $env:S_TOKEN";
    "Content-Type" = "application/json"
};

try {
    Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects/$projectRef/query" -Method Post -Headers $headers -Body $body;
    Write-Host "Migration successful! Initial setup applied.";
} catch {
    Write-Error "Migration failed: $_";
}
