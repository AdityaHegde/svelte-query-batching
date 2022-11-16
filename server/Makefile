.PHONY: build
generate.proto.api:
	go install \
		"google.golang.org/protobuf/cmd/protoc-gen-go" \
		"google.golang.org/grpc/cmd/protoc-gen-go-grpc" \
		"github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway" \
		"github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2"
	protoc --proto_path=api \
		--go_out=api --go_opt=paths=source_relative \
		--go-grpc_out=api --go-grpc_opt=paths=source_relative \
		--grpc-gateway_out=api --grpc-gateway_opt=logtostderr=true --grpc-gateway_opt=paths=source_relative --grpc-gateway_opt=generate_unbound_methods=true \
		--openapiv2_out=api --openapiv2_opt=logtostderr=true \
		api.proto
