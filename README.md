## Start db ad rabbitmq in docker

```bash
# development
$ docker-compose build
$ docker-compose up
```

### Add .env file

```bash
DATABASE_URL=postgres://user:password@localhost:5432/cancellation
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=cancellation
TEST_DATABASE_URL=postgres://user:password@localhost:5432/test_db
```

### Run migration

```bash
    $ npm run drizzle:migrate
```

### Seed the database

```bash
    $ npm run drizzle:seed
```

### Start the app

```bash
    $ npm start
```

## Flow diagram

![Flow](./assets/web-flow.png)

### Imitate webhook

localhost:3000/web-hook/cancel-appointment
with user data in the body

```json
{
  "clientId": 1,
  "appointmentId": 1
}
```

## Test

```bash
# unit tests
$ npm run test
```
