FROM node:20-alpine

WORKDIR /usr/src/app
RUN apk add --no-cache libc6-compat openssl

# Copy deps & schema first
COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --ignore-scripts

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run build && npm run start"]
