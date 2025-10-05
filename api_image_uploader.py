import base64
import requests

# API endpoint
url = "http://localhost:8081/api/users/1/upload-picture"

# Basic auth credentials
username = "user1"
password = "xblaster"

# Path to the picture file (your path)
file_path = r"C:\Users\blas_\Pictures\blas1.png"

# Read and encode the picture as base64
with open(file_path, "rb") as f:
    picture_base64 = base64.b64encode(f.read()).decode("utf-8")

# JSON payload
payload = {
    "pictureBase64": picture_base64
}

# Send POST request
response = requests.post(
    url,
    json=payload,
    auth=(username, password),
    headers={"Content-Type": "application/json"}
)

# Print response
print("Status Code:", response.status_code)
print("Response:", response.text)
