$login = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/v1/auth/login' -Method Post -Body (@{email='admin@suarasurabaya.net'; password='password123'} | ConvertTo-Json) -ContentType 'application/json'
$token = $login.data.token
$headers = @{
    'Authorization' = "Bearer $token"
    'Accept' = 'application/json'
}
$divs = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/v1/divisions' -Headers $headers
$divs.data | Format-Table id, name, max_quota, active_applicants, is_locked
