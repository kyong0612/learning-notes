package main

import (
	"fmt"
	"iter"
	"slices"
)

func main() {
	type thing struct {
		count int
		name  string
	}

	var somethings iter.Seq[thing] = slices.Values([]thing{
		{5, "A"},
		{11, "B"},
		{15, "C"},
		{1, "D"},
		{9, "E"},
		{13, "F"},
	})

	result := Stream(somethings,
		Filter(func(x thing) bool { return x.count > 10 },
			Sort(func(a thing, b thing) int { return a.count - b.count },
				Map(func(x thing) string { return x.name },
					End))))

	for name := range result {
		fmt.Println(name)
	}
}

func Stream[F, A any](seqA iter.Seq[A], cont func(iter.Seq[A]) F) F {
	return cont(seqA)
}

func End[F any](f F) F {
	return f
}

func Sort[F, A any](cmp func(A, A) int, cont func(iter.Seq[A]) F) func(iter.Seq[A]) F {
	return func(seqA iter.Seq[A]) F {
		newSeqA := slices.Values(slices.SortedFunc(seqA, cmp))
		return cont(newSeqA)
	}
}

func Filter[F, A any](fn func(A) bool, cont func(iter.Seq[A]) F) func(iter.Seq[A]) F {
	return func(seqA iter.Seq[A]) F {
		newSeqA := func(yield func(A) bool) {
			for a := range seqA {
				if fn(a) && !yield(a) {
					return
				}
			}
		}
		return cont(newSeqA)
	}

}
func Map[F, A, B any](fn func(A) B, cont func(iter.Seq[B]) F) func(iter.Seq[A]) F {
	return func(seqA iter.Seq[A]) F {
		seqB := func(yield func(B) bool) {
			for a := range seqA {
				if !yield(fn(a)) {
					return
				}
			}

		}
		return cont(seqB)
	}
}
