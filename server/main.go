package main

import (
	"context"

	"github.com/rilldata/svelte-query-batching/server/impl"
)

func main() {
	s := &impl.Server{}
	err := s.Serve(context.Background(), 8082, 8081)
	if err != nil {
		panic(err)
	}
}
