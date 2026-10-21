$loginAdmin = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/v1/auth/login' -Method Post -Body (@{email='admin@suarasurabaya.net'; password='password123'} | ConvertTo-Json) -ContentType 'application/json'
$adminToken = $loginAdmin.data.token

$loginApplicant = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/v1/auth/login' -Method Post -Body (@{email='ahmad.fauzi@student.ac.id'; password='password123'} | ConvertTo-Json) -ContentType 'application/json'
$appToken = $loginApplicant.data.token

$headersApp = @{
    'Authorization' = "Bearer $appToken"
    'Accept' = 'application/json'
    'Content-Type' = 'application/json'
}

# Apply to New Media (id: 12) with study_program: Ilmu Komunikasi
$appPayload = @{
    division_id = 12
    institution_name = 'UIN Sunan Ampel Surabaya'
    study_program = 'Ilmu Komunikasi'
    internship_start = '2026-11-01'
    internship_end = '2027-01-31'
} | ConvertTo-Json

$createApp = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/v1/applications' -Method Post -Headers $headersApp -Body $appPayload
$appId = $createApp.data.id
Write-Host "Created test application ID: $appId"

# Execute sort algorithm as Admin
$headersAdmin = @{
    'Authorization' = "Bearer $adminToken"
    'Accept' = 'application/json'
}

$eval = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/admin/applications/$appId/execute-sort" -Method Post -Headers $headersAdmin
Write-Host "Algorithm Score for Ilmu Komunikasi -> New Media: " $eval.data.rule_results.algorithm_score
Write-Host "R1 Passed: " $eval.data.rule_results.r1_passed
Write-Host "R3 Passed: " $eval.data.rule_results.r3_passed
Write-Host "R4 Passed: " $eval.data.rule_results.r4_passed
Write-Host "Recommendation: " $eval.data.rule_results.recommendation
