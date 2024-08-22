import './Title.css'

export const Title = (Props) => {
  return (
    <div className="header-title">
    <h4>
        <u>{Props.underlined}</u> <span className='colored'>{Props.colored} </span>
    </h4>
    </div>



  )
}
export default Title 
