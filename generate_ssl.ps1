$currentDir = Get-Location
$sslDir = Join-Path $currentDir "ssl"

# Create creds file
"secret" | Out-File -FilePath (Join-Path $sslDir "creds") -Encoding ascii -NoNewline

# Run Docker to generate keys
# Mounting $sslDir to /etc/kafka/secrets
$bashCmd = "cd /etc/kafka/secrets && " +
"openssl req -new -x509 -keyout ca.key -out ca.crt -days 3650 -passout pass:secret -subj '/CN=kafka-ca' && " +
"openssl req -new -nodes -keyout server.key -out server.csr -subj '/CN=kafka' && " +
"openssl x509 -req -CA ca.crt -CAkey ca.key -in server.csr -out server.crt -days 3650 -CAcreateserial -passin pass:secret && " +
"rm ca.key server.csr && " +
"chmod 644 ca.crt server.crt server.key creds"

docker run --rm -v ""${sslDir}:/etc/kafka/secrets"" --entrypoint /bin/bash confluentinc/cp-kafka:7.8.0 -c ""$bashCmd""
