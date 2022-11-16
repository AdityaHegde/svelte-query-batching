package impl

import (
	"context"
	"errors"
	"fmt"

	"github.com/rilldata/svelte-query-batching/server/api"
)

func (s *Server) QueryZero(ctx context.Context, req *api.QueryZeroRequest) (*api.QueryZeroResponse, error) {
	return &api.QueryZeroResponse{
		RespZeroZero: fmt.Sprintf("%s : %s - %d", req.Name, req.ArgZeroZero, req.ArgZeroOne),
	}, nil
}

func (s *Server) QueryOne(ctx context.Context, req *api.QueryOneRequest) (*api.QueryOneResponse, error) {
	return &api.QueryOneResponse{
		RespOneZero: fmt.Sprintf("%s : %s", req.Name, req.ArgOneZero),
		RespOneOne:  int32(len(req.ArgOneZero)),
	}, nil
}

func (s *Server) QueryTwo(ctx context.Context, req *api.QueryTwoRequest) (*api.QueryTwoResponse, error) {
	if req.ArgTwoTwo {
		return nil, errors.New("query two errored out")
	}
	return &api.QueryTwoResponse{
		RespTwoZero: fmt.Sprintf("%s : %d - %s", req.Name, req.ArgTwoZero, req.ArgTwoOne),
	}, nil
}
