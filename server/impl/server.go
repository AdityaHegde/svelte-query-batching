package impl

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"time"

	"github.com/AdityaHegde/svelte-query-batching/server/api"
	gateway "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"golang.org/x/sync/errgroup"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type Server struct {
	api.UnsafeBatchingServiceServer
}

var _ api.BatchingServiceServer = (*Server)(nil)

func (s *Server) QueryBatch(req *api.QueryBatchRequest, srv api.BatchingService_QueryBatchServer) error {
	var wg sync.WaitGroup

	ctx := context.Background()

	for _, query := range req.Queries {
		wg.Add(1)
		go func(query *api.QueryRequest) {
			defer wg.Done()
			// time sleep to simulate server process time
			time.Sleep(time.Duration(rand.Int31n(3)) * time.Second)

			resp := api.QueryBatchResponse{
				Result: &api.QueryResponse{
					Id:   query.Id,
					Type: query.Type,
				},
			}

			var err error
			switch query.Type {
			case api.QueryType_Zero:
				var r *api.QueryZeroResponse
				r, err = s.QueryZero(ctx, query.GetZeroRequest())
				if err == nil {
					resp.Result.Query = &api.QueryResponse_ZeroResponse{ZeroResponse: r}
				}

			case api.QueryType_One:
				var r *api.QueryOneResponse
				r, err = s.QueryOne(ctx, query.GetOneRequest())
				if err == nil {
					resp.Result.Query = &api.QueryResponse_OneResponse{OneResponse: r}
				}

			case api.QueryType_Two:
				var r *api.QueryTwoResponse
				r, err = s.QueryTwo(ctx, query.GetTwoRequest())
				if err == nil {
					resp.Result.Query = &api.QueryResponse_TwoResponse{TwoResponse: r}
				}
			}

			if err != nil {
				resp.Result.Error = err.Error()
			}
			if err := srv.Send(&resp); err != nil {
				log.Printf("send error %v", err)
			}
		}(query)
	}

	wg.Wait()
	return nil
}

func (s *Server) Serve(ctx context.Context, grpcPort int, httpPort int) error {
	group, cctx := errgroup.WithContext(ctx)

	server := grpc.NewServer()
	api.RegisterBatchingServiceServer(server, s)
	// Start the gRPC server
	group.Go(func() error {
		return serveGRPC(cctx, server, grpcPort)
	})

	// Start the HTTP gateway targeting the gRPC server
	group.Go(func() error {
		mux := gateway.NewServeMux()
		opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}
		grpcAddress := fmt.Sprintf(":%d", grpcPort)
		err := api.RegisterBatchingServiceHandlerFromEndpoint(ctx, mux, grpcAddress, opts)
		if err != nil {
			return err
		}

		handler := cors(mux)
		server := &http.Server{Handler: handler}
		return serveHTTP(cctx, server, httpPort)
	})

	return group.Wait()
}

func cors(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			if r.Method == "OPTIONS" && r.Header.Get("Access-Control-Request-Method") != "" {
				w.Header().Set("Access-Control-Allow-Headers", "*")
				w.Header().Set("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, PATCH, DELETE")
				return
			}
		}
		h.ServeHTTP(w, r)
	})
}
