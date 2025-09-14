package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/firebase/genkit/go/ai"
	"github.com/firebase/genkit/go/genkit"
	"github.com/firebase/genkit/go/plugins/googlegenai"
	"github.com/firebase/genkit/go/plugins/server"
)

// Define input schema
type RecipeInput struct {
	Ingredient          string `json:"ingredient" jsonschema:"description=Main ingredient or cuisine type"`
	DietaryRestrictions string `json:"dietaryRestrictions,omitempty" jsonschema:"description=Any dietary restrictions"`
}

// Define output schema
type Recipe struct {
	Title        string   `json:"title"`
	Description  string   `json:"description"`
	PrepTime     string   `json:"prepTime"`
	CookTime     string   `json:"cookTime"`
	Servings     int      `json:"servings"`
	Ingredients  []string `json:"ingredients"`
	Instructions []string `json:"instructions"`
	Tips         []string `json:"tips,omitempty"`
}

func main() {
	ctx := context.Background()

	// Initialize Genkit with the Google AI plugin
	g := genkit.Init(ctx,
		genkit.WithPlugins(&googlegenai.GoogleAI{}),
		genkit.WithDefaultModel("googleai/gemini-2.5-flash"),
	)

	// Define a recipe generator flow
	recipeGeneratorFlow := genkit.DefineFlow(g, "recipeGeneratorFlow", func(ctx context.Context, input *RecipeInput) (*Recipe, error) {
		// Create a prompt based on the input
		dietaryRestrictions := input.DietaryRestrictions
		if dietaryRestrictions == "" {
			dietaryRestrictions = "none"
		}

		prompt := fmt.Sprintf(`Create a recipe with the following requirements:
            Main ingredient: %s
            Dietary restrictions: %s`, input.Ingredient, dietaryRestrictions)

		// Generate structured recipe data using the same schema
		recipe, _, err := genkit.GenerateData[Recipe](ctx, g,
			ai.WithPrompt(prompt),
		)
		if err != nil {
			return nil, fmt.Errorf("failed to generate recipe: %w", err)
		}

		return recipe, nil
	})

	// Run the flow once to test it
	recipe, err := recipeGeneratorFlow.Run(ctx, &RecipeInput{
		Ingredient:          "avocado",
		DietaryRestrictions: "vegetarian",
	})
	if err != nil {
		log.Fatalf("could not generate recipe: %v", err)
	}

	// Print the structured recipe
	recipeJSON, _ := json.MarshalIndent(recipe, "", "  ")
	fmt.Println("Sample recipe generated:")
	fmt.Println(string(recipeJSON))

	// Start a server to serve the flow and keep the app running for the Developer UI
	mux := http.NewServeMux()
	mux.HandleFunc("POST /recipeGeneratorFlow", genkit.Handler(recipeGeneratorFlow))

	log.Println("Starting server on http://localhost:3400")
	log.Println("Flow available at: POST http://localhost:3400/recipeGeneratorFlow")
	log.Fatal(server.Start(ctx, "127.0.0.1:3400", mux))
}
