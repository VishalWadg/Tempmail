# 📬 TempMail — Disposable Email Service

A fully functional disposable email service built with **Spring Boot**. Accepts real inbound emails via a custom SMTP server, parses them, stores them in Redis with auto-expiry, and pushes real-time notifications to the browser via WebSocket.

> Built as a learning project exploring SMTP protocol, MIME parsing, Redis Pub/Sub, WebSocket (STOMP), and Hexagonal Architecture in Spring Boot.

---

## ✨ Features

- **Instant inbox on arrival** — a random disposable address is generated the moment the user opens the page, ready to copy and use
- **Real SMTP server** — accepts inbound email on port 2525 from any mail client
- **Catch-all inbox** — accepts mail for any address at the domain, no pre-registration needed
- **MIME parsing** — handles plain text, HTML, multipart emails and attachments
- **Redis storage** — emails stored with configurable TTL (auto-expire after 30 minutes by default)
- **Real-time push** — WebSocket (STOMP) notifies the browser the instant mail arrives, no polling needed
- **REST API** — fetch, read, and delete inboxes via clean JSON endpoints
- **Random address generation** — generates memorable disposable addresses like `swift-eagle-492@domain.com`
- **RFC 7807 error responses** — structured ProblemDetail error format
- **Service Abstraction** — SMTP implementation decoupled via `MailReceiverService` interface, swappable without touching business logic

---

## 🖥️ User Experience

When a user opens the app:

1. A **random disposable address is automatically generated** — e.g. `swift-eagle-492@yourdomain.com`
2. The address is displayed prominently with a **Copy** button — ready to use immediately, no signup required
3. The inbox below is empty and listening for incoming mail via WebSocket
4. User copies the address and uses it anywhere — signups, verifications, trials
5. The moment an email arrives, it **appears instantly** in the inbox with no page refresh
6. User clicks an email to read the full content
7. Available actions at all times:
   - **📋 Copy Address** — copies the current address to clipboard
   - **🔄 Generate New** — generates a fresh random address and clears the current inbox
   - **🗑️ Delete Inbox** — immediately wipes all emails in the current inbox
   - **↻ Refresh** — manually re-fetches the inbox (fallback for missed WebSocket signals)

---

## 🏗️ Architecture

```
Internet / Mail Client
        ↓  SMTP port 2525
CatchAllMessageHandler (SubEthaSMTP)
        ↓
MailReceiverService (interface)
        ↓
EmailService
    ├── MimeParserService    → parses raw MIME bytes → Email object
    └── EmailRepository
            ├── LPUSH inbox:{address} → Redis  (durable, TTL)
            └── PUBLISH inbox:{address} → Redis Pub/Sub (signal)
                        ↓
              RedisMessageListenerContainer
                        ↓
              RedisMailListener.onMessage()
                        ↓
              SimpMessagingTemplate
              → /topic/inbox/{address}  (WebSocket STOMP)
                        ↓
              Browser → calls GET /api/inbox/{address} → renders
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.3.5 |
| SMTP Server | SubEthaSMTP (davidmoten fork 3.1.8) |
| Mail Parsing | Jakarta Mail / angus-mail 2.0.3 |
| Storage | Redis 7 (Spring Data Redis / Lettuce) |
| Real-time | Spring WebSocket + STOMP |
| Build Tool | Maven |
| Local Infrastructure | Docker Compose |

---

## 📁 Project Structure

```
src/main/java/com/tempmail/
├── config/
│   ├── AppConfig.java                  # ModelMapper bean
│   ├── RedisConfig.java                # RedisMessageListenerContainer
│   ├── SmtpServerConfig.java           # SMTP server bootstrap
│   └── WebSocketConfig.java            # STOMP broker configuration
├── smtp/
│   ├── CatchAllMessageHandler.java     # Per-connection SMTP handler (not a Spring bean)
│   └── CatchAllMessageHandlerFactory.java  # Spring-managed factory
├── service/
│   ├── MailReceiverService.java        # Decoupling interface
│   ├── EmailService.java               # Implements MailReceiverService, orchestrates flow
│   ├── MimeParserService.java          # Raw MIME → Email object
│   ├── InboxService.java               # Business logic, DTO mapping
│   └── AddressGeneratorService.java    # Random address generation
├── repository/
│   └── EmailRepository.java            # Redis LPUSH, LRANGE, DEL, TTL
├── controller/
│   ├── InboxController.java            # GET/DELETE inbox endpoints
│   └── AddressController.java          # GET /api/address/generate
├── websocket/
│   └── RedisMailListener.java          # Redis Pub/Sub → STOMP bridge
├── model/
│   └── Email.java                      # Domain model
├── dto/
│   └── EmailDto.java                   # API response projection
└── exception/
    ├── EmailNotFoundException.java
    ├── InboxNotFoundException.java
    └── GlobalExceptionHandler.java     # RFC 7807 ProblemDetail responses
