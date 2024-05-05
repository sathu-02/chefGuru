import React, { useState } from 'react'
import './Chat.css'
import RecipeCard from '../../Components/RecipeCard'
export default function Chat() {
    const [prompt,setPrompt] = useState(null)
    const [results,setResults] = useState([])

    
    const action = async ()=>{
      const response = await fetch(`https://api.edamam.com/search?q=${prompt}&app_id=7aa516a5&app_key=dc836a223fb788b11ae390504d9e97ce&from=0&to=10`);
      if(response.ok){
        const data= await response.json()
        console.log(`response ok`)
        setResults(data.hits)
      }
    }
    
    return (
      <div className="container">
          <h1>Sanji</h1>

            {results.map(recipe => (
              <RecipeCard image={recipe.recipe.image} label ={recipe.recipe.label} url={recipe.recipe.url} ingredientLines={recipe.recipe.ingredientLines}/> 
            ))}
              <input type="text" id="search" placeholder="Enter ingredients or your recipe....." onChange={(e)=>{
                setPrompt(e.target.value)
              }}/>
              <button type="button" id="submit" className="btn" onClick={action}>Search</button>
            
      </div>

  )
}
