FROM golang:1.22-alpine AS build
WORKDIR /app
COPY demos/protobuf-app/api/ ./
RUN go build -o server .

FROM alpine:latest
COPY --from=build /app/server /server
EXPOSE 8080
CMD ["/server"]