```

---

## 🚀 Getting Started

### Prerequisites

- Java 21
- Maven
- Docker Desktop

### 1. Clone the repository

```bash
git clone https://github.com/your-username/tempmail.git
cd tempmail
```

### 2. Start Redis

```bash
docker compose up -d
```

### 3. Run the application

```bash
./mvnw spring-boot:run
```

### 4. Verify it's running

```
GET http://localhost:8080/actuator/health
```

Expected response:
```json
{
  "status": "UP",
  "components": {
    "redis": { "status": "UP" }
  }
}
```

---

## 📡 API Reference

### Generate a random inbox address

```
GET /api/address/generate
```

Response:
```
swift-eagle-492@localhost
```

---

### Get all emails in an inbox

```
GET /api/inbox/{address}
```

Response:
```json
[
  {
    "id": "59d3bb63-64f1-4bbd-b782-c67b4a451ff9",
    "from": "sender@gmail.com",
    "to": "swift-eagle-492@localhost",
    "subject": "Welcome!",
    "htmlBody": "<h1>Hello</h1>",
    "textBody": "Hello",
    "receivedAt": "2026-05-12T01:34:15.008Z",
    "attachmentNames": []
  }
]
```

---

### Get a single email

```
GET /api/inbox/{address}/{id}
```

---

### Delete an inbox

```
DELETE /api/inbox/{address}
```

Response: `204 No Content`

---

## ⚡ WebSocket (Real-time)

Connect via STOMP over SockJS on the frontend:

```javascript
const client = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),

    onConnect: () => {
        // fetch inbox on initial connect AND every reconnect
        fetchInbox();

        // subscribe to new email signals for this address
        client.subscribe('/topic/inbox/' + address, () => {
            fetchInbox(); // signal arrived → re-fetch source of truth
        });
    },

    reconnectDelay: 5000, // auto-reconnect after 5s
});

client.activate();
```

When a new email arrives the server pushes the email ID to `/topic/inbox/{address}`.
The browser re-fetches the full inbox from the REST API — WebSocket is the trigger, REST API is the source of truth.

---

## 🧪 Testing SMTP Locally

A test client is included at `src/test/java/com/tempmail/SmtpTestClient.java`.

Run it from IntelliJ to simulate an inbound email. It prints the full SMTP handshake and confirms delivery.

---

## ⚙️ Configuration

All values are externalized via environment variables with sensible local defaults:

| Variable | Default | Description |
|---|---|---|
| `TEMPMAIL_DOMAIN` | `localhost` | Domain used for generated addresses |
| `TEMPMAIL_SMTP_PORT` | `2525` | SMTP server listening port |
| `TEMPMAIL_TTL_MINUTES` | `30` | Minutes before emails auto-expire |
| `REDIS_HOST` | `localhost` | Redis server host |
| `REDIS_PORT` | `6379` | Redis server port |

For local development no environment variables are needed — all defaults apply automatically.

For production set these as environment variables on your VPS before starting the application.

---

## 🔄 Complete Email Flow

```
1.  User opens app → GET /api/address/generate → address displayed, ready to copy
2.  User copies address, uses it on any website
3.  Website sends email to address@yourdomain.com
4.  Sender's mail server looks up MX record → finds your server IP
5.  TCP connection established on port 2525
6.  SMTP handshake: EHLO → MAIL FROM → RCPT TO → DATA
7.  CatchAllMessageHandler accepts ALL RCPT TO addresses
8.  Raw InputStream passed to MimeParserService
9.  MimeMessage parses headers, walks MimeMultipart tree recursively
10. Email object built: id, from, to, subject, htmlBody, textBody, attachments
11. EmailRepository.save():
      a. LPUSH inbox:{address} → Redis (durable, TTL 30min)
      b. PUBLISH inbox:{address} {emailId} → Redis Pub/Sub (ephemeral signal)
12. RedisMessageListenerContainer receives PUBLISH event
13. RedisMailListener.onMessage() fires
14. SimpMessagingTemplate.convertAndSend("/topic/inbox/{address}", emailId)
15. Browser WebSocket receives signal
16. Browser calls GET /api/inbox/{address}
17. New email appears in inbox instantly
```

---

## 🏛️ Design Decisions

**Service Abstraction**

`MailReceiverService` interface decouples the SMTP adapter from core business logic. Replacing SubEthaSMTP with Postfix, Haraka, or AWS SES Inbound only requires writing a new adapter — `EmailService`, `MimeParserService`, and `EmailRepository` are completely untouched.

**Redis List for inbox storage**

Emails stored as a Redis List (`LPUSH`) keyed by `inbox:{address}`. Gives natural newest-first ordering, simple range queries via `LRANGE`, and a single `EXPIRE` call covers the entire inbox TTL.

**Signal not payload over WebSocket**

Only the email ID is pushed over WebSocket, not the full email object. The browser always fetches the full inbox from the REST API — WebSocket is the trigger, not the data source. This means missed signals due to dropped connections are automatically recovered on reconnect via a fresh REST API fetch.

**Two Redis operations in save()**

`LPUSH` for durable ordered storage and `PUBLISH` for ephemeral real-time signaling are two separate Redis features used for two distinct purposes in the same save call. Redis acts as both the data store and the message broker.

**Factory pattern for SMTP handler**

`CatchAllMessageHandler` is not a Spring bean — a new instance is created per SMTP connection by the factory. This prevents race conditions on `from` and `recipient` instance fields when multiple emails arrive simultaneously on different threads.

---

## 🗺️ Roadmap

- [x] Custom SMTP server (SubEthaSMTP)
- [x] MIME email parsing
- [x] Redis storage with TTL
- [x] REST API
- [x] Redis Pub/Sub + WebSocket real-time push
- [x] Random address generation
- [x] Global exception handling (RFC 7807)
- [x] Service Abstraction (`MailReceiverService`)
- [x] Environment variable configuration
- [ ] React frontend with real-time inbox UI
- [ ] Jsoup HTML sanitization (XSS prevention)
- [ ] Bucket4j rate limiting per IP
- [ ] Unit and integration tests
- [ ] Multi-stage Dockerfile
- [ ] Nginx reverse proxy + TLS
- [ ] GitHub Actions CI/CD pipeline
- [ ] VPS deployment with real domain + MX record
- [ ] Postfix as production MTA (replacing SubEthaSMTP)

---

## 📄 License

MIT License — free to use, modify, and distribute.
