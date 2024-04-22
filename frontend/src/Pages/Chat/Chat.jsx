import React, { useState } from 'react'
import './Chat.css'
import RecipeCard from '../../Components/RecipeCard'
export default function Chat() {
    const [prompt,setPrompt] = useState(null)
    const [results,setResults] = useState([])
    console.log(prompt)
    console.log(typeof results)

    
    const action = async ()=>{
      const response = await fetch(`https://api.edamam.com/search?q=${prompt}&app_id=7aa516a5&app_key=dc836a223fb788b11ae390504d9e97ce&from=0&to=10`);
      if(response.ok){
        const data= await response.json()
        console.log(`response ok`)
        console.log(data.hits)
        setResults(data.hits)
      }
    }
  return (
    <div className="container">
        <h1>Recipe Finder</h1>
    
            <input type="text" id="search" placeholder="Enter ingredients or your recipe....." onChange={(e)=>{
                setPrompt(e.target.value)
            }}/>
            <button type="button" id="submit" className="btn" onClick={action}>Search</button>
            {results.map(recipe => (
              <div id='recipes' key={recipe.recipe.label}>
                  <img src={recipe.recipe.image} alt={recipe.recipe.label} />
                  <h3>{recipe.recipe.label}</h3>
                  <ul>
                      {recipe.recipe.ingredientLines.map(ingredient => (
                            <li key={ingredient}>{ingredient}</li>
                       ))}
                  </ul>
              <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer">
                    View Recipe
              </a>
              {/* Under work */}
              {/* <RecipeCard props/> */}
              <hr />
  </div>
))}
    </div>

  )
}
