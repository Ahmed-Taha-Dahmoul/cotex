import './GameCard.css'

export const GameCard = (Props) => {
  return (
    
         <div className='mostpopular-card'>
            <img className='mostpopular-card-image' src={Props.image} />
            <div className="mostpopular-card-details">
                <div className='title-and-type'>
                <h6 className='mostpopular-card-title'>{Props.title}</h6>
                </div>
                <ul className='rating-and-storage'>
                   
                    <li>{Props.details} </li>
                </ul>


            </div>
            
            </div>
    
  )
}
export default GameCard
