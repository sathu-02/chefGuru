import React, { useState } from 'react'
import './Chat.css'
import RecipeCard from '../../Components/RecipeCard'
import axios from 'axios'

import  Button  from 'react-bootstrap/Button'


export default function Chat() {
    const [prompt,setPrompt] = useState(null)
    const [results,setResults] = useState([])

    
    const action = async ()=>{
      const response = await axios.get(`https://api.edamam.com/search?q=${prompt}&app_id=7aa516a5&app_key=dc836a223fb788b11ae390504d9e97ce&from=0&to=10`);
      if(response.status === 200){
        const data= await response.data
        console.log(`response ok`)
        setResults(data.hits)
      }
    }
    
    return (
      <div className="container">
          
          {prompt && (
            <div className="chat-prompt">
              You: {prompt}
            </div>
          )}

          {results.map(recipe => (
              <RecipeCard image={recipe.recipe.image} label ={recipe.recipe.label} url={recipe.recipe.url} ingredientLines={recipe.recipe.ingredientLines}/> 
            ))}

            <div className='search'>
                <input type="text" id="search" placeholder="Enter ingredients or your recipe....." onChange={(e)=>{
                    setPrompt(e.target.value)
                  }}/>
                
                  <Button onClick={action}>search</Button>
            </div>
              
      </div>

  )
}
