/* eslint-disable @typescript-eslint/no-explicit-any */
interface CodeGeneratorParams {
  webhookUrl: string
  payload: any
  platform: string
}

export function generateCode(language: string, params: CodeGeneratorParams): string {
  const { webhookUrl, payload } = params
  
  switch (language) {
    case 'javascript':
      return generateJavaScript(webhookUrl, payload)
    case 'python':
      return generatePython(webhookUrl, payload)
    case 'curl':
      return generateCurl(webhookUrl, payload)
    case 'php':
      return generatePHP(webhookUrl, payload)
    case 'go':
      return generateGo(webhookUrl, payload)
    case 'rust':
      return generateRust(webhookUrl, payload)
    case 'ruby':
      return generateRuby(webhookUrl, payload)
    case 'java':
      return generateJava(webhookUrl, payload)
    default:
      return generateJavaScript(webhookUrl, payload)
  }
}

function generateJavaScript(webhookUrl: string, payload: any): string {
  return `// Send webhook using fetch API
const webhookUrl = '${webhookUrl}';
const payload = ${JSON.stringify(payload, null, 2)};

async function sendWebhook() {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log('Webhook sent successfully');
      const result = await response.text();
      console.log('Response:', result);
    } else {
      console.error('Failed to send webhook:', response.status);
    }
  } catch (error) {
    console.error('Error sending webhook:', error);
  }
}

sendWebhook();`
}

function generatePython(webhookUrl: string, payload: any): string {
  return `# Send webhook using requests library
import requests
import json

webhook_url = '${webhookUrl}'
payload = ${JSON.stringify(payload, null, 2)}

def send_webhook():
    try:
        response = requests.post(
            webhook_url,
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print('Webhook sent successfully')
            print(f'Response: {response.text}')
        else:
            print(f'Failed to send webhook: {response.status_code}')
            print(f'Error: {response.text}')
            
    except requests.exceptions.RequestException as e:
        print(f'Error sending webhook: {e}')

if __name__ == "__main__":
    send_webhook()`
}

function generateCurl(webhookUrl: string, payload: any): string {
  return `#!/bin/bash
# Send webhook using cURL

curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(payload)}' \\
  -w "\\nHTTP Status: %{http_code}\\n" \\
  -s`
}

function generatePHP(webhookUrl: string, payload: any): string {
  return `<?php
// Send webhook using cURL in PHP

$webhookUrl = '${webhookUrl}';
$payload = ${JSON.stringify(payload, null, 2)};

function sendWebhook($url, $data) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen(json_encode($data))
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch)) {
        echo 'Error: ' . curl_error($ch);
        return false;
    }
    
    curl_close($ch);
    
    if ($httpCode === 200) {
        echo "Webhook sent successfully\\n";
        echo "Response: " . $response . "\\n";
        return true;
    } else {
        echo "Failed to send webhook. HTTP Code: " . $httpCode . "\\n";
        return false;
    }
}

sendWebhook($webhookUrl, $payload);
?>`
}

function generateGo(webhookUrl: string, payload: any): string {
  return `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
    "io/ioutil"
)

func main() {
    webhookURL := "${webhookUrl}"
    payload := ${JSON.stringify(payload, null, 4)}
    
    if err := sendWebhook(webhookURL, payload); err != nil {
        fmt.Printf("Error: %v\\n", err)
    }
}

func sendWebhook(url string, payload interface{}) error {
    jsonData, err := json.Marshal(payload)
    if err != nil {
        return fmt.Errorf("failed to marshal payload: %w", err)
    }
    
    resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
    if err != nil {
        return fmt.Errorf("failed to send webhook: %w", err)
    }
    defer resp.Body.Close()
    
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return fmt.Errorf("failed to read response: %w", err)
    }
    
    if resp.StatusCode == http.StatusOK {
        fmt.Println("Webhook sent successfully")
        fmt.Printf("Response: %s\\n", string(body))
    } else {
        fmt.Printf("Failed to send webhook. Status: %d\\n", resp.StatusCode)
        fmt.Printf("Response: %s\\n", string(body))
    }
    
    return nil
}`
}

function generateRust(webhookUrl: string, payload: any): string {
  return `// Add to Cargo.toml:
// [dependencies]
// reqwest = { version = "0.11", features = ["json"] }
// serde_json = "1.0"
// tokio = { version = "1.0", features = ["full"] }

use reqwest::Client;
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let webhook_url = "${webhookUrl}";
    let payload = json!(${JSON.stringify(payload, null, 4)});
    
    send_webhook(webhook_url, payload).await?;
    Ok(())
}

async fn send_webhook(url: &str, payload: serde_json::Value) -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new();
    
    let response = client
        .post(url)
        .json(&payload)
        .send()
        .await?;
    
    if response.status().is_success() {
        println!("Webhook sent successfully");
        let response_text = response.text().await?;
        println!("Response: {}", response_text);
    } else {
        println!("Failed to send webhook. Status: {}", response.status());
        let error_text = response.text().await?;
        println!("Error: {}", error_text);
    }
    
    Ok(())
}`
}

function generateRuby(webhookUrl: string, payload: any): string {
  return `# Send webhook using Net::HTTP
require 'net/http'
require 'json'
require 'uri'

webhook_url = '${webhookUrl}'
payload = ${JSON.stringify(payload, null, 2)}

def send_webhook(url, data)
  uri = URI.parse(url)
  
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true if uri.scheme == 'https'
  
  request = Net::HTTP::Post.new(uri)
  request['Content-Type'] = 'application/json'
  request.body = data.to_json
  
  begin
    response = http.request(request)
    
    if response.code == '200'
      puts 'Webhook sent successfully'
      puts "Response: #{response.body}"
    else
      puts "Failed to send webhook. Status: #{response.code}"
      puts "Error: #{response.body}"
    end
  rescue => e
    puts "Error sending webhook: #{e.message}"
  end
end

send_webhook(webhook_url, payload)`
}

function generateJava(webhookUrl: string, payload: any): string {
  return `// Send webhook using Java HttpClient (Java 11+)
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class WebhookSender {
    private static final String WEBHOOK_URL = "${webhookUrl}";
    private static final String PAYLOAD = "${JSON.stringify(payload)}";
    
    public static void main(String[] args) {
        try {
            sendWebhook();
        } catch (Exception e) {
            System.err.println("Error sending webhook: " + e.getMessage());
        }
    }
    
    private static void sendWebhook() throws Exception {
        HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(WEBHOOK_URL))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(PAYLOAD))
            .timeout(Duration.ofSeconds(30))
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() == 200) {
            System.out.println("Webhook sent successfully");
            System.out.println("Response: " + response.body());
        } else {
            System.out.println("Failed to send webhook. Status: " + response.statusCode());
            System.out.println("Error: " + response.body());
        }
    }
}`
} 